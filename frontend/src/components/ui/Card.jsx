export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40 ${className}`}>
      {children}
    </div>
  );
}