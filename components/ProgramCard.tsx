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

const ProgramCard = ({ program }: ProgramCardProps) => {
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

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'ongoing') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s === 'upcoming' || s === 'not started') return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-gray-100 text-gray-500 border-gray-200'
  }

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
    <article className="group relative border border-gray-200 rounded-2xl bg-white flex flex-col gap-0 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      

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
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {program.description}
        </p>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MetaItem label="Status" value={program.status} />
          <MetaItem label="Location" value={program.location} />
          <MetaItem label="Participants" value={program.participants.toLocaleString()} />
          <MetaItem label="Created" value={formatDate(program.createdAt)} />
          <MetaItem label="Start" value={formatDateTime(program.startDate)} />
          <MetaItem label="Until" value={formatDateTime(program.untilDate)} />
        </div>
      </div>
    </article>
  )
}

export default ProgramCard