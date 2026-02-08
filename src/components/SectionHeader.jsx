const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-2xl text-dusk">{title}</h2>
      {subtitle && <p className="text-sm text-ink/70">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
