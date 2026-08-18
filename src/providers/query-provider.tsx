"use client";

import "@/lib/api-interceptor";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
    children: ReactNode;
}

// A 4xx means the server understood the request and rejected it on the merits —
// replaying identical bytes cannot change the answer. Retrying only helps for
// transient faults (5xx, network). This matters most for 429: an immediate retry
// spends another slice of a budget that just ran out.
//
// 401 is exempt from this reasoning but unaffected by it: the response
// interceptor handles those by refreshing and replaying before react-query ever
// sees the error.
function retryUnlessClientError(failureCount: number, error: unknown): boolean {
    const status = error instanceof AxiosError ? error.response?.status : undefined;

    if (status !== undefined && status >= 400 && status < 500) {
        return false;
    }

    return failureCount < 1;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                        retry: retryUnlessClientError,
                    },
                    mutations: {
                        retry: retryUnlessClientError,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
