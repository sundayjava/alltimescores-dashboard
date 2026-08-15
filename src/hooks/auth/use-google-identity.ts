"use client";

import { useCallback, useRef } from "react";

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
    const initializedRef = useRef(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const initialize = useCallback(() => {
        if (initializedRef.current || !window.google) return;

        window.google.accounts.id.initialize({
            client_id: "29583412555-3ssu4jimv703spa5tr26tjhv84coeggo.apps.googleusercontent.com",
            callback: (response) => onCredential(response.credential),
            use_fedcm_for_prompt: true,
        });

        if (buttonRef.current) {
            window.google.accounts.id.renderButton(buttonRef.current, {
                type: "icon",
                shape: "circle",
                size: "large",
            });
        }

        initializedRef.current = true;
    }, [onCredential]);

    return { onScriptLoad: initialize, buttonRef };
}
