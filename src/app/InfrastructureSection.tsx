import Image from "next/image";

import { Card, CardDescription } from "@/components/ui/card";
import GraterIcon from "@/utils/icons/GraterIcon";
import { structure1, structure2, structure3 } from "@/utils/images";

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
const InfrastructureSection = () => {
  return (
    <div className="  mx-auto w-full border-b border-border">
      <div className=" mx-auto flex  flex-col gap-5 px-6 pb-20 pt-48 md:max-w-[768px] lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px]">
        <div className="flex w-full flex-col gap-5">
          <div className="text-xs tracking-wider text-muted-foreground">
            CUSTOMER STORIES
          </div>
          <h3 className=" text-3xl  ">
            Infrastructure{" "}
            <span className="text-foreground-light">
              to innovate and scale with ease.
            </span>
          </h3>
          <div className="text-base text-foreground-light">
            See how ViewMarket empowers companies of all sizes to accelerate
            their growth and streamline their work.
          </div>
        </div>
        <div className="mx-auto mt-5 grid grid-cols-12 gap-5">
          {list?.map((item, index) => {
            return (
              <Card
                key={index}
                className=" col-span-12 flex flex-1  flex-col items-start gap-4 overflow-clip p-5 px-5 hover:border-muted-foreground md:col-span-4"
              >
                <Image
                  src={item.icon}
                  alt=""
                  className=" z-0 flex max-h-7 justify-start overflow-hidden object-contain object-left-top"
                />
                <div className="pt-5">{item.desc}</div>
                <CardDescription className="flex gap-2  text-brand">
                  Learn more
                </CardDescription>
              </Card>
            );
          })}
        </div>
        <CardDescription className="flex items-center  gap-2 py-5 text-sm text-foreground-light group-hover:text-foreground">
          Explore more <GraterIcon />
        </CardDescription>
      </div>
    </div>
  );
};

export default InfrastructureSection;
