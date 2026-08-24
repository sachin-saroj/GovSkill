import time
from collections import defaultdict
from fastapi import HTTPException, Request, status


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
        client_ip = request.client.host if request.client else "unknown_client"
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
