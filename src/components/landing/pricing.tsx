"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";
import { WaitlistButton } from "@/components/waitlist-button";
import { siteConfig } from "@/config/site";
import type { PageSegmentId } from "@/content/audiences";
import type { Variant } from "@/content/variants";

const { plans, chargeNote } = siteConfig.product;

function Perk({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className={`flex items-center gap-2.5 text-lg md:text-xl ${light ? "text-white" : "text-teal"}`}>
      <Icon name="check" className={`size-[1.375rem] shrink-0 ${light ? "text-sun" : "text-teal"}`} strokeWidth={2.4} />
      <span>{text}</span>
    </li>
  );
}

/**
 * Launch pricing with a Monthly / Annual switch. Prices come from
 * `siteConfig.product.plans`. Both buttons open this page's Tally form.
 */
export function Pricing({ pricing, segment }: { pricing: Variant["pricing"]; segment: PageSegmentId }) {
  const [yearly, setYearly] = useState(false);
  const per = yearly ? "/ year" : "/ month";

  const toggle = (active: boolean) =>
    `min-h-12 flex-1 rounded-full px-4 py-2 text-center text-[0.9375rem] font-bold leading-tight transition-colors sm:flex-none sm:px-[1.375rem] sm:text-base ${
      active ? "bg-teal text-white" : "bg-transparent text-teal"
    }`;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="pb-16 pt-6 md:pb-20 lg:pb-[6.5rem] lg:pt-10">
      <Container>
        <div className="mb-8 text-center lg:mb-10">
          <SectionHeading id="pricing-heading" className="mb-0">
            Simple launch pricing
          </SectionHeading>
          <p className="mx-auto mt-3.5 max-w-[42.5rem] text-lg text-teal-soft sm:text-xl">
            No contract, cancel anytime.
          </p>
        </div>

        <div className="mb-8 flex justify-center lg:mb-10">
          <div
            role="group"
            aria-label="Billing period"
            className="flex w-full max-w-md gap-1 rounded-full bg-white p-[5px] sm:w-auto sm:max-w-none"
          >
            <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={toggle(!yearly)}>
              Monthly
            </button>
            <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={toggle(yearly)}>
              Annual &middot; 2 months free
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-[57.5rem] gap-6 md:grid-cols-2">
          <div className="on-teal flex flex-col gap-3.5 rounded-[2rem] border-2 border-teal bg-teal p-6 sm:p-10">
            <h3 className="text-h3 font-bold text-white lg:text-h3-lg">{plans.family.name}</h3>
            <p className="text-lg text-white/85 sm:text-xl">{pricing.familyBlurb}</p>
            <p className="mt-1.5 text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[3.125rem]">
              {yearly ? plans.family.yearly : plans.family.monthly}
              <span className="text-lg font-normal text-white/85 sm:text-xl"> {per}</span>
            </p>
            <p className="mb-1.5 text-base text-white/85">
              {yearly ? plans.family.yearlyNote : plans.family.monthlyNote}
            </p>
            <ul className="flex flex-col gap-3.5">
              {pricing.familyPerks.map((perk) => (
                <Perk key={perk} text={perk} light />
              ))}
            </ul>
            <div className="mt-auto pt-2.5">
              <WaitlistButton segment={segment} placement="pricing" tone="sun" />
            </div>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[2rem] border-2 border-line bg-white p-6 sm:p-10">
            <h3 className="text-h3 font-bold text-teal lg:text-h3-lg">{plans.familyPlus.name}</h3>
            <p className="text-lg text-teal-soft sm:text-xl">{pricing.plusBlurb}</p>
            <p className="mt-1.5 text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-teal md:text-[3.125rem]">
              {yearly ? plans.familyPlus.yearly : plans.familyPlus.monthly}
              <span className="text-lg font-normal text-teal-soft sm:text-xl"> {per}</span>
            </p>
            <p className="mb-1.5 text-base text-teal-soft">
              {yearly ? plans.familyPlus.yearlyNote : plans.familyPlus.monthlyNote}
            </p>
            <ul className="flex flex-col gap-3.5">
              {pricing.plusPerks.map((perk) => (
                <Perk key={perk} text={perk} />
              ))}
            </ul>
            <div className="mt-auto pt-2.5">
              <WaitlistButton segment={segment} placement="pricing" tone="outline" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-base text-teal-soft">{chargeNote}</p>
      </Container>
    </section>
  );
}
