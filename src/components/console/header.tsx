"use client";

import { Menu, Bell, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, selectUser, selectHasHydrated } from "@/stores/auth-store";
import { useLogout } from "@/hooks/auth/use-logout";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { UserMenu } from "./user-menu";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const user = useAuthStore(selectUser);
    const hasHydrated = useAuthStore(selectHasHydrated);
    const logoutMutation = useLogout();

    if (!hasHydrated || !user) return null;

    const canViewSettings = hasPermission(user.role, "view_settings");

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
            <div className="flex h-16 items-center gap-4 px-4">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Page Title / Breadcrumb */}
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger
                            render={(props) => (
                                <Button variant="ghost" size="icon" className="relative" {...props}>
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute right-1 top-1 flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                    </span>
                                </Button>
                            )}
                        />
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="p-4 text-sm text-muted-foreground">
                                No new notifications
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={(props) => (
                                <Button variant="ghost" size="icon" {...props}>
                                    <div className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                                        {user.lastName?.[0] || ""}
                                    </div>
                                </Button>
                            )}
                        />

                        <UserMenu
                            user={user}
                            canViewSettings={canViewSettings}
                            isPendingLogout={logoutMutation.isPending}
                            onLogout={handleLogout}
                        />
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}