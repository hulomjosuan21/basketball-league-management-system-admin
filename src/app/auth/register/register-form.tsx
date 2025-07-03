"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Check, ChevronsUpDown, Upload, X } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { organizationTypes } from "@/constants/organization-tpes"
import { addresses } from "@/constants/addresses"
import ImageUploader from "@/components/image-uploader"

const formSchema = z
    .object({
        organization_logo: z.string().optional(),
        organization_name: z
            .string()
            .min(4, "Organization name must be at least 4 characters")
            .max(250, "Organization name must not exceed 250 characters"),
        organization_type: z.string().min(1, "Please select an organization type"),
        organization_address: z.tuple([z.string().min(1, "Address is required"), z.string().optional()]),
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
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const [addressOpen, setAddressOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            organization_logo: "",
            organization_name: "",
            organization_type: "",
            organization_address: ["", ""],
            contact_number: "",
            email: "",
            password_str: "",
            confirm_password_str: "",
        },
    })

    const handleFileUpload = (file: File) => {
        setLogoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setLogoPreview(result)
            form.setValue("organization_logo", result)
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)
        const imageFile = files.find((file) => file.type.startsWith("image/"))
        if (imageFile) {
            handleFileUpload(imageFile)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const removeFile = () => {
        setLogoFile(null)
        setLogoPreview("")
        form.setValue("organization_logo", "")
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Label htmlFor="logo">Organization Logo</Label>
                <FormField
                    control={form.control}
                    name="organization_logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organization Logo</FormLabel>
                            <FormControl>
                                <ImageUploader value={field.value} onChange={field.onChange} aspectRatio={1} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                    {/* Organization Type */}
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
                                                className={cn("justify-between", !field.value[0] && "text-muted-foreground")}
                                            >
                                                {field.value[0] || "Select address"}
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
                                                                form.setValue("organization_address", [address, ""])
                                                                setAddressOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    address === field.value[0] ? "opacity-100" : "opacity-0",
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

                    {/* Contact Number */}
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

                    {/* Email */}
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

                    {/* Password */}
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

                    {/* Confirm Password */}
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

                {/* Submit Button - Full Width */}
                <div>
                    <Button type="submit" className="w-full" size="lg">
                        Register Organization
                    </Button>
                </div>
            </form>
        </Form>
    )
}
