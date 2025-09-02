"use client";
import React, { useState } from "react";

import TitleBar from "@/components/shared/TitleBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Free",
    monthlyPrice: 0,
    period: "/ mo",
    billing: "billed annually",
    savings: "Save $36 a year",
    features: [
      "2 charts per tab",
      "5 indicators per chart",
      "10K historical bars",
      "10 parallel chart connections",
      "20 price alerts",
      "20 technical alerts",
      { text: "0 watchlist alerts", disabled: true },
      "No ads",
      "Volume profile",
      "Custom timeframes",
    ],
  },
  {
    name: "Essential",
    monthlyPrice: 999,
    period: "/ mo",
    billing: "billed annually",
    savings: "Save $68 a year",
    features: [
      "4 charts per tab",
      "10 indicators per chart",
      "10K historical bars",
      "20 parallel chart connections",
      "100 price alerts",
      "100 technical alerts",
      { text: "0 watchlist alerts", disabled: true },
      "No ads",
      "Volume profile",
      "Custom timeframes",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 2499,
    period: "/ mo",
    billing: "billed annually",
    savings: "Save $138 a year",
    features: [
      "8 charts per tab",
      "25 indicators per chart",
      "20K historical bars",
      "50 parallel chart connections",
      "400 price alerts",
      "400 technical alerts",
      "2 watchlist alerts",
      "No ads",
      "Volume profile",
      "Custom timeframes",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 4499,
    period: "/ mo",
    billing: "billed annually",
    savings: "Save $240 a year",
    features: [
      "10 charts per tab",
      "30 indicators per chart",
      "25K historical bars",
      "80 parallel chart connections",
      "600 price alerts",
      "600 technical alerts",
      "10 watchlist alerts",
      "No ads",
      "Volume profile",
      "Custom timeframes",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    period: "/ mo",
    billing: "billed annually",
    savings: "Save $480 a year",
    features: [
      "16 charts per tab",
      "50 indicators per chart",
      "40K historical bars",
      "200 parallel chart connections",
      "1,000 price alerts",
      "1,000 technical alerts",
      "15 watchlist alerts",
      "No ads",
      "Volume profile",
      "Custom timeframes",
    ],
  },
];

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const getDisplayPrice = (plan: any) => {
    if (plan.monthlyPrice === "Custom" || plan.monthlyPrice === 0) {
      return plan.monthlyPrice === 0 ? "₹0" : "Custom";
    }

    if (isYearly) {
      const yearlyPrice = plan.monthlyPrice * 12 * 0.67; // 33% discount
      return `₹${Math.round(yearlyPrice).toLocaleString()}`;
    }

    return `₹${plan.monthlyPrice.toLocaleString()}`;
  };

  const getPeriod = () => {
    return isYearly ? "/ year" : "/ mo";
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background">
      <TitleBar />
      <div className="w-full max-w-7xl px-6 pb-12 pt-24">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Choose Your Plan
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Select the perfect plan for your trading needs
          </p>

          <div className="mb-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm ${!isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isYearly ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}
            >
              Yearly (33% off)
            </span>
          </div>
        </div>

        <Card className="border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`flex h-full flex-col p-6 ${index < pricingPlans.length - 1 ? "border-r border-border" : ""}`}
              >
                <div className="pb-4 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      {getDisplayPrice(plan)}
                    </span>
                    <span className="text-muted-foreground">{getPeriod()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isYearly ? "billed annually" : "billed monthly"}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {plan.savings}
                  </p>
                </div>

                <div className="flex-1">
                  <Button className="mb-6 w-full border border-border bg-card text-foreground hover:bg-muted">
                    {plan.name === "Free"
                      ? "Get Started"
                      : plan.name === "Enterprise"
                        ? "Contact"
                        : "Buy now"}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => {
                      const isDisabled =
                        typeof feature === "object" && feature.disabled;
                      const featureText =
                        typeof feature === "string" ? feature : feature.text;

                      return (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isDisabled ? (
                              <div className="h-4 w-4 rounded-full border border-muted-foreground opacity-30" />
                            ) : (
                              <svg
                                className="h-4 w-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <polyline
                                  points="20 6 9 17 4 12"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              isDisabled
                                ? "text-muted-foreground opacity-50"
                                : "text-foreground"
                            }`}
                          >
                            {featureText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default PricingPage;
