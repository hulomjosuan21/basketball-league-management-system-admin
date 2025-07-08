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

const data = {
    user: {
        name: "Sangguniang Kabataan of Barangay Marangog",
        address: "Brgy. Dakit, Bogo City, Cebu",
        logo: UserRound,
        email: "hulomjosuan@gmail.com",
        profile: "data:image/webp;base64,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bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBkYzpSaWdodHM9IjIwMjUgR2V0dHkgSW1hZ2VzIiBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMiIEdldHR5SW1hZ2VzR0lGVDpBc3NldElEPSIyMjE4NTE2OTgyIiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZXVsYT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgcGx1czpEYXRhTWluaW5nPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3ZvY2FiL0RNSS1QUk9ISUJJVEVELUVYQ0VQVFNFQVJDSEVOR0lORUlOREVYSU5HIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+TWF0dCBXaW5rZWxtZXllcjwvcmRmOmxpPjwvcmRmOlNlcT48L2RjOmNyZWF0b3I+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0PjxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+SE9MTFlXT09ELCBDQUxJRk9STklBIC0gSlVORSAwMzogQW5hIGRlIEFybWFzIGF0dGVuZHMgdGhlIHdvcmxkIHByZW1pZXJlIG9mICZxdW90O0JhbGxlcmluYSZxdW90OywgcHJlc2VudGVkIGJ5IExpb25zZ2F0ZSwgYXQgVENMIENoaW5lc2UgVGhlYXRyZSBvbiBKdW5lIDAzLCAyMDI1IGluIEhvbGx5d29vZCwgQ2FsaWZvcm5pYS4gKFBob3RvIGJ5IE1hdHQgV2lua2VsbWV5ZXIvR2V0dHkgSW1hZ2VzKTwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZGV0YWlsLzIyMTg1MTY5ODI/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmw8L3BsdXM6TGljZW5zb3JVUkw+PC9yZGY6bGk+PC9yZGY6U2VxPjwvcGx1czpMaWNlbnNvcj4KCQk8L3JkZjpEZXNjcmlwdGlvbj4KCTwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz4K"
    },

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
                    url: "#",
                },
                {
                    title: "Rejected",
                    url: "#",
                },
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
                    title: "Submission",
                    url: "#",
                },
                {
                    title: "Rejected",
                    url: "#",
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
                    url: "#",
                },
                {
                    title: "Teams",
                    url: "#",
                }
            ],
        }
    ],
    game: [
        {
            title: "Schedules",
            url: "/league-administrator/pages/game/schedule",
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
    const { data: admin, isLoading, error } = useQuery({
        queryKey: ['fetch-league-admin'],
        queryFn: fetchLeagueAdmin,
        staleTime: 5 * 60_000,
    })

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
                            <NavMain label="Game" items={data.game} />
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