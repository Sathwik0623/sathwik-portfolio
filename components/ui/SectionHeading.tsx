export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl mb-12">
      <p className="text-sm font-medium text-accent mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">{title}</h2>
      {description && <p className="mt-4 text-muted leading-relaxed">{description}</p>}
    </div>
  );
}
