import { LockScreenNotice } from "@/components/phone/lock-screen";
import {
  EmailScreen,
  ExplainScreen,
  HomeScreen,
  ListeningScreen,
  RecapScreen,
  SignInScreen,
} from "@/components/phone/screens";
import { PhoneFrame } from "@/components/phone/phone-frame";
import type { ScreenId, Variant } from "@/content/variants";

/** Plain-language description of each screen, read by screen readers. */
const labels: Record<ScreenId, string> = {
  home: "FamilyIT's home screen: Hi! What do you need help with? and a Tap to talk button",
  listening: "A person asking FamilyIT out loud about a message from their car insurance company",
  email: "FamilyIT finding the email and checking that it is really from the insurer",
  signin: "FamilyIT signing in to the insurer's website with a saved login, password hidden",
  explain: "FamilyIT explaining a price change on the insurer's website and circling the Confirm button",
  "notice-done": "A phone notification saying the car insurance policy was confirmed and no action is needed",
  "notice-login": "A phone notification saying a saved login was used, with the person's OK",
  recap: "A recap screen listing what FamilyIT helped with, marked Completed with no action needed",
};

function renderScreen(id: ScreenId, copy: Variant["screenCopy"]) {
  switch (id) {
    case "home":
      return <HomeScreen intro={copy.homeIntro} />;
    case "listening":
      return <ListeningScreen />;
    case "email":
      return <EmailScreen />;
    case "signin":
      return <SignInScreen message={copy.signInMessage} />;
    case "explain":
      return <ExplainScreen />;
    case "notice-done":
      return <LockScreenNotice title={copy.noticeDoneTitle} body={copy.noticeDoneBody} />;
    case "notice-login":
      return <LockScreenNotice title={copy.noticeLoginTitle} body={copy.noticeLoginBody} />;
    case "recap":
      return <RecapScreen who={copy.recapWho} action={copy.recapAction} />;
  }
}

/** One demo screen inside a phone, worded for the segment being shown. */
export function PhoneScreen({
  id,
  copy,
  className,
}: {
  id: ScreenId;
  copy: Variant["screenCopy"];
  className?: string;
}) {
  return (
    <PhoneFrame label={labels[id]} className={className}>
      {renderScreen(id, copy)}
    </PhoneFrame>
  );
}
