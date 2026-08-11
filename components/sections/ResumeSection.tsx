"use client";

import { FileText, Download, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { useEngagement } from "@/lib/engagement-context";

export type EducationItemData = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
};

export function ResumeSection({
  resumeUrl,
  education,
}: {
  resumeUrl: string | null;
  education: EducationItemData[];
}) {
  const { notifyResumeView } = useEngagement();

  return (
    <section id="resume" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading eyebrow="Resume" title="Resume & credentials" />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card-surface rounded-2xl p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold">Full resume</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              View it inline or download a copy for your records.
            </p>
          </div>
          {resumeUrl && (
            <div className="flex flex-wrap gap-3 mt-6">
              <TrackedLink
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName={ANALYTICS_EVENTS.RESUME_VIEW}
                onClick={notifyResumeView}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
              >
                <FileText size={16} />
                View Resume
              </TrackedLink>
              <TrackedLink
                href={resumeUrl}
                download
                eventName={ANALYTICS_EVENTS.RESUME_DOWNLOAD}
                onClick={notifyResumeView}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-border-strong transition-colors"
              >
                <Download size={16} />
                Download
              </TrackedLink>
            </div>
          )}
        </div>

        <div className="card-surface rounded-2xl p-7">
          {education.map((edu) => (
            <div key={edu.degree} className="flex items-start gap-3">
              <GraduationCap size={18} className="text-accent mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted mt-1">
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ""}
                </p>
                <p className="text-xs text-muted mt-1">
                  {edu.startDate} – {edu.endDate}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
