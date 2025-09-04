import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import NextJsIcon from "@/utils/icons/NextJsIcon";
import ReactJsIcon from "@/utils/icons/ReactJsIcon";
import FlutterIcon from "@/utils/icons/FlutterIcon";
import SvelteIcon from "@/utils/icons/SvelteIcon";
import VueJsIcon from "@/utils/icons/VueJsIcon";
import NuxtJsIcon from "@/utils/icons/NuxtJsIcon";
import BookIcon from "@/utils/icons/BookIcon";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center gap-8 pb-14 pt-32 ">
      <div className=" pt-14 text-center">
        <div className="block bg-gradient-to-b from-foreground to-foreground-light bg-clip-text text-7xl text-transparent">
          Build in a weekend
        </div>
        <div className="block bg-gradient-to-b from-foreground to-foreground-light bg-clip-text text-7xl text-transparent md:ml-0">
          Scale to millions
        </div>
      </div>
      <CardDescription className=" mx-auto w-full text-center text-lg text-card-foreground md:w-[60%]">
        ViewMarket is an open source Firebase alternative. <br /> Start your
        project with a Postgres database, Authentication, instant APIs, Edge
        Functions, Realtime subscriptions, Storage, and Vector embeddings.
      </CardDescription>
      <div className="flex gap-2 ">
        <Button variant="default" size="sm">
          Start your project
        </Button>
        <Button variant="secondary" size="sm">
          <div className="my-auto pr-2 text-[#707070]">
            <BookIcon />
          </div>
          Documentation
        </Button>
      </div>
      <div className=" flex flex-col items-center gap-3 pt-7">
        <div className=" text-xs text-foreground-light">
          Works seamlessly with 20+ frameworks
        </div>
        <div className=" flex justify-center gap-2">
          <NextJsIcon /> <ReactJsIcon /> <NuxtJsIcon />
          <FlutterIcon />
          <SvelteIcon /> <VueJsIcon />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
