const ALLOWED_REDIRECT_ROOT = "alltimescores.com";
const ALLOWED_REDIRECT_HOSTS = ["localhost"];

function isAllowedRedirectHost(hostname: string): boolean {
    return (
        hostname === ALLOWED_REDIRECT_ROOT ||
        hostname.endsWith(`.${ALLOWED_REDIRECT_ROOT}`) ||
        ALLOWED_REDIRECT_HOSTS.includes(hostname)
    );
}

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
        if (!isAllowedRedirectHost(url.hostname)) return null;

        return url.toString();
    } catch {
        return null;
    }
}
