import { HandHelping, Users, Zap } from "lucide-react";
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export const heroData = {
  badge: "bogoballers.com",
  heading: "Bogo Basketball League Platform",
  imageSrc: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  imageAlt: "placeholder",
  features: [
    {
      icon: <HandHelping className="h-auto w-5" />,
      title: "Flexible Support",
      description:
        "Benefit from around-the-clock assistance to keep your business running smoothly.",
    },
    {
      icon: <Users className="h-auto w-5" />,
      title: "Teams",
      description:
        "Enhance teamwork with tools designed to simplify project management and communication.",
    },
    {
      icon: <Zap className="h-auto w-5" />,
      title: "Players Energy",
      description:
        "Experience the fastest load times with our high performance servers.",
    },
  ]
}