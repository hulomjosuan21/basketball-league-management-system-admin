'use client'

import { BorderBeam } from "@/components/magicui/border-beam"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import defaultImage from "../../../../../assets/images/image-3.jpg"
import { SectionCards } from "./section-cards"
import { LeagueAdminType } from "@/models/league-administrator"
import { ImageUploadField } from "@/components/ImageUploadField"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { useEffect, useMemo } from "react"

const formSchema = z.object({
  hero_image: z
    .union([z.instanceof(File), z.string().url()])
    .refine(
      (val) => {
        if (val instanceof File) return val.size > 0
        return typeof val === "string" && val.trim().length > 0
      },
      { message: "Image is required" }
    ),
})

type FormValues = z.infer<typeof formSchema>

const DashboardHero = ({ admin }: { admin: LeagueAdminType }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero_image: "",
    },
  })

  const { handleSubmit, control } = form
  const heroImage = useWatch({ control, name: "hero_image" })

  const previewUrl = useMemo(() => {
    if (!heroImage) return null
    if (typeof heroImage === "string") return heroImage
    return URL.createObjectURL(heroImage)
  }, [heroImage])

  useEffect(() => {
    if (heroImage) {
      handleSubmit(onSubmit)()
    }
  }, [heroImage])

  const onSubmit = (values: FormValues) => {
    console.log("Auto-submitted image:", values.hero_image)
    // You can persist here
  }

  const decorLines = (
    <>
      <span className="-inset-x-1/5 bg-border absolute top-0 -z-10 h-px [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
      <span className="-inset-x-1/5 bg-border absolute bottom-0 -z-10 h-px [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
      <span className="-inset-x-1/5 border-border absolute top-12 h-px border-t border-dashed [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
      <span className="-inset-x-1/5 border-border absolute bottom-12 h-px border-t border-dashed [mask-image:linear-gradient(to_right,transparent_1%,black_10%,black_90%,transparent_99%)]" />
      <span className="-inset-y-1/5 left-1/6 border-border absolute w-px border-r border-dashed [mask-image:linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]" />
      <span className="-inset-y-1/5 right-1/6 border-border absolute w-px border-r border-dashed [mask-image:linear-gradient(to_bottom,transparent_1%,black_10%,black_90%,transparent_99%)]" />
    </>
  )

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="border-border border-x pb-20 lg:pb-48">
          <div className="relative max-w-2xl px-4 pb-4 flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={admin.organization_logo_url}
                alt="org name"
                className="object-cover"
              />
              <AvatarFallback>{admin.organization_name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold tracking-tight">
              {admin.organization_name}
            </span>
          </div>

          <FormProvider {...form}>
            <form className="relative isolate px-2">
              <div className="relative z-10">
                <Image
                  src={previewUrl || defaultImage}
                  alt="Dashboard Visual"
                  fill={false}
                  width={1280}
                  height={720}
                  className="border-border aspect-[16/9] w-full border object-cover shadow-[0_6px_20px_rgb(0,0,0,0.12)]"
                />
                <BorderBeam duration={8} size={200} borderWidth={2} />

                <div className="absolute top-2 right-2 z-20">
                  <ImageUploadField name="hero_image" iconOnly />
                </div>
              </div>

              {decorLines}

              <div className="relative mt-2 px-4 w-full max-w-5xl mx-auto lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-20">
                <SectionCards />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </section>
  )
}

export { DashboardHero }
