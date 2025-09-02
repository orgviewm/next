/* eslint-disable @typescript-eslint/member-delimiter-style */
import "./globals.css";
import { SunIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CheckIcon from "@/utils/icons/CheckIcon";
import { cn } from "@/lib/utils";
import ImgPlaceHolderIcon from "@/utils/icons/ImgPlaceHolderIcon";
import {
  database,
  edgefunction,
  realtimeImage,
  viewMarketPosgress,
  vectorImage,
} from "@/utils/images";
import DatabaseIcon from "@/utils/icons/feature/DatabaseIcon";
import AuthenticationIcon from "@/utils/icons/feature/AuthenticationIcon";
import EdgeIcon from "@/utils/icons/feature/EdgeIcon";
import StorageIcon from "@/utils/icons/feature/StorageIcon";
import RealTimeIcon from "@/utils/icons/feature/RealTimeIcon";
import VectorIcon from "@/utils/icons/feature/VectorIcon";

function FeatureSection() {
  const ListItem = ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children?: ReactNode;
    props?: HTMLAttributes<HTMLElement>;
  }) => (
    <li
      className={cn(
        "flex gap-2 text-sm font-normal leading-none tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
  return (
    <div className="flex w-full flex-col gap-3 overflow-hidden px-6 md:max-w-[768px] lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px] ">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-4 xl:gap-3 2xl:gap-6">
        <Card className="relative col-span-6 flex h-[400px] w-full flex-col justify-between overflow-hidden lg:col-span-12 lg:flex-row xl:col-span-6">
          <div className="flex h-fit flex-col items-center justify-between  gap-5 p-7 lg:h-full  lg:w-[50%] lg:items-start ">
            <div className=" flex flex-col items-center gap-5 lg:items-start">
              <Button variant="outline" size="icon" className=" border-none">
                <DatabaseIcon />
              </Button>

              <CardHeader className="p-0">
                <CardTitle className=" text-center lg:text-start">
                  Database
                </CardTitle>
                <CardDescription className="text-center lg:text-start">
                  Every project is a full Postgres database, the world&apos;
                  most trusted relational database.
                </CardDescription>
              </CardHeader>
            </div>
            <ul className="hidden flex-col gap-1 pb-5 pt-10 lg:block">
              <ListItem>
                <CheckIcon />
                100% portable
              </ListItem>
              <ListItem>
                <CheckIcon />
                Built-in Auth with RLS
              </ListItem>
              <ListItem>
                <CheckIcon />
                Easy to extend
              </ListItem>
            </ul>
          </div>
          <div className="w-full lg:relative lg:w-[50%]">
            <figure
              className="inset-0 z-0  lg:absolute"
              role="img"
              aria-label="ViewMarket Postgres database visual composition"
            >
              <span className="absolute left-0 right-0 top-24 my-auto flex h-full w-full items-end justify-center md:top-24 lg:bottom-0 lg:left-auto lg:top-0 lg:aspect-square lg:w-auto lg:items-center lg:justify-end">
                <Image
                  src={database}
                  alt=""
                  className="absolute inset-0 h-full w-full text-transparent"
                />
                <Image
                  src={viewMarketPosgress}
                  alt=""
                  className="absolute z-10 m-auto h-full w-full opacity-0 transition-opacity will-change-transform group-hover:opacity-100 "
                />
              </span>
            </figure>
          </div>
        </Card>
        <Card className="group col-span-6 flex h-[400px] flex-col items-center justify-between gap-5  overflow-clip pt-7 xl:col-span-3">
          <div className=" flex flex-col items-center gap-5">
            {" "}
            <Button variant="outline" size="icon" className=" border-none">
              <AuthenticationIcon />
            </Button>
            <CardHeader className="px-5 py-0 text-center  ">
              <CardTitle>Authentication</CardTitle>
              <CardDescription className="">
                Add user sign ups and logins, securing your data with Row Level
                Security.
              </CardDescription>
            </CardHeader>
          </div>
          <div className="group mb-[-10px] flex w-full justify-between gap-4">
            <div className="ml-[-10px] flex flex-1 flex-col gap-3 ">
              <div className="w-full rounded-r-lg border border-input bg-background px-4 py-4 text-sm text-input  ">
                @gmail.com
              </div>
              <div className="w-full rounded-r-lg border border-input bg-background px-4 py-4 text-sm text-input group-hover:border-[#3FCF8E] group-hover:text-[#3FCF8E]">
                ccess Required
              </div>
              <div className="w-full rounded-r-lg border border-input bg-background px-4 py-4 text-sm text-input ">
                7@gmail.com
              </div>
            </div>
            <div className="mr-[-10px] flex flex-1 flex-col gap-3">
              <div className="w-full rounded-l-lg border border-input bg-background px-4 py-4 text-sm text-input ">
                alex160198
              </div>
              <div className="w-full whitespace-nowrap rounded-l-lg border border-input bg-background px-4 py-4 text-sm text-input group-hover:border-[#3FCF8E] group-hover:text-[#3FCF8E]">
                Access Required
              </div>
              <div className="w-full rounded-l-lg border border-input bg-background px-4 py-4 text-sm text-input ">
                mememaster
              </div>
            </div>
          </div>
        </Card>
        <Card className="group relative col-span-6 flex h-[400px] flex-col items-center gap-5 overflow-clip pt-7 xl:col-span-3">
          <Button variant="outline" size="icon" className=" border-none">
            <EdgeIcon />
          </Button>
          <CardHeader className="z-10 px-5 py-0 text-center  ">
            <CardTitle>Edge Functions</CardTitle>

            <CardDescription className="">
              Easily write custom code without deploying or scaling servers.
              ViewMarket Edge Functions globe
            </CardDescription>
          </CardHeader>
          <div className="absolute bottom-0 z-0 h-full w-full">
            {/* <Image src={edgefunction} alt="" className="" /> */}
            <figure
              className="absolute inset-0 z-0  w-full"
              role="img"
              aria-label="ViewMarket Postgres database visual composition"
            >
              <span className="absolute inset-0 object-cover object-center ">
                <Image
                  src={edgefunction}
                  alt=""
                  className="absolute inset-0 h-full w-full text-transparent"
                />
              </span>
            </figure>
          </div>
        </Card>
        <Card className="group col-span-6 flex h-[400px] flex-col items-center gap-5  overflow-clip px-7 pt-7 xl:col-span-3">
          <Button variant="outline" size="icon" className=" border-none">
            <StorageIcon />
          </Button>
          <CardHeader className="p-0 text-center ">
            <CardTitle>Storage</CardTitle>
            <CardDescription className="">
              Store, organize, and serve large files, from videos to images.
            </CardDescription>
          </CardHeader>
          <div className="relative  overflow-x-hidden">
            <div className="relative left-0 z-10 flex h-full w-auto animate-marquee items-end pb-2 transition-transform will-change-transform paused group-hover:running">
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-0 z-10 flex h-full w-auto animate-marquee2 items-end pb-2 transition-transform will-change-transform paused group-hover:running">
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
              <div className="ml-2 flex flex-col gap-2 md:gap-2">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-border bg-background hover:border-brand md:h-[62px] md:w-[62px] md:min-w-[62px]">
                  <ImgPlaceHolderIcon color="hsl(var(--muted-foreground))" />
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className=" group relative col-span-6  flex h-[400px] flex-col items-center justify-start gap-5 overflow-clip p-7 xl:col-span-3">
          <Image
            src={realtimeImage}
            alt=""
            className=" absolute bottom-0 z-0 w-full "
          />
          <div className=" group z-10 flex h-fit flex-col items-center gap-5 overflow-clip  ">
            <Button variant="outline" size="icon" className=" border-none">
              <RealTimeIcon />
            </Button>
            <CardHeader className="p-0 text-center ">
              <CardTitle>Realtime</CardTitle>
              <CardDescription className="">
                Build multiplayer experiences with realtime data
                synchronization.
              </CardDescription>
            </CardHeader>
          </div>
        </Card>
        <Card className="relative col-span-6 flex h-[400px] w-full justify-between lg:col-span-12 xl:col-span-6">
          <div className="flex w-full flex-col  justify-between gap-5 p-7 lg:w-[50%]">
            <div className=" flex flex-col items-center gap-5 lg:items-start">
              <Button variant="outline" size="icon" className=" border-none">
                <VectorIcon />
              </Button>

              <CardHeader className="p-0">
                <CardTitle className="text-center lg:text-start">
                  Vector
                </CardTitle>
                <CardDescription className="text-center lg:max-w-[50%] lg:text-start">
                  Integrate your favorite ML- models to store, index and search
                  vector embeddings.
                </CardDescription>
              </CardHeader>
            </div>
            <ul className="hidden flex-col gap-2 pb-5 pt-10 lg:flex ">
              <ListItem>
                <SunIcon className=" h-4 w-4" />
                OpenAI
              </ListItem>
              <ListItem>
                <SunIcon className=" h-4 w-4" />
                Hugging Face
              </ListItem>
            </ul>
          </div>
          <div className="lg:relative lg:w-[50%]">
            <figure
              className=" inset-0 z-0  lg:absolute"
              role="img"
              aria-label="Supabase Postgres database visual composition"
            >
              <span className="absolute left-0 right-0 top-24 my-auto flex h-full w-full items-end justify-center md:top-24 lg:bottom-0 lg:left-auto lg:top-0 lg:aspect-square lg:w-auto lg:items-center lg:justify-end">
                <Image
                  src={vectorImage}
                  alt=""
                  className="  absolute inset-0 h-full w-full text-transparent"
                />
              </span>
            </figure>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FeatureSection;
