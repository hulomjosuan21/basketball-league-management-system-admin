"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import React, { useState } from "react"
import { TableTeamSubmission } from "./table"
import { NoLeagueFoundAlert, SmallLoadingAlert } from "@/components/alerts"
import { useLeagueTeam } from "@/hooks/useLeagueTeam"
import { PaymentSheet } from "./sheet"
export default function TeamSubmissionPage() {
  const { leagueTeam, refetchTeamResource } = useLeagueTeam()
  const isLoading = false;

  const header = (
    <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Team Submissions</h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  )

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen w-full overflow-x-hidden overflow-y-auto">
        {header}
        <div className="flex flex-col gap-4 px-4 py-4">
          {isLoading && <SmallLoadingAlert description="Loading"/>}
          {!leagueTeam && <NoLeagueFoundAlert />}

          <PaymentSheet />
          {leagueTeam && <TableTeamSubmission data={leagueTeam ?? []} refresh={refetchTeamResource}/>}
        </div>
      </div>
    </SidebarInset>
  )
}

