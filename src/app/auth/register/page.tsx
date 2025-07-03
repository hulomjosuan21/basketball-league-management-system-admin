import { GalleryVerticalEnd } from "lucide-react";
import OrganizationForm from "./register-form";
import RegisterForm from "./register-form";
import image1 from "../../../../assets/images/image-1.jpg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        BogoBallers Inc.
                    </Link>
                </div>
                <div className="flex flex-1 flex-col gap-4 items-center justify-center">
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login " className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                    <RegisterForm />
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <Link href="#">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src={image1}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
