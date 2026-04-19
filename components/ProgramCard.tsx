type Program = {
  id: string
  name: string
  status: string
  category: string
  location: string
  description: string
  createdAt: string
  participants: number
  startDate: string
  untilDate: string
}

type ProgramCardProps = {
  program: Program
  onEdit?: (program: Program) => void
  onDelete?: (program: Program) => void
}

const MetaItem = ({
  label,
  value,
  full = false,
}: {
  label: string
  value: string
  full?: boolean
}) => (
  <div className={`flex flex-col gap-0.5 ${full ? 'col-span-2' : ''}`}>
    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 leading-snug">{value}</span>
  </div>
)

const ProgramCard = ({ program, onEdit, onDelete }: ProgramCardProps) => {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      health: 'bg-rose-50 text-rose-700 border-rose-200',
      education: 'bg-violet-50 text-violet-700 border-violet-200',
      livelihood: 'bg-amber-50 text-amber-700 border-amber-200',
      environment: 'bg-teal-50 text-teal-700 border-teal-200',
      infrastructure: 'bg-sky-50 text-sky-700 border-sky-200',
    }
    return map[category.toLowerCase()] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  }

  return (
    <article className="group relative self-start border border-gray-200 rounded-2xl bg-white flex flex-col gap-0 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <div className="flex flex-col gap-3 p-4">
        {/* Title + Category */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900 leading-snug flex-1">
            {program.name}
          </h2>
          <span
            className={`shrink-0 text-[11px] font-semibold rounded-full px-2.5 py-1 border whitespace-nowrap ${getCategoryColor(program.category)}`}
          >
            {program.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap wrap-anywhere">
          {program.description}
        </p>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MetaItem label="Status" value={program.status} />
          <MetaItem label="Location" value={program.location} />
          <MetaItem label="Created" value={formatDate(program.createdAt)} />
          <MetaItem label="Start" value={formatDateTime(program.startDate)} />
          <MetaItem label="Until" value={formatDateTime(program.untilDate)} />
        </div>

        {/* Footer Actions */}
        <div className="mt-1 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            aria-label={`Edit ${program.name}`}
            title="Edit program"
            className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:text-theme-blue hover:border-theme-blue/40 hover:bg-theme-blue/5 transition"
            onClick={() => onEdit?.(program)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 mx-auto"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={`Delete ${program.name}`}
            title="Delete program"
            className="h-9 w-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
            onClick={() => onDelete?.(program)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 mx-auto"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProgramCard