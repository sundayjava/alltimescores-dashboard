import { Permission } from "@/lib/permissions";
import {
  LayoutDashboard,
  Users,
  FileText,
  Tag,
  Image,
  FileEdit,
  LucideIcon,
  Layers,
  FolderTree,
  Megaphone,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/console",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    href: "/console/content",
    icon: FileText,
    permission: "view_content",
    children: [
      {
        title: "Posts",
        href: "/console/content/posts",
        icon: FileEdit,
        permission: "view_content",
      },
      {
        title: "Categories",
        href: "/console/content/categories",
        icon: FolderTree,
        permission: "view_content",
      },
      {
        title: "Tags",
        href: "/console/content/tags",
        icon: Tag,
        permission: "manage_tags",
      },
      {
        title: "Content Types",
        href: "/console/content/content-types",
        icon: Layers,
        permission: "edit_settings",
      },
      {
        title: "Media",
        href: "/console/content/media",
        icon: Image,
        permission: "view_content",
      },
    ],
  },
  {
    title: "Users",
    href: "/console/users",
    icon: Users,
    permission: "view_users",
  },
  {
    title: "Broadcasts",
    href: "/console/broadcasts",
    icon: Megaphone,
    permission: "view_settings",
  },
];