const ALLOWED_REDIRECT_HOSTS = [
    "alltimescores.com",
    "www.alltimescores.com",
    "localhost",
];

export function getRedirectParam(): string | null {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("redirect");
}

export function getSafeRedirectUrl(): string | null {
    const raw = getRedirectParam();
    if (!raw) return null;

    try {
        const url = new URL(raw);

        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
        if (!ALLOWED_REDIRECT_HOSTS.includes(url.hostname)) return null;

        return url.toString();
    } catch {
        return null;
    }
}
