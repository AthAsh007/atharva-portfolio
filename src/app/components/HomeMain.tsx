import { Hero } from "./Hero";
import { Now } from "./Now";
import { Skills } from "./Skills";
import { WorkIndex } from "./WorkIndex";
import { Capabilities } from "./Capabilities";
import { Process } from "./Process";
import { Approach } from "./Approach";
import { Contact } from "./Contact";

/**
 * The "/" entry component. Section order:
 * hero - now - toolkit - work - capabilities - process - approach - contact
 * (the footer lives in AppShell).
 */
export function HomeMain() {
  return (
    <>
      <Hero />
      <Now />
      <Skills />
      <WorkIndex />
      <Capabilities />
      <Process />
      <Approach />
      <Contact />
    </>
  );
}
