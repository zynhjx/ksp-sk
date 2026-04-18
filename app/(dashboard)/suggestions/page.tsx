"use client"

import { useState } from "react"
import SuggestionCard from "@/components/SuggestionCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const mockSuggestions = [
  {
    id: "1",
    title: "Improve Street Lighting in Barangay",
    category: "Community / Social",
    description: "Many areas in our barangay lack adequate street lighting, making it unsafe for residents to walk at night.",
    suggestedSolution: "Install LED street lights on major streets and pathways. Consider solar-powered options for cost efficiency.",
    location: "Main Street, Various Areas",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    submittedBy: "Maria Santos",
    likesCount: 24,
    liked: false,
    status: "Pending",
  },
  {
    id: "2",
    title: "Free Coding Bootcamp for Youth",
    category: "Education",
    description: "Many young residents lack digital skills needed for modern employment opportunities.",
    suggestedSolution: "Partner with tech companies to offer free 3-month coding bootcamps every quarter.",
    location: "Barangay Hall, Room 2",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    submittedBy: "Juan dela Cruz",
    likesCount: 41,
    liked: true,
    status: "Accepted",
  },
  {
    id: "3",
    title: "Monthly Free Medical Checkup",
    category: "Health",
    description: "Residents with low income cannot afford regular checkups, leading to undetected illnesses.",
    suggestedSolution: "Coordinate with the RHU to hold monthly free checkup drives in the covered court.",
    location: "Covered Court",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    submittedBy: "Ana Reyes",
    likesCount: 58,
    liked: false,
    status: "Pending",
  },
  {
    id: "4",
    title: "Livelihood Training for Unemployed",
    category: "Employment",
    description: "A number of residents are unemployed and lack vocational skills to find stable work.",
    suggestedSolution: "Offer TESDA-accredited short courses on welding, electrician work, and food processing.",
    location: "Skills Training Center",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    submittedBy: "Roberto Lim",
    likesCount: 33,
    liked: false,
    status: "Declined",
  },
  {
    id: "5",
    title: "Community Clean-Up Drive",
    category: "Environment",
    description: "Esteros and vacant lots are being used as illegal dumpsites causing flooding and health hazards.",
    suggestedSolution: "Organize monthly clean-up drives with incentives like grocery packages for active participants.",
    location: "Estero & Surrounding Areas",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    submittedBy: "Ligaya Cruz",
    likesCount: 19,
    liked: true,
    status: "Pending",
  },
  {
    id: "6",
    title: "Basketball League for Teens",
    category: "Sports",
    description: "Teenagers have no structured activities after school, increasing risk of delinquency.",
    suggestedSolution: "Launch a quarterly inter-sitio basketball league open to ages 13–19 with trophies and prizes.",
    location: "Barangay Basketball Court",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    submittedBy: "Carlo Mendoza",
    likesCount: 47,
    liked: false,
    status: "Accepted",
  },
]

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  suggestedSolution: "",
  location: "",
  anonymous: true,
}

const Suggestions = () => {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    // TODO: submit form data
    console.log(form)
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  const isValid =
    form.title.trim() &&
    form.category &&
    form.description.trim() &&
    form.suggestedSolution.trim() &&
    form.location.trim()

  const categoryOptions = ["All", "Education", "Employment", "Health", "Sports", "Environment", "Community / Social"]

  const handleAddSuggestion = () => {
    // TODO: Open modal or navigate to add suggestion page
  }

  const filteredSuggestions = mockSuggestions.filter((s) => {
    const matchesSearch =
      search.trim() === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.suggestedSolution.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.submittedBy.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "" || categoryFilter === "All" || s.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-blue">Community Suggestions</h1>
            <p className="text-gray-500">Share our ideas and feedback to help improve programs and services in your barangay</p>
          </div>

          <div className="ml-auto flex items-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-theme-blue text-theme-white px-5 py-2 rounded-md">
                  + Add Suggestion
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-theme-blue">
                    Submit a Suggestion
                  </DialogTitle>
                  <DialogDescription>
                    Share your idea to help improve programs and services in your barangay.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      placeholder="e.g. Free Medical Checkup for Seniors"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <Label>Category <span className="text-red-500">*</span></Label>
                    <Select value={form.category} onValueChange={(val) => set("category", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the problem or concern you want to address..."
                      className="resize-none min-h-[90px]"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </div>

                  {/* Suggested Solution */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="solution">Suggested Solution <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="solution"
                      placeholder="What do you think would help solve the problem?"
                      className="resize-none min-h-[90px]"
                      value={form.suggestedSolution}
                      onChange={(e) => set("suggestedSolution", e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <Input
                      id="location"
                      placeholder="e.g. Covered Court, Sitio Mabini"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                    />
                  </div>

                  {/* Anonymous checkbox */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <Checkbox
                      id="anonymous"
                      checked={form.anonymous}
                      onCheckedChange={(checked) => set("anonymous", !!checked)}
                    />
                    <Label htmlFor="anonymous" className="cursor-pointer font-normal text-gray-700">
                      Submit anonymously
                    </Label>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className="bg-theme-blue text-white hover:bg-theme-blue/90"
                  >
                    Submit Suggestion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search suggestions..."
          />

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}
      >
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-sm">No suggestions found.</p>
            <p className="text-gray-300 text-xs mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Suggestions