/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  viewMarketLogo,
  structure1,
  structure2,
  structure3,
} from "@/utils/images";
import GithubIcon from "@/utils/icons/socialMedia/GithubIcon";
import DatabaseIcon from "@/utils/icons/feature/DatabaseIcon";
import AuthenticationIcon from "@/utils/icons/feature/AuthenticationIcon";
import EdgeIcon from "@/utils/icons/feature/EdgeIcon";
import StorageIcon from "@/utils/icons/feature/StorageIcon";
import RealTimeIcon from "@/utils/icons/feature/RealTimeIcon";
import VectorIcon from "@/utils/icons/feature/VectorIcon";

import { Button } from "../ui/button";

import MobileMenu from "./MobileMenu"; // Create this component

const list = [
  {
    icon: structure1,
    desc: "Good Tape migrates to ViewMarket managed Postgres and Authentication and achieves database efficiency and a 60% cost reduction",
  },
  {
    icon: structure2,
    desc: "Scaling securely: one million users in 7 months protected with ViewMarket Auth",
  },
  {
    icon: structure3,
    desc: "Mendable.ai switches from Pinecone to ViewMarket for PostgreSQL vector embeddings",
  },
];
const menuItems = [
  {
    icon: <DatabaseIcon />,
    title: "Database",
    description: "Fully portable Postgres database",
  },
  {
    icon: <AuthenticationIcon />,
    title: "Authentication",
    description: "User Management out of the box",
  },
  {
    icon: <StorageIcon />,
    title: "Storage",
    description: "Serverless storage for any media",
  },
  {
    icon: <EdgeIcon />,
    title: "Edge Functions",
    description: "Deploy code globally on the edge",
  },
  {
    icon: <RealTimeIcon />,
    title: "Realtime",
    description: "Synchronization and Broadcast event",
  },
  {
    icon: <VectorIcon />,
    title: "Vector",
    description: "AI toolkit to manage embeddings.",
  },
];

const Developers = ["Documentation", "Integrations", "Changelog", "Support"];
const resources = [
  "Open Source",
  "GitHub Discussions",
  "Become a Partner",
  "Careers",
];
const blog = [
  {
    title: "Postgres Realtime location sharing with MapLibre",
    desc: "Use ViewMarket Realtime to draw live location data onto the map with MapLibre GL JS.",
  },
  {
    title: "Generate Vector Tiles with PostGIS",
    desc: "Use PostGIS to programmatically generate Mapbox Vector Tiles and render them with MapLibre GL.",
  },
];
const CustomerStoryItem = ({ logo, title }: any) => (
  <div className="group flex items-start">
    <div className="  mr-3 flex  aspect-video w-40 flex-shrink-0  items-center justify-center overflow-hidden rounded-md border border-border bg-popover p-5 group-hover:border-foreground-light">
      {typeof logo === "object" ? <Image src={logo} alt={title} /> : logo}
    </div>

    <div className="flex h-full items-center self-center text-sm font-medium text-foreground-light group-hover:text-foreground">
      {title}
    </div>
  </div>
);

const ComparisonLink = ({ text }: any) => (
  <a href="#" className="block text-sm text-foreground-light hover:underline">
    {text}
  </a>
);

const TitleBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="fixed z-20 h-16 w-full border-b border-border bg-background ">
      <nav className="mx-auto h-full w-full px-6 sm:px-0 md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px]">
        <div className="mx-auto flex h-full w-full items-center justify-between lg:px-16 xl:px-20">
          <div className=" flex gap-8 ">
            <a
              className="focus-visible:ring-foreground-lighter focus-visible:ring-offset-background-alternative flex items-center gap-2 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
              type="button"
              href="/"
            >
              <Image
                className="z-0 h-6 w-auto  object-cover "
                src={viewMarketLogo}
                alt="ViewMarket Logo"
              />
              <span className="text-lg font-semibold text-foreground">
                ViewMarket
              </span>
            </a>

            <div className="hidden lg:flex">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>
                    Product
                    <div className="pt-0.5 ">
                      <ChevronDown size={12} />
                    </div>
                  </MenubarTrigger>
                  <MenubarContent className=" max-w-[900px]">
                    <div className="flex">
                      <div className="flex min-w-[40%] flex-none flex-col justify-between p-10">
                        {menuItems.map((item) => (
                          <div key={item.title} className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-card  ">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                {item.title}
                              </div>
                              <div className=" text-sm text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex-grow  bg-card p-10 ">
                        <div className="mb-6">
                          <h3 className="mb-4 text-sm font-semibold text-gray-500">
                            CUSTOMER STORIES
                          </h3>
                          <div className="space-y-4">
                            {list.map((item) => {
                              return (
                                <CustomerStoryItem
                                  key={item.desc}
                                  logo={item.icon}
                                  title={item.desc}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-4 text-sm font-semibold text-gray-500">
                            COMPARE VIEWMARKET
                          </h3>
                          <div className="space-y-2">
                            <ComparisonLink text="ViewMarket vs Firebase" />
                            <ComparisonLink text="ViewMarket vs Heroku Postgres" />
                            <ComparisonLink text="ViewMarket vs Auth0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </MenubarContent>
                  {/* <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New Window <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem disabled>New Incognito Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email link</MenubarItem>
                      <MenubarItem>Messages</MenubarItem>
                      <MenubarItem>Notes</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent> */}
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>
                    Developers
                    <div className="pt-0.5 ">
                      <ChevronDown size={12} />
                    </div>
                  </MenubarTrigger>
                  <MenubarContent className=" max-w-[900px]">
                    <div className=" mx-auto flex  w-full bg-card ">
                      <div className=" w-[35%] bg-background p-5">
                        <h3 className="mb-4 text-sm font-semibold text-gray-500">
                          DEVELOPERS
                        </h3>
                        {Developers.map((data, index) => {
                          return (
                            <div key={index}>
                              <a href="#" className="hover:text-white">
                                {data}
                              </a>
                            </div>
                          );
                        })}
                      </div>

                      <div className="w-[35%] bg-background p-5">
                        <h3 className="mb-4 text-sm font-semibold text-gray-500">
                          RESOURCES
                        </h3>
                        {resources.map((data, index) => {
                          return (
                            <div key={index}>
                              <a href="#" className="hover:text-white">
                                {data}
                              </a>
                            </div>
                          );
                        })}
                      </div>

                      <div className=" space-y-5 bg-card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-gray-500">
                          BLOG
                        </h3>
                        {blog.map((data, index) => (
                          <div key={index}>
                            <a href="#" className="hover:text-white">
                              <h3 className="font-medium">{data.title} </h3>
                              <p className="text-sm text-gray-400">
                                {data.desc}
                              </p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Pricing</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Docs</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Blog</MenubarTrigger>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <a
              className=" flex items-center pr-2 text-xs text-muted-foreground "
              type="button"
              href="https://github.com/KrinalSojitra21"
            >
              <div className="pr-2 text-foreground">
                <GithubIcon />
              </div>
              62.8k
            </a>
            {session ? (
              <Button size="xs" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            ) : (
              <Button size="xs" variant="outline" asChild>
                <a href="/auth">Sign in</a>
              </Button>
            )}
            {/* <ModeToggle /> */}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-brand lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <MobileMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default TitleBar;
