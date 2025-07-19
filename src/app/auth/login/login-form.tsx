"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image";
import image1 from "../../../../assets/images/image-1.jpg";
import { useForm } from "react-hook-form"
import { login } from "@/services/auth"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { useLeagueAdmin } from "@/hooks/useLeagueAdmin"
import { useFetchLeagueMetaQuery } from "@/hooks/useFetchLeagueMetaQuery"

type LoginFormInputs = {
    email: string
    password_str: string
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const { refetch } = useLeagueAdmin()
    const { refetchLeagueMeta } = useFetchLeagueMetaQuery()
    const handleError = useHandleErrorWithToast()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const onSubmit = async (data: LoginFormInputs) => {
        setIsLoggingIn(true)
        const formData = new FormData()
        formData.append("email", data.email)
        formData.append("password_str", data.password_str)
        try {
            const res = await login(formData)
            await Promise.all([
                refetchLeagueMeta(),
                refetch()
            ])

            if (res.status && res.redirect) {
                router.push(res.redirect)
            }
        } catch (e) {
            handleError(e)
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <p className="text-muted-foreground text-balance">
                                    Login to your League Administrator account
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    disabled={isLoggingIn}
                                    type="email"
                                    placeholder="m@example.com"
                                    defaultValue={"noahboat231@gmail.com"}
                                    {...register("email", { required: true })}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input disabled={isLoggingIn} type="password" {...register("password_str", { required: true })} defaultValue={'password123'} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn && <Loader2 className="animate-spin text-muted-foreground" />}
                                Login
                            </Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="underline underline-offset-4">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src={image1}
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}
