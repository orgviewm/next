import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import MessageIcon from "@/utils/icons/MessageIcon";
import TwitterIcon from "@/utils/icons/socialMedia/TwitterIcon";
import {
  person1,
  person2,
  person3,
  person4,
  person5,
  person6,
  person7,
  person8,
  person9,
} from "@/utils/images";

const personList1 = [
  {
    img: person1,
    name: "@thatguy_tex",
    desc: "Working with ViewMarket has been one of the best dev experiences I've had lately. Incredibly easy to set up, great documentation, and so many fewer hoops to jump through than the competition. I definitely plan to use it on any and all future projects.",
  },
  {
    img: person2,
    name: "@IxoyeDesign",
    desc: "ViewMarket is just 🤯 Now I see why a lot of people love using it as a backend for their applications. I am really impressed with how easy it is to set up an Auth and then just code it together for the frontend. @IngoKpp now I see your joy with ViewMarket #coding #fullstackwebdev",
  },
];

const personList2 = [
  {
    img: person3,
    name: "@varlenneto",
    desc: "I've been using ViewMarket for two personal projects and it has been amazing being able to use the power of Postgres and don't have to worry about the backend",
  },
  {
    img: person4,
    name: "@justinjunodev",
    desc: "Y'all ViewMarket + @nextjs is amazing! 🙌 Barely an hour into a proof-of-concept and already have most of the functionality in place. 🤯🤯🤯",
  },
  {
    img: person5,
    name: "@justinjunodev",
    desc: "And thanks to ViewMarket, I was able to go from idea to launched feature in a matter of hours. Absolutely amazing!",
  },
];

const personList3 = [
  {
    img: person6,
    name: "@damlakoksal",
    desc: "Contributing to open-source projects and seeing merged PRs gives enormous happiness! Special thanks to ViewMarket, for giving this opportunity by staying open-source and being junior-friendly✌🏼",
  },
  {
    img: person7,
    name: "@KenTheRogers",
    desc: "Holy crap. ViewMarket is absolutely incredible. Most elegant backend as a service I've ever used. This is a dream.",
  },
];

const personList4 = [
  {
    img: person8,
    name: "@PaoloRicciuti",
    desc: "Over the course of a few weeks, we migrated 125.000 users (email/pw, Gmail, Facebook, Apple logins) from Auth0 to ViewMarket and have now completed the migration. I'm just glad the migration is done 😅 Went well, besides a few edge cases (duplicate emails/linked accounts)",
  },
  {
    img: person9,
    name: "@saxxone",
    desc: "Using ViewMarket I'm really pleased on the power of postgres (and sql in general). Despite being a bit dubious about the whole backend as a service thing I have to say I really don't miss anything. The whole experience feel very robust and secure.",
  },
];

const CommunitySection: React.FC = () => {
  return (
    <div className="flex w-full flex-col gap-4 px-6 md:max-w-[768px] lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px] ">
      <div className="flex flex-col gap-5 pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl text-white">Join the community</div>
          <CardDescription className="text-base text-foreground-light">
            Supported by a network of early advocates, contributors, and
            champions.
          </CardDescription>

          <div className="flex gap-5">
            <Button
              variant="outline"
              className="border-border bg-card p-3"
              size="sm"
            >
              Github discussions{" "}
              <div className="pl-2 text-foreground">
                <MessageIcon />
              </div>
            </Button>
            <Button
              variant="outline"
              className="border-border bg-card p-3"
              size="sm"
            >
              Discord{" "}
              <div className="pl-2 text-foreground">
                <MessageIcon />
              </div>
            </Button>
          </div>
        </div>
        <div className="relative columns-1 gap-4 overflow-hidden transition-all sm:columns-2 lg:columns-3 xl:columns-4">
          {/* <div className=" break-inside-avoid-column"> */}
          {personList1.map((data, index) => (
            <Card
              key={index}
              className="group relative mb-4 flex  break-inside-avoid-column flex-col gap-4 overflow-clip p-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image
                    src={data.img}
                    alt=""
                    className="z-0 h-10 w-10 rounded-full object-cover"
                  />
                  <div className="absolute left-[-16px] top-[-14px] z-10 scale-[0.6] overflow-hidden rounded-full bg-black p-2.5">
                    <TwitterIcon />
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {data.name}
                </div>
              </div>
              <CardDescription className="text-base text-[#707070]">
                &quot;{data.desc}&quot;
              </CardDescription>
            </Card>
          ))}
          {/* </div>
          <div className=" break-inside-avoid-column"> */}
          {personList2.map((data, index) => (
            <Card
              key={index}
              className="group relative mb-4 flex  break-inside-avoid-column flex-col gap-4 overflow-clip p-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image
                    src={data.img}
                    alt=""
                    className="z-0 h-10 w-10 rounded-full object-cover"
                  />
                  <div className="absolute left-[-16px] top-[-14px] z-10 scale-[0.6] overflow-hidden rounded-full bg-black p-2.5">
                    <TwitterIcon />
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {data.name}
                </div>
              </div>
              <CardDescription className="text-base text-[#707070]">
                &quot;{data.desc}&quot;
              </CardDescription>
            </Card>
          ))}
          {/* </div>
          <div className=" break-inside-avoid-column"> */}
          {personList3.map((data, index) => (
            <Card
              key={index}
              className="group relative mb-4 flex  break-inside-avoid-column flex-col gap-4 overflow-clip p-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image
                    src={data.img}
                    alt=""
                    className="z-0 h-10 w-10 rounded-full object-cover"
                  />
                  <div className="absolute left-[-16px] top-[-14px] z-10 scale-[0.6] overflow-hidden rounded-full bg-black p-2.5">
                    <TwitterIcon />
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {data.name}
                </div>
              </div>
              <CardDescription className="text-base text-[#707070]">
                &quot;{data.desc}&quot;
              </CardDescription>
            </Card>
          ))}
          {/* </div>
          <div className=" break-inside-avoid-column"> */}
          {personList4.map((data, index) => (
            <Card
              key={index}
              className="group relative mb-4 flex  break-inside-avoid-column flex-col gap-5 overflow-clip p-5"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image
                    src={data.img}
                    alt=""
                    className="z-0 h-10 w-10 rounded-full object-cover"
                  />
                  <div className="absolute left-[-16px] top-[-14px] z-10 scale-[0.6] overflow-hidden rounded-full bg-black p-2.5">
                    <TwitterIcon />
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {data.name}
                </div>
              </div>
              <CardDescription className="text-base text-[#707070]">
                &quot;{data.desc}&quot;
              </CardDescription>
            </Card>
          ))}
          {/* </div> */}
          <div className="absolute bottom-0 left-0 z-10 h-[400px] w-full bg-gradient-to-t from-background via-[#1c1c1c00]"></div>
        </div>

        <div className="flex w-full justify-center py-20">
          <Button variant="outline" className="w-fit bg-card" size="sm">
            Show More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
