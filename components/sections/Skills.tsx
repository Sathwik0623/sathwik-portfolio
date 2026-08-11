"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";

export type SkillGroupData = { category: string; items: string[] };

export function Skills({ groups }: { groups: SkillGroupData[] }) {
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Skills" title="Toolbox" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {groups.map((group) => (
          <div key={group.category} className="card-surface rounded-2xl p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-accent mb-4">
              {group.category}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ scale: 1.04, x: 2 }}
                  transition={{ duration: 0.15 }}
                  title={item}
                  className="flex items-center gap-2.5 text-sm text-muted"
                >
                  <TechIcon name={item} className="size-4 shrink-0 text-foreground/80" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

