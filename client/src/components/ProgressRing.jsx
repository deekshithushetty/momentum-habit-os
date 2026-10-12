export function ProgressRing({ value = 0, size = 116 }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return <svg className="progress-ring" width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${value}% complete`}>
    <circle cx="60" cy="60" r={radius} strokeWidth="12" />
    <circle className="ring-value" cx="60" cy="60" r={radius} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} />
    <text x="60" y="62" textAnchor="middle">{value}%</text>
    <text className="ring-caption" x="60" y="80" textAnchor="middle">today</text>
  </svg>;
}
