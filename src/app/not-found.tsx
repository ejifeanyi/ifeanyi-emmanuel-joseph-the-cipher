import { ButtonLink } from "@/components/ui";
import { KeyFragment } from "@/components/cipher";
import { Dual } from "@/components/Dual";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center gap-6 py-28 text-center md:py-40">
      <p className="font-mono text-[clamp(4.5rem,12vw,7.5rem)] leading-none">404</p>
      <h1 className="t-h1">
        <Dual i="This room doesn’t exist… yet." c="no such room. yet." />
      </h1>
      <p className="max-w-md text-[17px] text-ink-2">
        It may not have been built, or it may have moved. Or it might be hidden.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to the entrance</ButtonLink>
        <ButtonLink href="/archive" variant="quiet">
          Search the archive
        </ButtonLink>
      </div>
      <p className="mt-6 font-mono text-[13px] text-ink-3">
        // lost things collect here <KeyFragment id="frag-2" className="ml-1 align-middle" />
      </p>
    </section>
  );
}
