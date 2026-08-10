"use client";

import { useRouter } from "next/navigation";
import {
    User,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { User as UserType } from "@/types/auth";

interface UserMenuProps {
    user: UserType;
    canViewSettings: boolean;
    isPendingLogout: boolean;
    onLogout: () => void;
}

export function UserMenu({
    user,
    canViewSettings,
    isPendingLogout,
    onLogout,
}: UserMenuProps) {
    const router = useRouter();

    return (
        <DropdownMenuContent align="end" className="w-56">

            {/* User info */}
            <DropdownMenuGroup>
                <DropdownMenuLabel>
                    <div>
                        <p className="text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* <DropdownMenuGroup>
                <DropdownMenuItem
                    onClick={() => router.push("/console/profile")}
                >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>

                {canViewSettings && (
                    <DropdownMenuItem
                        onClick={() => router.push("/console/settings")}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    onClick={() => router.push("/console/help")}
                >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                </DropdownMenuItem>
            </DropdownMenuGroup> */}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                <DropdownMenuItem
                    variant="destructive"
                    disabled={isPendingLogout}
                    onClick={onLogout}
                    className="cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isPendingLogout ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    );
}