"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

/**
 * Meta Pixel, loaded only when NEXT_PUBLIC_META_PIXEL_ID is set. The first
 * PageView comes from the snippet; later PageViews fire when the visitor
 * moves between pages without a full reload. The Lead event is not fired
 * here: it comes from the thank-you page, after a real Tally submission.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname]);

  // Only a numeric id is accepted, so nothing else can reach the inline script.
  if (!pixelId || !/^\d{5,20}$/.test(pixelId)) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
    </Script>
  );
}
