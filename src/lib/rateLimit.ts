// Simple in-memory rate limiter
// Resets on each deployment (acceptable for this use-case)

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

interface RateLimitConfig {
    maxRequests: number;  // Max requests per window
    windowMs: number;     // Window size in milliseconds
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60 * 1000 }
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = store.get(identifier);

    // No existing entry or expired - create new one
    if (!entry || now > entry.resetTime) {
        store.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs
        };
    }

    // Existing entry - check if under limit
    if (entry.count < config.maxRequests) {
        entry.count++;
        return {
            allowed: true,
            remaining: config.maxRequests - entry.count,
            resetIn: entry.resetTime - now
        };
    }

    // Over limit
    return {
        allowed: false,
        remaining: 0,
        resetIn: entry.resetTime - now
    };
}

// Helper to get identifier from request (uses IP or falls back to a default)
export function getClientIdentifier(req: Request): string {
    // Try various headers that might contain the real IP
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfIp = req.headers.get('cf-connecting-ip'); // Cloudflare

    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIp) return realIp;
    if (cfIp) return cfIp;

    return 'unknown';
}
