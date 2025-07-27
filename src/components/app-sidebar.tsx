"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    LayoutDashboard,
    ChartSpline,
    UsersRound,
    UserRound,
    Book,
    Plus,
    GitFork,
    LifeBuoy,
    Send,
    Settings,
    CalendarCheck,
    FileBox,
    ChevronsLeftRightEllipsis,
    CalendarArrowUp,
    FlagTriangleRight
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { NavMain } from "@/components/nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"
import { ScrollArea } from "./ui/scroll-area"
import { NavSecondary } from "./nav-secondary"
import { useQuery } from "@tanstack/react-query"
import { fetchLeagueAdmin } from "@/services/league-admin"
import { Skeleton } from "./ui/skeleton"
import { useLeagueAdmin } from "@/hooks/useLeagueAdmin"

const data = {
    platform: [
        {
            title: "Dashboard",
            url: "/league-administrator/pages/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Analytics",
            url: "/league-administrator/pages/analytics",
            icon: ChartSpline,
        },
        {
            title: "Player",
            url: "#",
            icon: UserRound,
            isActive: true,
            items: [
                {
                    title: "All",
                    url: "#",
                },
                {
                    title: "Submission",
                    url: "/league-administrator/pages/player/submission",
                }
            ],
        },
        {
            title: "Team",
            url: "#",
            icon: UsersRound,
            isActive: true,
            items: [
                {
                    title: "All",
                    url: "#",
                },
                {
                    title: "Submissions",
                    url: "/league-administrator/pages/team/submission",
                }
            ],
        },
    ],
    league: [
        {
            title: "Create",
            url: "/league-administrator/pages/league/create",
            icon: Plus,
        },
        {
            title: "Current",
            url: "/league-administrator/pages/league/current",
            icon: Book,
        },
        {
            title: "Resource",
            url: "/league-administrator/pages/league/resource",
            icon: FileBox,
        },
        {
            title: "Bracket",
            url: "#",
            icon: GitFork,
            isActive: true,
            items: [
                {
                    title: "Structure",
                    url: "/league-administrator/pages/league/bracket/structure",
                },
                {
                    title: "Match Team",
                    url: "/league-administrator/pages/league/bracket/match",
                }
            ],
        }
    ],
    match: [
                {
            title: "Staging Options",
            url: "/league-administrator/pages/match/staging-options",
            icon: FlagTriangleRight,
        },
        {
            title: "Generate Matchups",
            url: "/league-administrator/pages/match/generate-matchup",
            icon: ChevronsLeftRightEllipsis,
        },
        {
            title: "Set Schedule",
            url: "/league-administrator/pages/match/unscheduled",
            icon: CalendarArrowUp
        },
                {
            title: "Scheduled",
            url: "/league-administrator/pages/match/scheduled",
            icon: CalendarCheck,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/league-administrator/pages/settings",
            icon: Settings,
        },
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: admin, isLoading, error } = useLeagueAdmin()

    const navUser = () => {
        if(isLoading) {
            return <NavUserSkeleton />
        }else if(admin != undefined) {
            return <NavUser admin={admin} />
        }else {
            return null
        }
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AppSidebarHeader />
            </SidebarHeader>

            <ScrollArea className="flex-1 overflow-hidden">
                <SidebarContent className="pb-4">
                    {isLoading ? (
                        <div className="space-y-6">
                            <SidebarNavSkeleton label="Platform" count={4} />
                            <SidebarNavSkeleton label="League" count={3} />
                            <SidebarNavSkeleton label="Game" count={1} />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full py-10 text-sm text-muted-foreground">
                            <p>⚠️ Failed to load sidebar: {error.message}</p>
                        </div>
                    ) : (
                        <>
                            <NavMain label="Platform" items={data.platform} />
                            <NavMain label="League" items={data.league} />
                            <NavMain label="Match" items={data.match} />
                        </>
                    )}
                    
                </SidebarContent>
            </ScrollArea>
            <SidebarFooter>
                <div className="border-t border-muted" />
                {!isLoading && !error && (
                        <NavSecondary items={data.navSecondary} className="mt-auto" />
                    )}
                {navUser()}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

function NavUserSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    )
}

function SidebarNavSkeleton({ label, count }: { label: string, count: number }) {
    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-4 pt-4">{label}</p>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 px-4 py-2">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    )
}