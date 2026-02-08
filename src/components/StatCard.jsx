const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-dusk/10 bg-white/80 p-4 shadow-sm">
    <div className="text-xs uppercase tracking-widest text-ink/60">{label}</div>
    <div className="mt-2 text-2xl font-semibold text-dusk">{value}</div>
  </div>
);

export default StatCard;
