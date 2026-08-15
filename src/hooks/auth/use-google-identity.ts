"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        use_fedcm_for_prompt?: boolean;
                    }) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: {
                            type?: "standard" | "icon";
                            shape?: "rectangular" | "pill" | "circle" | "square";
                            size?: "small" | "medium" | "large";
                            theme?: "outline" | "filled_blue" | "filled_black";
                        }
                    ) => void;
                };
            };
        };
    }
}

interface UseGoogleIdentityOptions {
    onCredential: (idToken: string) => void;
}

export function useGoogleIdentity({ onCredential }: UseGoogleIdentityOptions) {
    const [scriptReady, setScriptReady] = useState(false);
    const buttonElRef = useRef<HTMLDivElement | null>(null);
    const renderedRef = useRef(false);

    // Renders the real (invisible) Google button. Safe to call multiple
    // times — it only takes effect once the script has initialized AND the
    // target div has mounted, whichever of those happens second.
    const tryRenderButton = useCallback(() => {
        if (renderedRef.current || !scriptReady || !window.google || !buttonElRef.current) {
            return;
        }

        window.google.accounts.id.renderButton(buttonElRef.current, {
            type: "icon",
            shape: "circle",
            size: "large",
        });
        renderedRef.current = true;
    }, [scriptReady]);

    const onScriptLoad = useCallback(() => {
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: "29583412555-3ssu4jimv703spa5tr26tjhv84coeggo.apps.googleusercontent.com",
            callback: (response) => onCredential(response.credential),
            use_fedcm_for_prompt: true,
        });

        setScriptReady(true);
    }, [onCredential]);

    // Callback ref: catches the case where the div mounts after the script
    // already finished loading.
    const buttonRef = useCallback((node: HTMLDivElement | null) => {
        buttonElRef.current = node;
        if (node) tryRenderButton();
    }, [tryRenderButton]);

    // Catches the case where the div was already mounted before the script
    // finished loading.
    useEffect(() => {
        tryRenderButton();
    }, [tryRenderButton]);

    return { onScriptLoad, buttonRef };
}
