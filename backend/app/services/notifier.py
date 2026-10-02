import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("govskill.notifier")


def _send_smtp(to: str, subject: str, body_text: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to
    msg.set_content(body_text)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            try:
                server.starttls()
                server.ehlo()
            except smtplib.SMTPNotSupportedError:
                pass
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception:
        logger.exception("SMTP send failed")


async def send_email(to: str, subject: str, body_text: str) -> None:
    transport = settings.EMAIL_TRANSPORT.lower()
    if transport == "smtp":
        await asyncio.to_thread(_send_smtp, to, subject, body_text)
    else:
        print(f"[NOTIFIER CONSOLE] To: {to} | Subject: {subject} | Body: {body_text.replace(chr(10), ' | ')}")


async def send_login_otp(to: str, otp: str) -> None:
    subject = "Your GovSkill Administrator Login OTP"
    body = (
        f"Your GovSkill administrator one-time login code is: {otp}\n\n"
        "This code expires in 5 minutes.\n"
        "Do not share this code with anyone."
    )
    await send_email(to=to, subject=subject, body_text=body)


async def send_admin_invite(to: str, invite_link: str) -> None:
    subject = "Invitation to GovSkill Administrator Portal"
    body = (
        "You have been invited to register as an administrator on GovSkill.\n\n"
        f"Complete your registration using this link:\n{invite_link}\n\n"
        "This invitation link expires in 30 minutes."
    )
    await send_email(to=to, subject=subject, body_text=body)
