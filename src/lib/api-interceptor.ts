import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./api";
import { RefreshTokenResponse } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token?: string): void {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    });

    failedQueue = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const { data } = await axios.post<RefreshTokenResponse>(
                `${process.env.NEXT_PUBLIC_API_URL}/platform/auth/refresh`,
                {
                    refreshToken,
                }
            );

            const newAccessToken = data.data.accessToken;
            const newRefreshToken = data.data.refreshToken;

            // Store both new tokens in Zustand store
            useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

            if (api.defaults.headers.common) {
                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            }

            processQueue(null, newAccessToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            useAuthStore.getState().clearAuth();

            window.location.href = "/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);