"use client";

import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission, isRoleAtLeast } from "@/lib/permissions";
import Link from "next/link";
import {
  Users,
  FileText,
  Tag,
  Shield,
} from "lucide-react";

export default function ConsolePage() {
  const user = useAuthStore(selectUser);

  if (!user) return null;

  // Get user permissions
  const canViewUsers = hasPermission(user.role, "view_users");
  const canViewContent = hasPermission(user.role, "view_content");
  const canManageTags = hasPermission(user.role, "manage_tags");
  const isAtLeastEditor = isRoleAtLeast(user.role, "EDITOR");

  return (
    <div className="flex min-h-screen flex-col">

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.firstName}! 👋
            </h2>
            <p className="text-muted-foreground mt-2">
              Here's what you have access to based on your role: <span className="font-semibold">{user.role}</span>
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Users Module */}
            {canViewUsers && (
              <Link href="/console/users">
                <div className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Users</h3>
                      <p className="text-sm text-muted-foreground">Manage users and roles</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Content Module */}
            {canViewContent && (
              <Link href="/console/content">
                <div className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Content</h3>
                      <p className="text-sm text-muted-foreground">Manage posts and media</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Tags Module */}
            {canManageTags && (
              <Link href="/console/content/tags">
                <div className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Tags</h3>
                      <p className="text-sm text-muted-foreground">Organize content with tags</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Role Info */}
          {isAtLeastEditor && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm">
                <span className="font-semibold">Editor Access:</span> You have elevated permissions to manage and publish content.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}