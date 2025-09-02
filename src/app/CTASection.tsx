import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <div className="flex flex-col items-center gap-20 px-6 py-32 md:max-w-[768px] lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px]">
      <h3 className="text-3xl text-foreground-light  ">
        Build in a weekend,
        <span className="text-foreground"> scale to millions</span>
      </h3>
      <Button>Start your project</Button>
    </div>
  );
};

export default CTASection;
