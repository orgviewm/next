"use client";
import React from "react";
import dynamic from "next/dynamic";

import "./globals.css";

import TitleBar from "@/components/shared/TitleBar";

import HeroSection from "./HeroSection";

const CommunitySection = dynamic(() => import("./CommunitySection"), {
  ssr: false,
});
const ExamplesSection = dynamic(() => import("./ExamplesSection"), {
  ssr: false,
});
const InstantAPIsSection = dynamic(() => import("./InstantAPIsSection"), {
  ssr: false,
});
const VideoSection = dynamic(() => import("./VideoSection"), {
  ssr: false,
});
const InfrastructureSection = dynamic(() => import("./InfrastructureSection"), {
  ssr: false,
});
const FeatureSection = dynamic(() => import("./FeatureSection"), {
  ssr: false,
});
const CTASection = dynamic(() => import("./CTASection"), { ssr: false });
const FooterSection = dynamic(() => import("./FooterSection"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen  w-full flex-col items-center gap-10 ">
      <TitleBar />
      <HeroSection />
      <FeatureSection />
      <CommunitySection />
      <ExamplesSection />
      <InstantAPIsSection />
      <VideoSection />
      <InfrastructureSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
