type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, lead, children }: Props) {
  return (
    <section className="page-hero">
      <div className="wrap">
        {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
