
import { twMerge } from "tailwind-merge"

type ListItem = {
  id: number
  name: string
}

type ListContainerProps = {
  title: string
  list: ListItem[] | null
  onViewAll?: () => void
  viewAllLabel?: string
}

const ListContainer = ({
  title,
  list,
  onViewAll,
  viewAllLabel = "View all",
}: ListContainerProps) => {
  return (
    <section className="bg-theme-card-white shadow-sm rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-theme-blue">{title}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-theme-blue hover:underline hover:cursor-pointer"
        >
          {viewAllLabel}
        </button>
      </div>
      <div 
        className={twMerge("flex flex-col h-70",
          !list && "justify-center items-center"
        )}
      >
        {!list ? (
          <p>No items yet.</p>
        ) : (
          list.map((l) => (
            <div key={l.id}>{l.name}</div>
          ))
        )}
      </div>
    </section>
  )
}

export default ListContainer
