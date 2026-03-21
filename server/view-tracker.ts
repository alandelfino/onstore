/**
 * view-tracker.ts
 *
 * Lightweight in-memory debounce cache for carousel view counting.
 *
 * Strategy:
 *   - An entry is keyed by `${carouselId}:${ip}`.
 *   - If a key was seen within DEBOUNCE_MS it is considered a duplicate.
 *   - A periodic cleanup task removes expired entries so memory stays bounded.
 */

const DEBOUNCE_MS = 60_000; // 60 seconds – adjustable

// Map<key, expiresAt>
const cache = new Map<string, number>();

/** Returns true if this IP+carousel combination should be counted, false if it is a duplicate. */
export function shouldCountView(carouselId: number, ip: string): boolean {
    const key = `${carouselId}:${ip}`;
    const now = Date.now();

    const expiresAt = cache.get(key);
    if (expiresAt && now < expiresAt) {
        // Still within the debounce window – skip
        return false;
    }

    // Record or refresh the entry
    cache.set(key, now + DEBOUNCE_MS);
    return true;
}

// Periodically evict expired entries so the Map doesn't grow unbounded
const CLEANUP_INTERVAL_MS = 5 * 60_000; // every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, expiresAt] of cache.entries()) {
        if (now >= expiresAt) cache.delete(key);
    }
}, CLEANUP_INTERVAL_MS).unref(); // .unref() lets Node exit even if this timer is pending
