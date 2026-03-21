/**
 * view-tracker.ts
 *
 * Lightweight in-memory debounce cache for carousel view counting.
 * Also exports a function to atomically upsert daily view analytics.
 */

const DEBOUNCE_MS = 60_000; // 60 seconds debounce per IP+carousel

// Map<key, expiresAt>
const cache = new Map<string, number>();

/** Returns true if this IP+carousel combination should be counted. */
export function shouldCountView(carouselId: number, ip: string): boolean {
    const key = `${carouselId}:${ip}`;
    const now = Date.now();
    const expiresAt = cache.get(key);
    if (expiresAt && now < expiresAt) return false;
    cache.set(key, now + DEBOUNCE_MS);
    return true;
}

/** Returns today's date as 'YYYY-MM-DD' in UTC. */
export function todayUTC(): string {
    return new Date().toISOString().slice(0, 10);
}

// Periodically evict expired entries (every 5 min)
setInterval(() => {
    const now = Date.now();
    for (const [key, exp] of cache.entries()) {
        if (now >= exp) cache.delete(key);
    }
}, 5 * 60_000).unref();
