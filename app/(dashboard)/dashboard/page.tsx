'use client'

import Title from "@/components/Title"
import ListContainer from "@/components/ListContainer"
import { useAuth } from "@/context/AuthContext"

const stats = [
  { label: "Suggestions", value: 21 },
  { label: "Likes", value: 21 },
  { label: "Programs Joined", value: 21 },
  { label: "Ongoing Programs", value: 21 },
]

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <>
      <Title className="mb-8 text-3xl">Hi, {user?.first_name}!</Title>

      {/* <div className="flex gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-theme-card-white shadow-sm rounded-2xl h-20 flex-1 flex flex-col justify-center items-center"
          >
            <span className="text-2xl text-theme-blue font-bold">{s.value}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        <ListContainer
          list={null}
          title="My Program"
          onViewAll={() => null}
        />

        <ListContainer
          title="Upcoming Program" 
          onViewAll={() => null}
          list={null}
        />
      </div>
      
    </>
  )
}
export default Dashboard
