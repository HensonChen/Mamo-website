import type { Metadata } from "next";
import { ChatScene } from "@/components/landing/chat-scene";
import { Closing } from "@/components/landing/closing";
import { Hero } from "@/components/landing/hero";
import { Pain } from "@/components/landing/pain";
import { Paths } from "@/components/landing/paths";
import { home } from "@/content/home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * `/` introduces Mamo and sends each visitor to "For me" or "For a loved one".
 * It has no audience of its own, so paid ads never open it and its waitlist
 * buttons open the families form.
 */
export default function HomePage() {
  return (
    <>
      <Hero heading={home.hero.headline} lede={home.hero.lede} segment="families" />
      <ChatScene messages={home.chat} />
      <Pain />
      <Paths />
      <Closing heading={home.closing.heading} sub={home.closing.sub} segment="families" />
    </>
  );
}
