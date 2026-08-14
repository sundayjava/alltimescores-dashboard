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
                    }) => void;
                    prompt: () => void;
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

    const initialize = useCallback(() => {
        if (initializedRef.current || !window.google) return;

        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: (response) => onCredential(response.credential),
        });

        initializedRef.current = true;
    }, [onCredential]);

    const promptGoogleSignIn = useCallback(() => {
        if (!window.google) return;
        initialize();
        window.google.accounts.id.prompt();
    }, [initialize]);

    return { onScriptLoad: initialize, promptGoogleSignIn };
}
