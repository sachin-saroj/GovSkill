import ipaddress
import time
from collections import defaultdict
from fastapi import HTTPException, Request, status


def get_client_ip(request: Request) -> str:
    """
    Extracts the client's real IP address in a proxy-safe manner.

    If the direct peer connection (request.client.host) originates from a trusted proxy
    (loopback or RFC 1918 / RFC 4193 private network subnets, such as Docker bridge or Nginx),
    we inspect the 'X-Forwarded-For' (leftmost client IP) or 'X-Real-IP' headers.

    If the direct peer connection is NOT from a trusted proxy (e.g. untrusted direct client),
    we use request.client.host directly to prevent external IP spoofing.
    """
    if not request.client or not request.client.host:
        return "unknown_client"

    direct_ip = request.client.host

    is_trusted = False
    try:
        ip_obj = ipaddress.ip_address(direct_ip)
        is_trusted = ip_obj.is_loopback or ip_obj.is_private
    except ValueError:
        is_trusted = False

    if is_trusted:
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
            if client_ip:
                return client_ip
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            client_ip = real_ip.strip()
            if client_ip:
                return client_ip

    return direct_ip


class InMemoryRateLimiter:
    def __init__(self, max_requests: int = 30, window_seconds: int = 60, key_prefix: str = ""):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.key_prefix = key_prefix
        self.requests: dict[str, list[float]] = defaultdict(list)

    async def __call__(self, request: Request):
        client_ip = get_client_ip(request)
        rate_key = f"{self.key_prefix}:{client_ip}" if self.key_prefix else client_ip
        self.check_key(rate_key, self.max_requests, self.window_seconds)

    def check_key(self, key: str, max_requests: int | None = None, window_seconds: int | None = None):
        limit = max_requests or self.max_requests
        window = window_seconds or self.window_seconds
        now = time.time()
        valid_timestamps = [ts for ts in self.requests[key] if now - ts < window]
        self.requests[key] = valid_timestamps

        if len(valid_timestamps) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": f"Rate limit exceeded. Maximum {limit} requests per {window}s. Please wait before retrying.",
                    }
                },
            )

        self.requests[key].append(now)

    def reset(self):
        self.requests.clear()
