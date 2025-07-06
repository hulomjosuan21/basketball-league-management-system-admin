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

type LoginFormInputs = {
    email: string
    password_str: string
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()
    const onSubmit = async (data: LoginFormInputs) => {
        const formData = new FormData()
        formData.append("email", data.email)
        formData.append("password_str", data.password_str)
        try {
            const res = await login(formData)

            if(res.status && res.redirect) {
                router.push(res.redirect)
            }
        } catch {
            console.log("Something went wrong.")
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
                                    type="email"
                                    placeholder="m@example.com"
                                    value={"noahboat231@gmail.com"}
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
                                <Input type="password" {...register("password_str", { required: true })} value={'password123'}/>
                            </div>
                            <Button type="submit" className="w-full">
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
