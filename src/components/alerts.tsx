import { CircleAlert, CircleX, Info, Loader2Icon, LucideIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import Link from "next/link"
import { Button } from "./ui/button"

export const LoadingAlert = ({title, description}:{title: string, description: string}) => (
    <Alert>
        <Loader2Icon className="animate-spin" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
            {description}
        </AlertDescription>
    </Alert>
)

export const SmallLoadingAlert = ({ description }: { description: string }) => (
  <Alert className="flex items-center h-8 px-2 py-1 text-sm space-x-2">
    <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
    <AlertDescription className="leading-none m-0">{description}</AlertDescription>
  </Alert>
)

export const ErrorAlert = ({ errorMessage }: { errorMessage: string }) => (
    <Alert variant="destructive">
        <CircleX />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
            {errorMessage}
        </AlertDescription>
    </Alert>
)

export const InfoAlert = ({
    icon: Icon = Info,
    title,
    description,
}: {
    icon?: LucideIcon
    title: string
    description: string
}) => (
    <Alert>
        <Icon/>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
    </Alert>
)

export const NoLeagueFoundAlert = () => (
    <Alert className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2">
            <CircleX />
            <div>
                <AlertTitle>No League Found</AlertTitle>
                <AlertDescription>
                    There is no league available at the moment. Please create one to continue.
                </AlertDescription>
            </div>
        </div>
        <div>
            <Link href="/league-administrator/pages/league/create">
                <Button variant="outline" size={'sm'}>Create League</Button>
            </Link>
        </div>
    </Alert>
)