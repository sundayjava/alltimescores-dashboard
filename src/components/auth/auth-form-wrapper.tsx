import { ReactNode } from "react";
import { AuthLogo } from "./auth-logo";

interface Props {
    title: string;
    description?: string;
    children: ReactNode;
}

export function AuthFormWrapper({
    title,
    description,
    children,
}: Props) {
    return (
        <div className="w-full max-w-sm space-y-8">

            <div className="flex md:justify-normal justify-center">
                <AuthLogo />
            </div>

            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-center md:text-left">
                    {title}
                </h1>

                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {children}

        </div>
    );
}