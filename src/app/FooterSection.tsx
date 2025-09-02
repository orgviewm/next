/* eslint-disable @typescript-eslint/member-delimiter-style */
import Image from "next/image";
import Link from "next/link";
import { MdOutlineWhatsapp, MdOutlineAttachEmail } from "react-icons/md";
import { LiaTelegram } from "react-icons/lia";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineTicket } from "react-icons/hi2";

import CheckIcon from "@/utils/icons/CheckIcon";
import DiscordIcon from "@/utils/icons/socialMedia/DiscordIcon";
import GithubIcon from "@/utils/icons/socialMedia/GithubIcon";
import TwitterIcon from "@/utils/icons/socialMedia/TwitterIcon";
import YoutubeIcon from "@/utils/icons/socialMedia/YoutubeIcon";
import { viewMarketLogo } from "@/utils/images";

const menuItems = [
  {
    title: "Product",
    items: [
      "Database",
      "Auth",
      "Functions",
      "Realtime",
      "Storage",
      "Vector",
      "Pricing",
      "GA Week",
    ],
  },
  {
    title: "Resources",
    items: [
      "Support",
      "System Status",
      "Become a Partner",
      "Integrations",
      "Experts",
      "Brand Assets / Logos",
      "Security and Compliance",
      "DPA",
      "SOC2",
      "HIPAA",
    ],
  },
  {
    title: "Legal",
    items: [
      { text: "Privacy Policy", href: "/legal/privacy-policy" },
      { text: "Disclaimer", href: "/legal/disclaimer" },
      { text: "Terms of Service", href: "/legal/terms-of-service" },
      { text: "Risk Disclosure", href: "/legal/risk-disclosure" },
      { text: "Cookie Policy", href: "/legal/cookie-policy" },
      { text: "Refund Policy", href: "/legal/refund-policy" },
    ],
  },
  {
    title: "Support",
    items: [
      { text: "WhatsApp", icon: MdOutlineWhatsapp },
      { text: "Telegram", icon: LiaTelegram },
      { text: "24/7 Call Support", icon: IoCallOutline },
      { text: "Email Us", icon: MdOutlineAttachEmail },
      { text: "Raise a Ticket", icon: HiOutlineTicket },
    ],
  },
];
const FooterSection = () => {
  return (
    <div className=" w-full bg-popover">
      <div className=" flex w-full flex-col gap-5 ">
        <div className="mx-auto flex w-full flex-col justify-between gap-10 px-6 py-10 text-sm sm:flex-row md:max-w-[768px] md:px-10 lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px] ">
          <div className="">
            We protect your data.
            <span className="text-brand"> More on Security</span>
          </div>
          <div className="flex flex-col justify-center gap-2 md:flex-row md:items-center md:gap-8">
            <div className="flex gap-3 text-sm font-normal leading-none tracking-tight">
              <CheckIcon />
              SOC2 Type 2{" "}
              <span className="text-foreground-light">Certified</span>
            </div>
            <div className="flex gap-3 text-sm font-normal leading-none tracking-tight">
              <CheckIcon />
              HIPAA <span className="text-foreground-light">Certified</span>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="sm:py-18 container relative mx-auto w-full px-6 py-24 md:max-w-[768px] md:py-24 lg:max-w-[1024px] lg:px-16 lg:py-24 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px]">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center gap-2">
                <Image
                  className="z-0 h-8 w-auto object-cover"
                  src={viewMarketLogo}
                  alt="ViewMarket Logo"
                />
                <span className="text-xl font-semibold text-foreground">
                  ViewMarket
                </span>
              </div>
              <div className="flex items-center gap-5  text-muted-foreground">
                <a
                  className=" scale-110 hover:text-brand "
                  type="button"
                  href="https://x.com/KrinalSojitra"
                >
                  <TwitterIcon />
                </a>
                <a
                  className=" scale-110 hover:text-brand "
                  type="button"
                  href="https://github.com/KrinalSojitra21"
                >
                  <GithubIcon />
                </a>
                <a
                  className=""
                  type="button"
                  href="https://github.com/KrinalSojitra21"
                >
                  <DiscordIcon />
                </a>
                <a
                  className=""
                  type="button"
                  href="https://github.com/KrinalSojitra21"
                >
                  <YoutubeIcon />
                </a>
              </div>
            </div>
            <nav className="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {menuItems?.map((section) => (
                  <div
                    key={section.title}
                    className="flex flex-col gap-4 text-card-foreground"
                  >
                    <h2>{section.title}</h2>
                    <ul className="flex flex-col gap-2">
                      {section.items.map((item, index) => {
                        // Handle support section with icons
                        if (
                          typeof item === "object" &&
                          item.text &&
                          "icon" in item
                        ) {
                          const IconComponent = item.icon;
                          return (
                            <li
                              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                              key={item.text}
                            >
                              <IconComponent className="h-4 w-4" />
                              {item.text}
                            </li>
                          );
                        }
                        // Handle other sections with links
                        else if (typeof item === "object" && "href" in item) {
                          return (
                            <li
                              className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                              key={item.text}
                            >
                              <Link href={item.href}>{item.text}</Link>
                            </li>
                          );
                        }
                        // Fallback
                        return (
                          <li
                            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
                            key={typeof item === "string" ? item : index}
                          >
                            {typeof item === "string" ? item : item.text}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
          <div className="mt-32 w-full ">
            <div className=" border-t border-border pt-8 text-xs text-muted-foreground ">
              © ViewMarket Inc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
