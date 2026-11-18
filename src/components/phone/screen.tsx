import { LockScreenNotice } from "@/components/phone/lock-screen";
import {
  AnsweringScreen,
  ClarifyScreen,
  ConfirmedScreen,
  EmailScreen,
  ExplainScreen,
  HomeScreen,
  ListeningScreen,
  OpenSiteScreen,
  RecapScreen,
  SignInScreen,
} from "@/components/phone/screens";
import { PhoneFrame } from "@/components/phone/phone-frame";
import type { ScreenId, Variant } from "@/content/variants";

/** Plain-language description of each screen, read by screen readers. */
const labels: Record<ScreenId, string> = {
  home: "FamilyIT's home screen: Hi! What do you need help with? and a Tap to talk button",
  listening: "A person asking FamilyIT out loud about a message from their car insurance company",
  clarify: "FamilyIT asking where the message came from",
  answering: "The person answering out loud that it is an email they got this morning",
  email: "FamilyIT finding the email and checking that it is really from the insurer",
  opensite: "FamilyIT opening the insurer's website and offering to sign in with a saved login",
  signin: "FamilyIT signing in to the insurer's website with a saved login, password hidden",
  explain: "FamilyIT explaining a price change on the insurer's website and circling the Confirm button",
  confirmed: "The insurer's website saying the policy is confirmed, and FamilyIT saying it is all done",
  idle: "A phone lock screen with no notifications",
  "notice-asked": "A phone notification saying a person is getting help from FamilyIT",
  "notice-login": "A phone notification saying a saved login was used, with the person's OK",
  "notice-done": "A phone notification saying the car insurance policy was confirmed and no action is needed",
  recap: "A recap screen listing what FamilyIT helped with, marked Completed with no action needed",
};

function renderScreen(id: ScreenId, copy: Variant["screenCopy"]) {
  switch (id) {
    case "home":
      return <HomeScreen intro={copy.homeIntro} />;
    case "listening":
      return <ListeningScreen />;
    case "clarify":
      return <ClarifyScreen />;
    case "answering":
      return <AnsweringScreen />;
    case "email":
      return <EmailScreen />;
    case "opensite":
      return <OpenSiteScreen message={copy.openSiteMessage} />;
    case "signin":
      return <SignInScreen message={copy.signInMessage} />;
    case "explain":
      return <ExplainScreen />;
    case "confirmed":
      return <ConfirmedScreen message={copy.confirmedMessage} />;
    case "idle":
      return <LockScreenNotice />;
    case "notice-asked":
      return <LockScreenNotice title={copy.noticeAskedTitle} body={copy.noticeAskedBody} />;
    case "notice-login":
      return <LockScreenNotice title={copy.noticeLoginTitle} body={copy.noticeLoginBody} />;
    case "notice-done":
      return <LockScreenNotice title={copy.noticeDoneTitle} body={copy.noticeDoneBody} />;
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
