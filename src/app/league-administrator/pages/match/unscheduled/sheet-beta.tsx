import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { usePersistentMatchStore } from "./matchTeamStore";
import MatchCreateForm from "./MatchSchedulerSection";

export default function UnscheduledMatchSheet() {
    const {
        open,
        closeSheet,
    } = usePersistentMatchStore()

    return (
        <Sheet open={open} onOpenChange={closeSheet}>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Schedule Match</SheetTitle>
                    <SheetDescription>
                        Set up the date, time, and other details for this match.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex justify-center p-4">
                    <MatchCreateForm/>
                </div>
            </SheetContent>
        </Sheet>
    );
}