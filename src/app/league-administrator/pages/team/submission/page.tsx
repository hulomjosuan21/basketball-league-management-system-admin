'use client'

import React from 'react'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorAlert, SmallLoadingAlert } from '@/components/alerts'
import { TableTeamSubmission } from './table'
import { PaymentSheet } from './sheet'
import { useLeagueCategories } from '@/hooks/useLeagueQueries'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TeamSubmissionPage() {
  const {
    leagueCategories,
    leagueCategoriesLoading,
    leagueCategoriesError,
  } = useLeagueCategories()

  const header = (
    <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Team Submissions</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  )

  if (leagueCategoriesError) {
    return (
      <SidebarInset>
        <div className="flex flex-col h-screen w-full items-center justify-center text-center px-4">
          <h2 className="text-lg font-semibold text-destructive">Error loading data</h2>
          <p className="text-muted-foreground">
            {String(leagueCategoriesError.message ?? 'Unknown error')}
          </p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen w-full overflow-x-hidden overflow-y-auto">
        {header}

        <div className="flex flex-col gap-4 px-4 py-4">
          {leagueCategoriesLoading && (
            <SmallLoadingAlert description="Loading categories..." />
          )}

          {!leagueCategoriesLoading && leagueCategories.length === 0 && (<ErrorAlert errorMessage='No categories found for this league.' />)}

          {leagueCategories.length > 0 && (
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
                <Separator className='mb-2'/>
              {leagueCategories.map((category) => (
                <TabsContent
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.entrance_fee_amount > 0 && <div className="rounded-md border px-4 py-3 bg-muted/40 text-sm text-muted-foreground">
                    Each team joining this category is required to pay an entrance fee of{' '}
                    <span className="font-semibold text-foreground">
                      ₱{category.entrance_fee_amount.toLocaleString()}
                    </span>.
                  </div>}
                  <PaymentSheet category_id={category.category_id} />
                  <TableTeamSubmission category_id={category.category_id} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
