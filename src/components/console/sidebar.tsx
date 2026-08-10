"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, selectUser } from "@/stores/auth-store";
import { hasPermission } from "@/lib/permissions";
import { navigation, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const user = useAuthStore(selectUser);
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!user) return null;

  // Toggle nested menu
  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  // Check if nav item should be visible
  const isVisible = (item: NavItem) => {
    if (!item.permission) return true;
    return hasPermission(user.role, item.permission);
  };

  // Check if nav item is active
  const isActive = (href: string) => {
    if (href === "/console") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Render nav item
  const renderNavItem = (item: NavItem, isChild = false) => {
    if (!isVisible(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const hasVisibleChildren = hasChildren && item.children!.some(isVisible);
    const isExpanded = expandedItems.includes(item.title);

    const childIsActive =
      hasChildren &&
      item.children!.some((child) => isActive(child.href));

    const active = childIsActive
      ? false
      : isActive(item.href);

    if (hasVisibleChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isChild ? "pl-8" : "",
              active
                ? "bg-primary/5 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isChild ? "pl-8" : "",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
        {item.badge && (
          <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">{user.firstName} {user.lastName}</span>
            <div className="flex items-center bg-primary/5 px-2 py-0.5 rounded-full">
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0 • {user.plan} Plan
          </p>
        </div>
      </aside>
    </>
  );
}