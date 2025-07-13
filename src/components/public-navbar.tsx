import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import logoMain from "../../assets/logo-main.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./toggle-theme";
import Image, { StaticImageData } from "next/image";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface PublicNavbarProps {
  logo?: {
    url: string;
    src: StaticImageData;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
}

const PublicNavbar = ({
  logo = {
    url: "http://localhost:3000/",
    src: logoMain,
    alt: "logo",
    title: "BogoBallers.com",
  },
  menu = [
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Test Page",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/test",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
  ],
}: PublicNavbarProps) => {
  return (
    <section className="py-4">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Desktop Navbar */}
        <nav className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt="Logo"
                className="h-8 w-8"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <NavigationMenu className="relative z-50">
              <NavigationMenuList className="flex gap-4 items-center">
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="flex items-center justify-between lg:hidden">
          <a href={logo.url} className="flex items-center gap-2">
            <Image
              src={logo.src}
              alt="Logo"
              className="h-8 w-8"
              width={32}
              height={32}
            />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center gap-2">
                    <Image
                      src={logo.src}
                      alt="Logo"
                      className="h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>
                <div className="flex flex-col gap-3">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="min-w-[400px] p-4 bg-popover text-popover-foreground rounded-md shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.items.map((subItem) => (
              <NavigationMenuLink
                key={subItem.title}
                href={subItem.url}
                className="flex gap-4 rounded-md p-3 transition-colors hover:bg-muted hover:text-accent-foreground"
              >
                {subItem.icon && (
                  <div className="text-foreground">{subItem.icon}</div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{subItem.title}</span>
                  {subItem.description && (
                    <span className="text-sm text-muted-foreground">
                      {subItem.description}
                    </span>
                  )}
                </div>
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      href={item.url}
      className="flex gap-4 rounded-md p-3 transition-colors hover:bg-muted hover:text-accent-foreground"
    >
      {item.icon && <div className="text-foreground">{item.icon}</div>}
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{item.title}</span>
        {item.description && (
          <span className="text-sm text-muted-foreground">
            {item.description}
          </span>
        )}
      </div>
    </a>
  );
};

export { PublicNavbar };
