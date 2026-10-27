/**
 * CairnMark — Carefully balanced cairn of stones.
 * Symbolizes stability, guidance, stacked capability, and structured milestones.
 */
export function CairnMark({ className = "size-8" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-xl transition-all duration-200 group-hover:scale-105 shrink-0 ${className}`}
      style={{
        background: "linear-gradient(135deg, #24242A 0%, #17171B 100%)",
        border: "1px solid rgba(201,205,208,0.22)",
        boxShadow: "inset 0 1px 0 rgba(220,220,224,0.1), 0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        aria-hidden="true"
      >
        {/* Top balanced summit pebble — warm champagne accent */}
        <path
          d="M10 4.5C10 3.67 10.9 3 12 3C13.1 3 14 3.67 14 4.5C14 5.33 13.1 6 12 6C10.9 6 10 5.33 10 4.5Z"
          fill="#C4A574"
        />
        {/* Middle balanced stone — polished cloud silver */}
        <path
          d="M6.5 10C6.5 8.9 8.96 8 12 8C15.04 8 17.5 8.9 17.5 10C17.5 11.1 15.04 12 12 12C8.96 12 6.5 11.1 6.5 10Z"
          fill="#DCDCE0"
        />
        {/* Base foundation stone — sturdy architectural slate */}
        <path
          d="M4 16.5C4 15.12 7.58 14 12 14C16.42 14 20 15.12 20 16.5C20 17.88 16.42 19 12 19C7.58 19 4 17.88 4 16.5Z"
          fill="#85858E"
        />
      </svg>
    </span>
  );
}
