import { CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraterIcon from "@/utils/icons/GraterIcon";

const VideoSection = () => {
  return (
    <div className="flex w-full flex-col gap-5 px-6 pt-48 md:max-w-[768px] lg:max-w-[1024px] lg:px-16 xl:max-w-[1280px] xl:px-20 2xl:max-w-[1536px]">
      <h3 className=" pb-14 text-2xl ">
        Build your app without leaving the dashboard
      </h3>
      <Tabs defaultValue="Table editor" className="h-full">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row ">
          <div className="relative aspect-video lg:w-[50%]">
            <TabsContent
              value="Table editor"
              className="relative h-full w-full  "
            >
              <iframe
                title="Demo video showcasing ViewMarket"
                className="l-0 r-0 absolute h-full w-full overflow-hidden rounded-md  border border-border bg-black "
                src="https://www.youtube.com/embed/xIHjwJgxOmk?si=OA4AnxU6hZDYQb1z&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;modestbranding=1&amp;rel=0&amp;disablekb=1&amp;mute=1&amp;muted=1"
                allow="autoplay; modestbranding; encrypted-media"
                loading="lazy"
              ></iframe>
            </TabsContent>
            <TabsContent
              value="SQL Editor"
              className="relative aspect-video h-full w-full "
            >
              <iframe
                title="Demo video showcasing ViewMarket"
                className="l-0 r-0 absolute h-full w-full overflow-hidden rounded-md  border border-border bg-black "
                src="https://www.youtube.com/embed/Hch1mZPZ53A?si=LAH_BB756M1OSWpT&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;modestbranding=1&amp;rel=0&amp;disablekb=1&amp;mute=1&amp;muted=1"
                allow="autoplay; modestbranding; encrypted-media"
                loading="lazy"
              ></iframe>
            </TabsContent>
            <TabsContent
              value="Auth rules"
              className="relative aspect-video h-full w-full "
            >
              <iframe
                title="Demo video showcasing ViewMarket"
                className="l-0 r-0 absolute h-full w-full overflow-hidden rounded-md  border border-border bg-black "
                src="https://www.youtube.com/embed/vP319FCIZ6Y?si=QET9fpysJRKQcmRi&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;modestbranding=1&amp;rel=0&amp;disablekb=1&amp;mute=1&amp;muted=1"
                allow="autoplay; modestbranding; encrypted-media"
                loading="lazy"
              ></iframe>
            </TabsContent>
          </div>
          <div className=" flex flex-col gap-3 overflow-hidden pt-5 lg:w-[40%]">
            <div>
              <TabsList className="">
                <TabsTrigger value="Table editor" variant="underline">
                  Table editor
                </TabsTrigger>
                <TabsTrigger value="SQL Editor" variant="underline">
                  SQL Editor
                </TabsTrigger>
                <TabsTrigger value="Auth rules" variant="underline">
                  Auth rules
                </TabsTrigger>{" "}
              </TabsList>{" "}
              <div className=" mt-[-4px] border border-secondary"></div>
              <TabsContent value="Table editor">
                <div className="mt-10 flex flex-col gap-5 text-lg">
                  Manage your data with the familiarity of a spreadsheet
                  <div className=" text-base text-foreground-light">
                    You don&apos;t have to be a database expert to use
                    ViewMarket. Our table editor makes Postgres easy to use,
                    even for non-techies. You can do everything right in our
                    dashboard.
                  </div>
                  <CardDescription className="flex items-center  gap-2 pb-5 text-sm text-foreground-light group-hover:text-foreground">
                    Explore Table View <GraterIcon />
                  </CardDescription>
                </div>
              </TabsContent>
              <TabsContent value="SQL Editor">
                <div className="mt-10 flex flex-col gap-5 text-lg">
                  In-built SQL editor for when you need greater control
                  <div className=" text-base text-foreground-light">
                    Write, save, and execute SQL queries directly on our
                    dashboard, with templates to save you time. Run common
                    queries and even build applications using our growing list
                    of templates.
                  </div>
                  <CardDescription className="flex items-center  gap-2 pb-5 text-sm text-foreground-light group-hover:text-foreground">
                    Explore Table View <GraterIcon />
                  </CardDescription>
                </div>
              </TabsContent>
              <TabsContent value="Auth rules">
                <div className="mt-10 flex flex-col gap-5 text-lg">
                  User management as straight-forward as it can be
                  <div className=" text-base text-foreground-light">
                    Easily manage your users with ViewMarket Auth, with email
                    logins, magic links, and third-party logins. Create complex
                    access policies with SQL rules to fit your unique business
                    needs.
                  </div>
                  <CardDescription className="flex items-center  gap-2 pb-5 text-sm text-foreground-light group-hover:text-foreground">
                    Explore Table View <GraterIcon />
                  </CardDescription>
                </div>
              </TabsContent>
            </div>
            <div></div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default VideoSection;
