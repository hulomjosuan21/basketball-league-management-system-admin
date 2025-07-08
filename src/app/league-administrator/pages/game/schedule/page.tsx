import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export default function MatchSchedulePage() {

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
                    <Tabs defaultValue="set" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="set">Set Schedule</TabsTrigger>
                            <TabsTrigger value="pending">Pending Matches</TabsTrigger>
                        </TabsList>
                        <TabsContent value="set">Make changes to your account here.</TabsContent>
                        <TabsContent value="pending">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
    )
}