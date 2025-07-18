"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MatchScheduleTab from "./MatchScheduleTab"
import { useLeagueCategories } from "@/hooks/useLeagueQueries"
export default function MatchSchedulePage() {
    const { leagueCategories } = useLeagueCategories()

    const header = (
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">Match Schedules</h1>
            </div>
        </header>
    )

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                {header}

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    <Tabs
                        key={leagueCategories.map((c) => c.category_id).join('-')}
                        defaultValue={leagueCategories[0]?.category_id}
                        className="w-full"
                    >
                        <TabsList>
                            {leagueCategories.map((category) => (
                                <TabsTrigger
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <Separator className="mb-2" />
                        {leagueCategories.map((category) => (
                            <MatchScheduleTab key={category.category_id} value={category.category_id} />
                        ))}
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
    )
}