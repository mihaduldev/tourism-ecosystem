import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star, Phone, MapPin, Calendar, Award, Users } from "lucide-react";

const allGuides = [
  {
    id: "g1",
    name: "Kamal Hossain",
    phone: "01711-000001",
    email: "kamal.guide@email.com",
    specialization: "Beach & Coastal",
    icon: "Beach",
    tours: 124,
    rating: 4.9,
    reviews: 87,
    status: "Active",
    languages: ["Bengali", "English", "Hindi"],
    experience: "6 years",
    nextTour: "Apr 26 - Cox's Bazar",
    availability: ["Apr 30", "May 01", "May 02", "May 06", "May 07"],
  },
  {
    id: "g2",
    name: "Rashed Mia",
    phone: "01812-000002",
    email: "rashed.guide@email.com",
    specialization: "Hill Treks",
    icon: "Hill",
    tours: 98,
    rating: 4.7,
    reviews: 63,
    status: "Active",
    languages: ["Bengali", "English"],
    experience: "4 years",
    nextTour: "May 02 - Sajek Valley",
    availability: ["Apr 26", "Apr 27", "Apr 28", "May 06", "May 07"],
  },
  {
    id: "g3",
    name: "Noor Islam",
    phone: "01912-000003",
    email: "noor.guide@email.com",
    specialization: "Jungle & Wildlife",
    icon: "Jungle",
    tours: 76,
    rating: 4.8,
    reviews: 52,
    status: "Active",
    languages: ["Bengali", "English"],
    experience: "5 years",
    nextTour: "Apr 28 - Sundarbans",
    availability: ["May 03", "May 04", "May 05", "May 06"],
  },
  {
    id: "g4",
    name: "Shakil Ahmed",
    phone: "01611-000004",
    email: "shakil.guide@email.com",
    specialization: "City & Heritage",
    icon: "City",
    tours: 56,
    rating: 4.5,
    reviews: 34,
    status: "Active",
    languages: ["Bengali", "English", "Arabic"],
    experience: "3 years",
    nextTour: "May 01 - Old Dhaka",
    availability: ["Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30"],
  },
  {
    id: "g5",
    name: "Billal Hossain",
    phone: "01511-000005",
    email: "billal.guide@email.com",
    specialization: "Beach & Coastal",
    icon: "Beach",
    tours: 42,
    rating: 4.6,
    reviews: 28,
    status: "Inactive",
    languages: ["Bengali"],
    experience: "2 years",
    nextTour: null,
    availability: [],
  },
  {
    id: "g6",
    name: "Anwar Sadik",
    phone: "01311-000006",
    email: "anwar.guide@email.com",
    specialization: "Hill Treks",
    icon: "Hill",
    tours: 31,
    rating: 4.4,
    reviews: 19,
    status: "Active",
    languages: ["Bengali", "English"],
    experience: "2 years",
    nextTour: "May 05 - Bandarban",
    availability: ["Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30", "May 01"],
  },
];

const specColors: Record<string, string> = {
  "Beach & Coastal": "bg-brand-100 text-brand-700",
  "Hill Treks": "bg-success-100 text-success-700",
  "Jungle & Wildlife": "bg-warning-100 text-warning-700",
  "City & Heritage": "bg-laundry-100 text-laundry-700",
};

export default function GuidesPage() {
  const active = allGuides.filter(g => g.status === "Active").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guide Management</h1>
          <p className="text-sm text-gray-500">{allGuides.length} guides · {active} active</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Add Guide</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search guides by name or phone..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tour-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Specializations</option>
          <option>Beach & Coastal</option>
          <option>Hill Treks</option>
          <option>Jungle & Wildlife</option>
          <option>City & Heritage</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allGuides.map((guide) => (
          <div key={guide.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="h-2 bg-tour-500" />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-tour-100 flex items-center justify-center text-tour-700 text-xl font-bold shrink-0">
                  {guide.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{guide.name}</h3>
                    <Badge variant={guide.status === "Active" ? "success" : "secondary"} dot>
                      {guide.status}
                    </Badge>
                  </div>
                  <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${specColors[guide.specialization] || "bg-gray-100 text-gray-600"}`}>
                    {guide.specialization}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guide.phone}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Tours</p>
                  <p className="text-sm font-bold text-gray-900">{guide.tours}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= Math.floor(guide.rating) ? "text-warning-500 fill-warning-500" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mt-0.5">{guide.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Exp.</p>
                  <p className="text-sm font-bold text-gray-900">{guide.experience}</p>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-3 flex flex-wrap gap-1">
                {guide.languages.map((lang) => (
                  <span key={lang} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{lang}</span>
                ))}
              </div>

              {/* Next tour / Availability */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                {guide.nextTour ? (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="w-3 h-3 text-tour-500" />
                    <span>Next: <span className="font-medium text-gray-900">{guide.nextTour}</span></span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No upcoming tours</p>
                )}
                {guide.availability.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-400 mb-1">Available dates:</p>
                    <div className="flex flex-wrap gap-1">
                      {guide.availability.slice(0, 5).map((d) => (
                        <span key={d} className="text-[10px] bg-success-50 text-success-600 px-1.5 py-0.5 rounded font-medium">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 text-xs text-center py-1.5 bg-tour-50 text-tour-600 rounded-lg hover:bg-tour-100 font-medium">View Profile</button>
                <button className="flex-1 text-xs text-center py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium">Assign Tour</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
