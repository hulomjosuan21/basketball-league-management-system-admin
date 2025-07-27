import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { usePersistentMatchStore } from "./matchTeamStore";

export default function UnscheduledMatchSheet() {
    const {
        open,
        closeSheet,
    } = usePersistentMatchStore()

    return (
        <Sheet open={open} onOpenChange={closeSheet}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}