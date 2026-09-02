import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  /** Section number in the studio index, e.g. "02". */
  index: string;
  label: string;
  title: string;
  description?: string;
  tone?: "paper" | "night";
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  tone = "paper",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("grid gap-s3 border-t pt-s3 md:grid-cols-12", tone === "night" ? "border-night-rule" : "border-rule", className)}>
      <Reveal className="md:col-span-4">
        <p className={cn("label", tone === "night" && "text-night-muted")}>
          <span className="text-accent">{index}</span> &nbsp;/&nbsp; {label}
        </p>
      </Reveal>
      <div className="md:col-span-8">
        <Reveal delay={80}>
          <h2 className={cn("font-heading text-h2", tone === "night" && "text-paper")}>{title}</h2>
        </Reveal>
        {description ? (
          <Reveal delay={160}>
            <p className={cn("mt-s2 max-w-measure text-body", tone === "night" ? "text-night-muted" : "text-muted")}>
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
