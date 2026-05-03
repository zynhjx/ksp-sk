type EmptyStateProps = {
  loading?: boolean
  message?: string
  loadingMessage?: string
  /** Set to true when used inside a card grid to span all columns */
  colSpan?: boolean
}

const EmptyState = ({
  loading = false,
  message = "No items found.",
  loadingMessage = "Loading...",
  colSpan = false,
}: EmptyStateProps) => {
  const inner = (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
      {loading ? loadingMessage : message}
    </div>
  )

  if (colSpan) {
    return <div className="col-span-full">{inner}</div>
  }

  return inner
}

export default EmptyState
