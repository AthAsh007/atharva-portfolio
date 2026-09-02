import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { WorkIndex } from "./WorkIndex";
import { Capabilities } from "./Capabilities";
import { Approach } from "./Approach";
import { Contact } from "./Contact";

/**
 * The "/" entry component. studio-folio section order:
 * hero → gallery → marquee → services → cta → footer (footer lives in AppShell).
 */
export function HomeMain() {
  return (
    <>
      <Hero />
      <Marquee />
      <WorkIndex />
      <Capabilities />
      <Approach />
      <Contact />
    </>
  );
}
