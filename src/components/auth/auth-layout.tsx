import { ReactNode } from "react";
import { AuthPreview } from "./auth-preview";

interface Props {
  children: ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-6 gap-6 px-8">

        <section className="flex items-center justify-center md:px-8 sm:px-4 px-2 py-12 lg:col-span-3">
          {children}
        </section>

        <section className="hidden items-center justify-center p-8 lg:flex lg:col-span-3">
          <AuthPreview />
        </section>

      </div>
    </main>
  );
}