"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  ChevronRight,
  LayoutDashboard,
  AlertCircle,
  Building2,
  Building,
  Users,
  GalleryVerticalEnd,
  Home,
  AlertOctagon,
  ShieldCheck,
  ToolCase,
  WrenchIcon,
} from "lucide-react";

import { SearchForm } from "@/components/forms/search-form";
// import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { can } from "@/lib/permissions";

// Navigation data
const data = {
  standaloneItems: [
    { title: "Home", url: "/", icon: Home, action: "dashboard" },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      action: "dashboard",
    },
    {
      title: "My Complaints",
      url: "/complaints",
      icon: AlertOctagon,
      action: "complaints",
    },
    {
      title: "All Complaints",
      url: "/complaints/all",
      icon: AlertOctagon,
      action: "all_complaints",
    },
    {
      title: "Resolver Tasks",
      url: "/resolver-tasks",
      icon: WrenchIcon,
      action: "resolver_tasks",
    },
  ],
  navMain: [
    {
      title: "Application Setup",
      url: "#",
      action: "app_setup",
      items: [
        { title: "Issue Def", url: "/issue-def", icon: AlertCircle },
        { title: "Department Def", url: "/department-def", icon: Building2 },
        { title: "Company Def", url: "/company-def", icon: Building },
        { title: "Role Def", url: "/role-def", icon: ShieldCheck },
        { title: "Service Def", url: "/service-def", icon: GalleryVerticalEnd },
        { title: "User Def", url: "/user-def", icon: Users },
        {
          title: "Resolver Management",
          url: "/resolver-management",
          icon: ToolCase,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const role = Cookies.get("userRole") || "";
  console.log("user role: ", role);
  // Filter navigation items based on search query
  const filteredNavMain = useMemo(() => {
    return data.navMain
      .filter((section) => can(role, section.action)) // Hide entire section if no permission
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, role]);

  // Filter standalone items based on search query
  const filteredStandaloneItems = useMemo(() => {
    return data.standaloneItems.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const hasPermission = can(role, item.action);
      return matchesSearch && hasPermission;
    });
  }, [searchQuery, role]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} /> */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Brick Laboriteries</span>
            <span className="">CMS</span>
          </div>
        </SidebarMenuButton>
        <SearchForm onSearch={setSearchQuery} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {filteredStandaloneItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredStandaloneItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredNavMain.map((section) => (
          <Collapsible
            key={section.title}
            title={section.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {section.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <Link href={item.url}>
                            <item.icon className="size-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
