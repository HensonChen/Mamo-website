import { absoluteUrl, siteConfig } from "@/config/site";
import type { Variant } from "@/content/variants";

const orgId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");
const logoUrl = absoluteUrl("/icon.svg");

type Faq = { question: string; answer: string };

/** Organization + WebSite, included on every page. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: { "@type": "ImageObject", url: logoUrl },
        email: siteConfig.contactEmail,
        foundingDate: siteConfig.foundingYear,
        ...(siteConfig.socials.length ? { sameAs: siteConfig.socials } : {}),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: siteConfig.contactEmail,
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },
    ],
  };
}

function faqNode(faqs: Faq[], pageUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** WebPage + Service + FAQPage for one segment page. */
export function variantStructuredData(variant: Variant) {
  const pageUrl = absoluteUrl(variant.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: variant.meta.title,
        description: variant.meta.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": `${pageUrl}#service` },
        inLanguage: "en-US",
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: `${siteConfig.name}: ${variant.label}`,
        description: variant.meta.description,
        serviceType: "Voice and screen technology help for older adults",
        provider: { "@id": orgId },
        areaServed: siteConfig.product.initialRegions,
        url: pageUrl,
      },
      faqNode(variant.faqs, pageUrl),
    ],
  };
}
