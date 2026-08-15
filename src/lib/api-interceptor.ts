import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";
import { useAuthStore } from "@/stores/auth-store";

// Opt out of the auto-refresh-and-redirect flow: for calls where a 401 is an
// expected, benign outcome (e.g. "is there already a session?" on a public
// page), there's nothing to recover and no session to protect.
declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuthRefresh?: boolean;
    }
}

let isRefreshing = false;

let failedQueue: {
    resolve: () => void;
    reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown): void {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
}

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.skipAuthRefresh
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            // Access/refresh tokens live in httpOnly cookies; the server rotates
            // them via Set-Cookie, so there's nothing to read from the response body.
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/platform/auth/refresh`,
                {},
                { withCredentials: true }
            );

            processQueue(null);

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            useAuthStore.getState().clearAuth();

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
