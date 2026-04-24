export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {[
          { label: "Platform Name", value: "Tourism Ecosystem", desc: "Public-facing platform name" },
          { label: "Default Plan", value: "Growth", desc: "Plan assigned to new businesses by default" },
          { label: "Trial Duration", value: "14 days", desc: "Free trial period for new tenants" },
          { label: "Subdomain Pattern", value: "{name}.platform.com", desc: "Subdomain format for tenants" },
          { label: "Max Users (Starter)", value: "5 users", desc: "User limit for Starter plan" },
          { label: "Commission Rate", value: "10% (Phase 2)", desc: "Default marketplace commission" },
        ].map((setting) => (
          <div key={setting.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{setting.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">{setting.value}</span>
              <button className="text-xs text-brand-600 hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Gateways</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: "bKash", status: "Active" },
            { name: "Nagad", status: "Active" },
            { name: "SSLCommerz", status: "Active" },
            { name: "Stripe", status: "Inactive" },
            { name: "Visa/Mastercard", status: "Active" },
            { name: "Bank Transfer", status: "Active" },
          ].map((gw) => (
            <div key={gw.name} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className={`w-2 h-2 rounded-full ${gw.status === "Active" ? "bg-success-500" : "bg-gray-300"}`} />
              <span className="text-sm text-gray-700">{gw.name}</span>
              <span className="ml-auto text-[10px] text-gray-400">{gw.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
