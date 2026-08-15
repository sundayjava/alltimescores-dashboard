import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUser() {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const query = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            setAuth(query.data.data);
        } else if (query.isError) {
            clearAuth();
        }
    }, [query.data, query.isError, setAuth, clearAuth]);

    return query;
}
