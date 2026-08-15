"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { PageSpinner } from "@/components/ui/spinner";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading || isError) {
    return <PageSpinner />;
  }

  return <>{children}</>;
}
