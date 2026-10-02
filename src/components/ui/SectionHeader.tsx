import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  /** Section number in the index, e.g. "01". */
  index: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * The index voice: a hairline rule, a tracked label and a title that reveals
 * word by word (each word is its own reveal target with a staggered delay) so
 * headings land with a little cascade instead of a single fade.
 */
export function SectionHeader({ index, label, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("grid gap-s3 border-t border-rule/50 pt-s3 md:grid-cols-12", className)}>
      <Reveal className="md:col-span-4">
        <p className="label">
          <span className="text-accent">{index}</span> &nbsp;/&nbsp; {label}
        </p>
      </Reveal>
      <div className="md:col-span-8">
        <h2 className="font-heading text-h2">
          {title.split(" ").map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-reveal=""
              style={{ "--reveal-delay": `${80 + i * 45}ms` } as CSSProperties}
              className="mr-[0.26em] inline-block"
            >
              {word}
            </span>
          ))}
        </h2>
        {description ? (
          <Reveal delay={160}>
            <p className="mt-s2 max-w-measure text-body text-muted">{description}</p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
