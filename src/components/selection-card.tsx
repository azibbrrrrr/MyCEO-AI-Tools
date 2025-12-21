interface SelectionCardProps {
  icon: string
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export function SelectionCard({ icon, label, selected, onClick, disabled }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-2xl border-3 transition-all duration-200 flex flex-col items-center gap-2 ${
        selected
          ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
          : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:scale-102"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)] text-center">{label}</span>
    </button>
  )
}
