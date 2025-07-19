"use client"

import type React from "react"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { organizationTypes } from "@/constants/organization-tpes"
import { addresses } from "@/constants/addresses"
import { ImageUploadField } from "@/components/ImageUploadField"
import { registerLeagueAdmin } from "@/services/league-admin"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z
    .object({
        organization_logo: z
            .union([z.instanceof(File), z.string().url()])
            .refine(
                (val) => {
                    if (val instanceof File) return val.size > 0
                    return typeof val === "string" && val.trim().length > 0
                },
                { message: "Organization logo is required" }
            ),
        organization_name: z
            .string()
            .min(4, "Organization name must be at least 4 characters")
            .max(250, "Organization name must not exceed 250 characters"),
        organization_type: z.string().min(1, "Please select an organization type"),
        organization_address: z.string().min(1, "Address is required"),
        contact_number: z.string().min(1, "Contact number is required"),
        email: z
            .string()
            .min(16, "Email must be at least 16 characters")
            .max(250, "Email must not exceed 250 characters")
            .email("Please enter a valid email"),
        password_str: z.string().min(8, "Password must be at least 8 characters"),
        confirm_password_str: z.string(),
    })
    .refine((data) => data.password_str === data.confirm_password_str, {
        message: "Passwords don't match",
        path: ["confirm_password_str"],
    })

export default function OrganizationForm() {
    const [addressOpen, setAddressOpen] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const handleError = useHandleErrorWithToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organization_logo: undefined,
            organization_name: "",
            organization_type: "",
            organization_address: "",
            contact_number: "",
            email: "",
            password_str: "",
            confirm_password_str: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData()
        formData.append("organization_logo", values.organization_logo)
        formData.append("organization_name", values.organization_name)
        formData.append("organization_type", values.organization_type)
        formData.append("organization_address", values.organization_address)
        formData.append("contact_number", values.contact_number)
        formData.append("email", values.email)
        formData.append("password_str", values.password_str)
        console.log("Submitted Form Data:")
        console.log({
            organization_logo: values.organization_logo,
            organization_name: values.organization_name,
            organization_type: values.organization_type,
            organization_address: values.organization_address,
            contact_number: values.contact_number,
            email: values.email,
            password_str: values.password_str
        })
        setLoading(true)
        try {
            const response = await registerLeagueAdmin(formData)
            toast.success(response.message)
            router.push('/auth/login')
        } catch (e) {
            handleError(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ImageUploadField name="organization_logo" label="Organization Logo" aspect={1} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="organization_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organization Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter organization name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="organization_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organization Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select organization type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {organizationTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="organization_address"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2 flex flex-col">
                                <FormLabel>Organization Address *</FormLabel>
                                <Popover open={addressOpen} onOpenChange={setAddressOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn("justify-between", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value || "Select address"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search address..." />
                                            <CommandList>
                                                <CommandEmpty>No address found.</CommandEmpty>
                                                <CommandGroup>
                                                    {addresses.map((address) => (
                                                        <CommandItem
                                                            value={address}
                                                            key={address}
                                                            onSelect={() => {
                                                                form.setValue("organization_address", address)
                                                                setAddressOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    address === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {address}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Search and select your organization's address</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number *</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        country={"ph"}
                                        onlyCountries={["ph"]}
                                        disableDropdown={true}
                                        value={field.value}
                                        onChange={(value) => {
                                            if (!value.startsWith("+")) {
                                                field.onChange("+" + value)
                                            } else {
                                                field.onChange(value)
                                            }
                                        }}
                                        inputProps={{
                                            name: "contact_number",
                                            required: true,
                                            className:
                                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !pl-12",
                                        }}
                                        containerClass="w-full"
                                        buttonClass="!border-input !bg-background hover:!bg-accent"
                                        dropdownClass="!bg-background !border-input"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password_str"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password *</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormDescription>Password must be at least 8 characters long</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirm_password_str"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password *</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm password" {...field} />
                                </FormControl>
                                <FormDescription>Must match the password entered</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2Icon className="animate-spin" />}
                        Register Organization
                    </Button>
                </div>
            </form>
        </Form>
    )
}
