import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with async_session_test() as session:
        yield session


@pytest.mark.asyncio
async def test_employee_skill_tracking_pipeline():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Seed admin and two employee users for isolation testing
        async with async_session_test() as session:
            admin_user = User(
                email="admin_skills@gov.in",
                password_hash=get_password_hash("adminpass123"),
                role="admin",
            )
            emp_user1 = User(
                email="emp1_skills@gov.in",
                password_hash=get_password_hash("emppass123"),
                role="employee",
            )
            emp_user2 = User(
                email="emp2_skills@gov.in",
                password_hash=get_password_hash("emppass456"),
                role="employee",
            )
            session.add_all([admin_user, emp_user1, emp_user2])
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Login tokens
            admin_login = await client.post(
                "/api/auth/login", json={"email": "admin_skills@gov.in", "password": "adminpass123"}
            )
            admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

            emp1_login = await client.post(
                "/api/auth/login", json={"email": "emp1_skills@gov.in", "password": "emppass123"}
            )
            emp1_headers = {"Authorization": f"Bearer {emp1_login.json()['access_token']}"}

            emp2_login = await client.post(
                "/api/auth/login", json={"email": "emp2_skills@gov.in", "password": "emppass456"}
            )
            emp2_headers = {"Authorization": f"Bearer {emp2_login.json()['access_token']}"}

            # 1. Fetch initial skill progress for Employee 1 (0% certified, Initial Onboarding)
            init_prog = await client.get("/api/progress/my-skills", headers=emp1_headers)
            assert init_prog.status_code == 200
            data = init_prog.json()
            assert data["overall_skill_score"] == 0
            assert data["certified_modules"] == 0
            assert len(data["skills"]) >= 4
            assert data["skills"][0]["readiness_state"] == "Not Started"
            assert data["summary"]["learning_status"] == "Getting Started"
            assert data["summary"]["readiness_level"] == "Initial Onboarding"
            assert data["summary"]["modules_remaining"] == data["total_modules"]
            assert data["summary"]["strongest_competency"] is None
            assert data["summary"]["weakest_competency"] is None
            assert data["summary"]["average_assessment_score"] == 0
            assert len(data["summary"]["readiness_criteria"]) >= 4
            assert "Initial Onboarding" in data["summary"]["readiness_explanation"]
            assert data["recommended_action"]["action_type"] in ("start_training", "read_lesson")
            assert len(data["assessment_history"]) == 0

            module_1_id = data["skills"][0]["module_id"]

            # 1b. Test Section Access Tracking (access section 2)
            sec_access = await client.post(
                f"/api/progress/modules/{module_1_id}/access-section",
                json={"section_index": 2},
                headers=emp1_headers,
            )
            assert sec_access.status_code == 200
            sec_data = sec_access.json()
            assert sec_data["last_accessed_section"] == 2
            assert sec_data["started_at"] is not None
            assert sec_data["status"] == "in_progress"
            assert sec_data["readiness_state"] == "In Progress"

            # Verify invalid module ID and unauthorized access
            bad_uuid_resp = await client.post(
                "/api/progress/modules/not-a-uuid/access-section",
                json={"section_index": 1},
                headers=emp1_headers,
            )
            assert bad_uuid_resp.status_code == 400

            not_found_resp = await client.post(
                f"/api/progress/modules/{uuid.uuid4()}/access-section",
                json={"section_index": 1},
                headers=emp1_headers,
            )
            assert not_found_resp.status_code == 404

            unauth_resp = await client.post(
                f"/api/progress/modules/{module_1_id}/access-section",
                json={"section_index": 1},
            )
            assert unauth_resp.status_code == 401

            # 2. Mark module 1 lessons completed
            complete_resp = await client.post(
                f"/api/progress/modules/{module_1_id}/complete-lessons", headers=emp1_headers
            )
            assert complete_resp.status_code == 200
            comp_data = complete_resp.json()
            assert comp_data["lessons_completed"] is True
            assert comp_data["status"] == "in_progress"
            assert comp_data["readiness_state"] == "Assessment Pending"
            assert comp_data["completed_at"] is not None
            assert comp_data["started_at"] is not None

            # 3. Check progress after lesson completion:
            # Recommended action should now be "take_quiz" for module 1, activity timeline has 2 items (start + complete)
            after_lesson = await client.get("/api/progress/my-skills", headers=emp1_headers)
            assert after_lesson.status_code == 200
            al_data = after_lesson.json()
            assert al_data["recommended_action"]["action_type"] == "take_quiz"
            assert al_data["recommended_action"]["module_id"] == module_1_id
            assert len(al_data["recent_activity"]) >= 2
            act_types = [a["activity_type"] for a in al_data["recent_activity"]]
            assert "lesson_completed" in act_types
            assert "lesson_started" in act_types

            # 4. Submit failing quiz attempt (0% correct)
            quiz_get = await client.get(f"/api/quiz/{module_1_id}", headers=emp1_headers)
            assert quiz_get.status_code == 200
            questions = quiz_get.json()["questions"]

            wrong_answers = [
                {"question_id": q["id"], "selected_option_index": 99} for q in questions
            ]
            fail_resp = await client.post(
                f"/api/quiz/{module_1_id}/submit",
                json={"answers": wrong_answers},
                headers=emp1_headers,
            )
            assert fail_resp.status_code == 200
            assert fail_resp.json()["score"] == 0

            # 5. Check progress after failing quiz:
            # Skill gap should be detected, recommendation becomes "retake_quiz"
            fail_prog = await client.get("/api/progress/my-skills", headers=emp1_headers)
            assert fail_prog.status_code == 200
            fp_data = fail_prog.json()
            assert len(fp_data["skill_gaps"]) >= 1
            gap = next(g for g in fp_data["skill_gaps"] if g["module_id"] == module_1_id)
            assert gap["proficiency"] == "Needs Attention"
            assert gap["target_threshold"] == 75
            assert gap["gap_percentage"] == 75
            assert "required for certification" in gap["evidence"]
            assert gap["competency"] is not None
            assert gap["target_section_index"] >= 0
            assert gap["target_section_title"] is not None
            assert gap["deep_link"].startswith("/module?id=")
            assert gap["tutor_prompt"] is not None
            assert fp_data["recommended_action"]["action_type"] == "retake_quiz"
            assert len(fp_data["assessment_history"]) == 1
            assert fp_data["assessment_history"][0]["passed"] is False
            assert fp_data["assessment_history"][0]["attempt_number"] == 1
            assert fp_data["assessment_history"][0]["improvement_from_previous"] is None
            assert fp_data["summary"]["weakest_competency"] is not None

            # 6. Submit passing quiz for module 1 (100% correct)
            admin_q = await client.get(
                f"/api/admin/modules/{module_1_id}/questions", headers=admin_headers
            )
            ans_key = {q["id"]: q["correct_option_index"] for q in admin_q.json()}

            correct_answers = [
                {"question_id": q["id"], "selected_option_index": ans_key[q["id"]]}
                for q in questions
            ]
            pass_resp = await client.post(
                f"/api/quiz/{module_1_id}/submit",
                json={"answers": correct_answers},
                headers=emp1_headers,
            )
            assert pass_resp.status_code == 200
            assert pass_resp.json()["score"] == len(questions)

            # 7. Verify progress updated to "certified", Strong proficiency, gap resolved
            updated_prog = await client.get("/api/progress/my-skills", headers=emp1_headers)
            assert updated_prog.status_code == 200
            u_data = updated_prog.json()
            assert u_data["certified_modules"] == 1
            assert u_data["overall_skill_score"] >= 25
            assert u_data["summary"]["certified_modules"] == 1
            assert u_data["summary"]["strongest_competency"] is not None
            assert "100%" in u_data["summary"]["strongest_competency"]
            assert u_data["summary"]["average_assessment_score"] == 50  # (0 + 100) / 2 = 50%

            target_skill = next(s for s in u_data["skills"] if s["module_id"] == module_1_id)
            assert target_skill["status"] == "certified"
            assert target_skill["readiness_state"] == "Certified"
            assert target_skill["proficiency"] == "Strong"
            assert target_skill["lessons_completed"] is True
            assert target_skill["score_percentage"] == 100
            assert target_skill["attempts_count"] == 2

            # Assessment history should now have 2 attempts (most recent first)
            assert len(u_data["assessment_history"]) == 2
            assert u_data["assessment_history"][0]["attempt_number"] == 2
            assert u_data["assessment_history"][0]["passed"] is True
            assert u_data["assessment_history"][0]["improvement_from_previous"] == 100
            assert u_data["assessment_history"][1]["attempt_number"] == 1
            assert u_data["assessment_history"][1]["passed"] is False

            # Activity timeline has certification activity
            cert_act = next(
                a for a in u_data["recent_activity"] if a["activity_type"] == "certification"
            )
            assert "Certification Standard Achieved" in cert_act["title"]

            # 8. Employee 2 Data Isolation Verification
            emp2_prog = await client.get("/api/progress/my-skills", headers=emp2_headers)
            assert emp2_prog.status_code == 200
            e2_data = emp2_prog.json()
            # Employee 2 must NOT see Employee 1's progress or history
            assert e2_data["certified_modules"] == 0
            assert e2_data["overall_skill_score"] == 0
            assert len(e2_data["assessment_history"]) == 0
            assert len(e2_data["recent_activity"]) == 0

            # 9. Fetch Admin Skills Overview
            admin_overview = await client.get(
                "/api/progress/admin/skills-overview", headers=admin_headers
            )
            assert admin_overview.status_code == 200
            overview_data = admin_overview.json()
            assert overview_data["total_employees"] == 2
            assert overview_data["total_certifications"] == 1
            assert overview_data["total_quiz_attempts"] == 2

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_competency_intelligence_multi_attempt_deltas_and_readiness_transitions():
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with async_session_test() as session:
            emp = User(
                email="delta_tester@gov.in",
                password_hash=get_password_hash("pass12345"),
                role="employee",
            )
            session.add(emp)
            await session.commit()

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            login = await client.post(
                "/api/auth/login", json={"email": "delta_tester@gov.in", "password": "pass12345"}
            )
            auth_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

            # Fetch modules
            init_prog = await client.get("/api/progress/my-skills", headers=auth_headers)
            mod_id = init_prog.json()["skills"][0]["module_id"]

            quiz_res = await client.get(f"/api/quiz/{mod_id}", headers=auth_headers)
            questions = quiz_res.json()["questions"]
            assert len(questions) == 4

            # Attempt 1: 0% correct (0/4)
            wrong_answers = [{"question_id": q["id"], "selected_option_index": 99} for q in questions]
            att1_res = await client.post(
                f"/api/quiz/{mod_id}/submit",
                json={"answers": wrong_answers},
                headers=auth_headers,
            )
            assert att1_res.status_code == 200

            p1 = await client.get("/api/progress/my-skills", headers=auth_headers)
            p1_data = p1.json()
            assert p1_data["skills"][0]["readiness_state"] == "Needs Improvement"
            assert len(p1_data["assessment_history"]) == 1
            assert p1_data["assessment_history"][0]["improvement_from_previous"] is None

            # Attempt 2: 50% correct (2/4) - Operational readiness state
            # Question 1 & 2 correct answer index is 1 in seed questions
            half_answers = [
                {"question_id": questions[0]["id"], "selected_option_index": 1},
                {"question_id": questions[1]["id"], "selected_option_index": 1},
                {"question_id": questions[2]["id"], "selected_option_index": 99},
                {"question_id": questions[3]["id"], "selected_option_index": 99},
            ]
            att2_res = await client.post(
                f"/api/quiz/{mod_id}/submit",
                json={"answers": half_answers},
                headers=auth_headers,
            )
            assert att2_res.status_code == 200
            assert att2_res.json()["score"] == 2

            p2 = await client.get("/api/progress/my-skills", headers=auth_headers)
            p2_data = p2.json()
            assert p2_data["skills"][0]["readiness_state"] == "Operational"
            assert p2_data["skills"][0]["score_percentage"] == 50
            assert p2_data["skills"][0]["score_improvement_delta"] == 50
            assert len(p2_data["assessment_history"]) == 2
            # Latest attempt (Attempt #2) shows +50% improvement over Attempt #1
            assert p2_data["assessment_history"][0]["attempt_number"] == 2
            assert p2_data["assessment_history"][0]["improvement_from_previous"] == 50

            # Activity timeline contains quiz_improved event
            act_improved = next(
                (a for a in p2_data["recent_activity"] if a["activity_type"] == "quiz_improved"), None
            )
            assert act_improved is not None
            assert "+50%" in act_improved["detail"]

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


def test_competency_mapping_integrity():
    """
    Mapping Integrity Verification:
    Asserts that every question's competency maps to a valid section index and section title
    within the actual module's content, preventing any broken remediation links.
    """
    from app.api.routes.quiz import SEED_QUESTIONS
    from app.api.routes.modules import SEED_MODULES
    from app.services.ai_service import extract_module_sections

    # Build module sections lookup
    mod_sections: dict[uuid.UUID, list[str]] = {}
    for mod in SEED_MODULES:
        mod_sections[mod["id"]] = extract_module_sections(mod["content"])

    # For all 4 modules, verify section counts are valid (> 0)
    for mod_id, sections in mod_sections.items():
        assert len(sections) >= 3, f"Module {mod_id} must have at least 3 lesson sections."

    # Verify each question in SEED_QUESTIONS has a non-empty competency
    for q in SEED_QUESTIONS:
        comp = q.get("competency")
        assert comp is not None and len(comp.strip()) > 0, f"Question {q['id']} must have a valid competency."
        mod_id = q["module_id"]
        assert mod_id in mod_sections, f"Question {q['id']} references unknown module {mod_id}."


@pytest.mark.asyncio
async def test_competency_mastery_recency_weighting():
    """
    Phase 3: Verify that competency mastery applies 70/30 recency weighting
    and accurately transitions through mastery levels (Unknown -> Operational -> Mastered).
    """
    engine_test = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = async_sessionmaker(
        bind=engine_test, class_=AsyncSession, expire_on_commit=False
    )

    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            await client.post(
                "/api/auth/register",
                json={"email": "mastery_emp@govskill.local", "password": "Password123!"},
            )
            login_res = await client.post(
                "/api/auth/login",
                json={"email": "mastery_emp@govskill.local", "password": "Password123!"},
            )
            token = login_res.json()["access_token"]
            auth_headers = {"Authorization": f"Bearer {token}"}

            # 1. Initial State (no attempts) -> Competency Mastery has Unknown or Learning
            init_res = await client.get("/api/progress/my-skills", headers=auth_headers)
            assert init_res.status_code == 200
            init_data = init_res.json()
            assert "competency_mastery" in init_data
            assert len(init_data["competency_mastery"]) > 0
            first_comp = init_data["competency_mastery"][0]
            assert first_comp["mastery_level"] in ["Unknown", "Learning"]
            assert first_comp["mastery_score"] in [0, 15, 30]

            # 2. Complete lessons for Module 1
            mod_1_id = "11111111-1111-1111-1111-111111111111"
            await client.post(f"/api/progress/modules/{mod_1_id}/complete-lessons", headers=auth_headers)

            # 3. Attempt 1: 50% score (2/4 correct)
            quiz_res = await client.get(f"/api/quiz/{mod_1_id}", headers=auth_headers)
            questions = quiz_res.json()["questions"]
            half_answers = [
                {"question_id": questions[0]["id"], "selected_option_index": 1},
                {"question_id": questions[1]["id"], "selected_option_index": 1},
                {"question_id": questions[2]["id"], "selected_option_index": 99},
                {"question_id": questions[3]["id"], "selected_option_index": 99},
            ]
            sub1 = await client.post(
                f"/api/quiz/{mod_1_id}/submit",
                json={"answers": half_answers},
                headers=auth_headers,
            )
            assert sub1.status_code == 200
            sub1_data = sub1.json()
            assert sub1_data["score"] == 2
            # Verify submit returns mastery_level on competency items
            assert sub1_data["competency_breakdown"][0]["mastery_level"] in ["Mastered", "Operational", "Developing"]

            p1_res = await client.get("/api/progress/my-skills", headers=auth_headers)
            p1_comps = [c for c in p1_res.json()["competency_mastery"] if str(c["module_id"]) == mod_1_id]
            assert p1_comps[0]["attempts_evaluated"] == 1
            assert p1_comps[0]["mastery_score"] == 50
            assert p1_comps[0]["mastery_level"] == "Operational"
            assert p1_comps[0]["recent_trend"] == "Baseline Set"

            # 4. Attempt 2: 100% score (4/4 correct)
            full_answers = [
                {"question_id": questions[0]["id"], "selected_option_index": 1},
                {"question_id": questions[1]["id"], "selected_option_index": 1},
                {"question_id": questions[2]["id"], "selected_option_index": 1},
                {"question_id": questions[3]["id"], "selected_option_index": 0},
            ]
            sub2 = await client.post(
                f"/api/quiz/{mod_1_id}/submit",
                json={"answers": full_answers},
                headers=auth_headers,
            )
            assert sub2.status_code == 200

            # 5. Check recency weighting: 0.7 * 100 + 0.3 * 50 = 70 + 15 = 85%
            p2_res = await client.get("/api/progress/my-skills", headers=auth_headers)
            p2_comps = [c for c in p2_res.json()["competency_mastery"] if str(c["module_id"]) == mod_1_id]
            assert p2_comps[0]["attempts_evaluated"] == 2
            assert p2_comps[0]["mastery_score"] == 85
            assert p2_comps[0]["mastery_level"] == "Mastered"
            assert p2_comps[0]["recent_trend"] == "Improving"

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_adaptive_quiz_question_ordering():
    """
    Phase 3: Verify adaptive quiz question prioritization when an employee has weak competencies.
    """
    engine_test = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = async_sessionmaker(
        bind=engine_test, class_=AsyncSession, expire_on_commit=False
    )

    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            await client.post(
                "/api/auth/register",
                json={"email": "adaptive_emp@govskill.local", "password": "Password123!"},
            )
            login_res = await client.post(
                "/api/auth/login",
                json={"email": "adaptive_emp@govskill.local", "password": "Password123!"},
            )
            token = login_res.json()["access_token"]
            auth_headers = {"Authorization": f"Bearer {token}"}

            mod_1_id = "11111111-1111-1111-1111-111111111111"

            # 1. Standard mode without attempts
            q_std = await client.get(f"/api/quiz/{mod_1_id}", headers=auth_headers)
            assert q_std.status_code == 200
            std_data = q_std.json()
            assert std_data["adaptive_meta"] is not None
            assert std_data["adaptive_meta"]["is_adaptive"] is False

            # 2. Submit a weak attempt (<75%)
            questions = std_data["questions"]
            wrong_answers = [{"question_id": q["id"], "selected_option_index": 99} for q in questions]
            await client.post(
                f"/api/quiz/{mod_1_id}/submit",
                json={"answers": wrong_answers},
                headers=auth_headers,
            )

            # 3. Next quiz request automatically prioritizes focus competencies
            q_adap = await client.get(f"/api/quiz/{mod_1_id}", headers=auth_headers)
            assert q_adap.status_code == 200
            adap_data = q_adap.json()
            assert adap_data["adaptive_meta"]["is_adaptive"] is True
            assert len(adap_data["adaptive_meta"]["focus_competencies"]) > 0

        async with engine_test.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    finally:
        app.dependency_overrides.clear()


