import { Section } from "./section";
import { wallData } from "@/data/wall";

export function Wall() {
  return (
    <Section id="the-wall" tone="band">
      <div className="max-w-2xl lg:max-w-3xl">
        <h2
          data-reveal
          className="mb-8 text-3xl font-bold tracking-tight md:text-4xl"
        >
          {wallData.heading}
        </h2>

        <div className="flex flex-col gap-6">
          {wallData.body.map((para, i) => (
            <p
              key={i}
              data-reveal
              className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg"
            >
              {para}
            </p>
          ))}
        </div>

        <p
          data-reveal
          className="mt-10 border-l-2 border-[var(--color-accent)] pl-5 text-lg font-medium leading-relaxed text-[var(--color-foreground)] md:text-2xl"
        >
          {wallData.kicker}
        </p>
      </div>
    </Section>
  );
}
