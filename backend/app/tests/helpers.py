import re


def fetch_latest_otp(captured_emails: list, email: str) -> str:
    clean_email = email.strip().lower()
    for to, subject, body in reversed(captured_emails):
        if to.strip().lower() == clean_email:
            match = re.search(r"\b\d{6}\b", body)
            if match:
                return match.group(0)
    raise ValueError(f"No OTP email found in captured_emails for {email}")


async def complete_staff_registration(
    client, email: str, password: str, captured_emails: list
) -> dict:
    reg_resp = await client.post(
        "/api/auth/register",
        json={"email": email, "password": password},
    )
    assert reg_resp.status_code == 200, f"Register failed: {reg_resp.text}"

    otp = fetch_latest_otp(captured_emails, email)
    verify_resp = await client.post(
        "/api/auth/register/verify",
        json={"email": email, "otp": otp, "password": password},
    )
    assert verify_resp.status_code == 200, f"Register verify failed: {verify_resp.text}"
    return verify_resp.json()


async def complete_admin_login(
    client, email: str, password: str, captured_emails: list
) -> dict:
    login_resp = await client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login_resp.status_code == 200, f"Admin login failed: {login_resp.text}"
    login_data = login_resp.json()
    assert login_data.get("requires_otp") is True, f"Expected 2FA prompt: {login_data}"
    otp_session_id = login_data["otp_session_id"]

    otp = fetch_latest_otp(captured_emails, email)
    verify_resp = await client.post(
        "/api/auth/login/verify-otp",
        json={"otp_session_id": otp_session_id, "otp": otp},
    )
    assert verify_resp.status_code == 200, f"OTP verify failed: {verify_resp.text}"
    return verify_resp.json()
