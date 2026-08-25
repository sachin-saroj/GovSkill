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
    """
    Sliding window in-memory rate limiter for public unauthenticated endpoints.
    Protects against automated scraping, brute-force enumeration, and denial of service.
    """

    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict[str, list[float]] = defaultdict(list)

    async def __call__(self, request: Request):
        client_ip = get_client_ip(request)
        now = time.time()

        # Evict timestamps older than sliding window
        valid_timestamps = [ts for ts in self.requests[client_ip] if now - ts < self.window_seconds]
        self.requests[client_ip] = valid_timestamps

        if len(valid_timestamps) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": f"Rate limit exceeded. Maximum {self.max_requests} requests per {self.window_seconds}s. Please wait before retrying.",
                    }
                },
            )

        self.requests[client_ip].append(now)

    def reset(self):
        """Clears all stored rate limit records (useful for test isolation)."""
        self.requests.clear()
