"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

enum PDFLoadStatus {
    Idle = "idle",
    Loading = "loading",
    Success = "success",
    Error = "error",
}

export default function CurrentLeaguePage() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfStatus, setPdfStatus] = useState<PDFLoadStatus>(PDFLoadStatus.Idle);

    const handleLoadPdf = async () => {
        try {
            setPdfStatus(PDFLoadStatus.Loading);
            const response = await axiosClient.client.get(`/league/generate-pdf`, {
                responseType: "blob",
            });

            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(blobUrl);
            setPdfStatus(PDFLoadStatus.Success);
        } catch (err) {
            console.error("Failed to load PDF:", err);
            setPdfStatus(PDFLoadStatus.Error);
        }
    };

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <h1 className="text-base font-medium">Create New League</h1>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                onClick={handleLoadPdf}
                                size={'icon'}
                                variant={'secondary'}
                                className="size-7"
                                disabled={pdfStatus === PDFLoadStatus.Loading}
                            >
                                <Printer className={pdfStatus === PDFLoadStatus.Loading ? "animate-spin" : ""} />
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    <div>
                        {pdfStatus === PDFLoadStatus.Idle && (
                            <p className="text-center text-muted-foreground mt-10">No PDF loaded yet.</p>
                        )}
                        {pdfStatus === PDFLoadStatus.Loading && (
                            <p className="text-center text-muted-foreground mt-10">Loading PDF...</p>
                        )}
                        {pdfStatus === PDFLoadStatus.Error && (
                            <p className="text-center text-destructive mt-10">Failed to load PDF.</p>
                        )}
                        {pdfStatus === PDFLoadStatus.Success && pdfUrl && (
                            <div className="flex justify-center">
                                <embed
                                    src={pdfUrl}
                                    type="application/pdf"
                                    className="w-full h-[1056px] shadow-lg border"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}
