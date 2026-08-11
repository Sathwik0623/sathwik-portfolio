import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="container-page py-16 sm:py-20 scroll-mt-16">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk"
        description="Open to Software Engineer, SDE, and AI Engineer roles. LinkedIn and a message are both optional."
      />
      <div className="card-surface rounded-2xl p-6 sm:p-8 max-w-2xl">
        <ContactForm />
      </div>
    </section>
  );
}
