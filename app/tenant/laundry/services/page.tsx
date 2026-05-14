import { Tag, Plus, Edit, Trash2, Search, Star } from "lucide-react";
import { laundryServices } from "@/lib/demo-data";

const typeColors: Record<string, string> = {
  Weight: "bg-laundry-50 text-laundry-700",
  Piece: "bg-brand-50 text-brand-700",
};

export default function LaundryServicesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Services & Pricing</h1>
          <p className="text-sm text-gray-500">{laundryServices.length} services available</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-laundry-500 text-white rounded-lg text-sm font-medium hover:bg-laundry-600">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search services..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laundry-500" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {laundryServices.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-laundry-100 rounded-xl flex items-center justify-center text-laundry-600">
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                {service.popular && <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Edit className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1">{service.name}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColors[service.type] ?? "bg-gray-100 text-gray-600"}`}>
              {service.type === "Weight" ? "Per KG" : "Per Piece"}
            </span>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Price</span>
                <span className="text-lg font-bold text-gray-900">৳{service.price}<span className="text-xs font-normal text-gray-400"> {service.unit}</span></span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Express</span>
                <span className="text-sm font-semibold text-laundry-600">৳{Math.round(service.price * 1.5)}<span className="text-xs font-normal text-gray-400"> {service.unit}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Note */}
      <div className="bg-laundry-50 border border-laundry-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Pricing Notes</h3>
        <ul className="space-y-1.5 text-xs text-gray-600">
          <li>&bull; Express service adds 50% surcharge and guarantees 4-hour turnaround</li>
          <li>&bull; Bulk orders (10+ kg or 20+ pieces) receive 10% automatic discount</li>
          <li>&bull; Corporate accounts have custom pricing agreements</li>
          <li>&bull; All prices include pickup and delivery within city limits</li>
        </ul>
      </div>
    </div>
  );
}
