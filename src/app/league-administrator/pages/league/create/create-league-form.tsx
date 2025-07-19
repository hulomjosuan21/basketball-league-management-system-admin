"use client";

import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/image-uploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LeagueCategorySelector } from "./select-category";
import { Loader2Icon } from "lucide-react";
import { createNewLeague } from "@/services/league-service";
import { useHandleErrorWithToast } from "@/lib/utils/handleError";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LeagueMeta, useLeagueMeta } from "@/lib/stores/useLeagueMeta";
import dynamic from "next/dynamic";
import { RichTextEditorField } from "@/components/RichTextFormEditor";
import { useFetchLeagueMetaQuery } from "@/hooks/useFetchLeagueMetaQuery";
import {leaguTestData} from "@/data/jsons/league-data"
const ImageUploadField = dynamic(() => import("@/components/ImageUploadField").then(m => m.ImageUploadField), {
    ssr: false
})

const CreateLeagueFormSchema = () =>
    z.object({
        league_title: z.string().min(1, "League title is required"),
        league_banner: z.union([
            z.instanceof(File),
            z.string().url()
        ])
            .refine(
                (val) => {
                    if (val instanceof File) return val.size > 0
                    return typeof val === "string" && val.trim().length > 0
                },
                { message: "League banner is required" }
            ),
        budget: z
            .coerce.number({ invalid_type_error: "Budget must be a number" })
            .min(0, "Budget must be at least ₱0")
            .max(10000, "Budget cannot exceed ₱10,000"),
        registration_deadline: z
            .coerce.date()
            .min(new Date(), "Registration deadline must be in the future"),
        opening_date: z
            .coerce.date()
            .min(new Date(), "Opening date must be in the future"),
        start_date: z
            .coerce.date()
            .min(new Date(), "Start date must be in the future"),
        league_description: z.string().min(1, "League description is required"),
        league_rules: z.string().min(1, "League rules are required"),
        categories: z
            .array(
                z.object({
                    category_name: z.string().min(1, "Category name is required"),
                    category_format: z.string().min(1, "Category format is required"),
                    max_team: z
                        .coerce.number({ invalid_type_error: "Max team must be a number" })
                        .min(1, "At least 1 team is required"),
                    entrance_fee_amount: z
                        .coerce.number({ invalid_type_error: "Entrance fee must be a number" })
                        .min(1, "Entrance fee must be at least ₱1"),
                })
            )
            .min(1, "At least one category is required"),
    });

export type CreateLeagueFormValues = z.infer<ReturnType<typeof CreateLeagueFormSchema>>;

interface CreateLeagueFormProps {
    hasLeague: boolean;
}

export default function CreateLeagueForm({ hasLeague }: CreateLeagueFormProps) {
    const schema = useMemo(() => CreateLeagueFormSchema(), []);
    const handleError = useHandleErrorWithToast()
    const { updateLeagueMeta } = useLeagueMeta()
    const [isLoading, setIsLoading] = useState(false)
    const {refetchLeagueMeta} = useFetchLeagueMetaQuery()

    const form = useForm<CreateLeagueFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            league_title: "",
            league_banner: undefined,
            budget: 0,
            registration_deadline: undefined,
            opening_date: undefined,
            start_date: undefined,
            league_description: leaguTestData.description,
            league_rules: leaguTestData.rules,
            categories: [],
        },
    });

    const onSubmit = async (values: CreateLeagueFormValues) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("league_title", values.league_title);
            formData.append("league_description", values.league_description);
            formData.append("league_budget", String(values.budget));
            formData.append("registration_deadline", values.registration_deadline.toISOString());
            formData.append("opening_date", values.opening_date.toISOString());
            formData.append("start_date", values.start_date.toISOString());
            formData.append("league_rules", values.league_rules);
            formData.append("status", "Scheduled");
            formData.append("categories", JSON.stringify(values.categories));
            formData.append("banner_image", values.league_banner);

            const response = await createNewLeague(formData);
            await refetchLeagueMeta()
            toast.success(response.message)
            updateLeagueMeta({ has_league: true })
            form.reset()
        } catch (e) {
            handleError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toDatetimeLocalString = (date: Date): string => {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
            date.getHours()
        )}:${pad(date.getMinutes())}`;
    };

    return (
        <div className={cn(hasLeague && "disable-on-loading-10")}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn(isLoading ? "pointer-events-none opacity-50 space-y-6" : "space-y-6")}>
                    {/* <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="league_banner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>League Banner</FormLabel>
                                <FormControl>
                                    <ImageUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                        aspectRatio={16 / 9}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <FormField
                            control={form.control}
                            name="league_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>League Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter league title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ImageUploadField name="league_banner" label="League Banner" aspect={16 / 9} />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overall League Budget (₱)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="₱0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {[
                            "registration_deadline",
                            "opening_date",
                            "start_date",
                        ].map((fieldName) => (
                            <FormField
                                key={fieldName}
                                control={form.control}
                                name={fieldName as keyof CreateLeagueFormValues}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {fieldName
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                value={field.value instanceof Date ? toDatetimeLocalString(field.value) : ""}
                                                onChange={(e) =>
                                                    field.onChange(new Date(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        {/* <FormField
                            control={form.control}
                            name="league_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>League Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the league" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="league_rules"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>League Rules</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Provide the rules" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    <RichTextEditorField name="league_description" label="League description" />
                    <RichTextEditorField name="league_rules" label="League Rules" />

                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field, fieldState }) => (
                            <LeagueCategorySelector
                                field={field}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <div className="flex items-center space-x-2">
                        <Button type="submit" size="lg" disabled={hasLeague || isLoading} className="flex-1">
                            {isLoading && <Loader2Icon className="animate-spin text-muted-foreground" />}
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}