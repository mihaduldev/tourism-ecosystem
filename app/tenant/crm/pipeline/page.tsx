"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { ArrowRight, ArrowLeft, Plus, Users, Banknote } from "lucide-react";

const pipelineStageOrder = ["New Inquiry", "Contacted", "Proposal Sent", "Negotiation", "Won", "Lost"] as const;

const stageConfig: Record<string, { color: string; bgColor: string; borderColor: string }> = {
  "New Inquiry": { color: "#94a3b8", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  "Contacted": { color: "#3b82f6", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  "Proposal Sent": { color: "#8b5cf6", bgColor: "bg-violet-50", borderColor: "border-violet-200" },
  "Negotiation": { color: "#f59e0b", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  "Won": { color: "#16a34a", bgColor: "bg-green-50", borderColor: "border-green-200" },
  "Lost": { color: "#ef4444", bgColor: "bg-red-50", borderColor: "border-red-200" },
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-blue-100 text-blue-700",
};

export default function PipelinePage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [addToStage, setAddToStage] = useState<string>("New Inquiry");

  // Add deal form state
  const [form, setForm] = useState({
    name: "",
    contact: "",
    value: "",
    priority: "Medium",
  });

  const filteredDeals = useFilteredData(
    state.crmDeals,
    search,
    ["name", "contact", "id"],
  );

  const totalValue = state.crmDeals.reduce((sum, d) => sum + d.value, 0);
  const totalDeals = state.crmDeals.length;
  const wonDeals = state.crmDeals.filter(d => d.stage === "Won");

  function handleMoveForward(id: string, currentStage: string) {
    const idx = pipelineStageOrder.indexOf(currentStage as any);
    if (idx < 0 || idx >= pipelineStageOrder.length - 1) return;
    // Skip "Lost" when moving forward — go to Won max
    const nextIdx = currentStage === "Negotiation" ? 4 : idx + 1; // Negotiation -> Won
    if (nextIdx > 4) return;
    const nextStage = pipelineStageOrder[nextIdx];
    updateItem("crmDeals", id, { stage: nextStage });
    addToast(`Deal moved to ${nextStage}`, "success");
  }

  function handleMoveBack(id: string, currentStage: string) {
    const idx = pipelineStageOrder.indexOf(currentStage as any);
    if (idx <= 0) return;
    // If at Won or Lost, go back to Negotiation
    const prevIdx = idx >= 4 ? 3 : idx - 1;
    const prevStage = pipelineStageOrder[prevIdx];
    updateItem("crmDeals", id, { stage: prevStage });
    addToast(`Deal moved back to ${prevStage}`, "info");
  }

  function handleMarkLost(id: string) {
    updateItem("crmDeals", id, { stage: "Lost" });
    addToast("Deal marked as Lost", "warning");
  }

  function openAddDeal(stage?: string) {
    setAddToStage(stage || "New Inquiry");
    setForm({ name: "", contact: "", value: "", priority: "Medium" });
    setShowAddDeal(true);
  }

  function handleSubmitDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      addToast("Please fill in required fields", "error");
      return;
    }
    const id = generateId("DL");
    addItem("crmDeals", {
      id,
      name: form.name,
      contact: form.contact,
      value: Number(form.value) || 0,
      stage: addToStage,
      priority: form.priority,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
    addToast(`Deal "${form.name}" added to ${addToStage}`, "success");
    setShowAddDeal(false);
  }

  // Active stages to display (exclude Lost from main columns, show as separate if any)
  const displayStages = ["New Inquiry", "Contacted", "Proposal Sent", "Negotiation", "Won"] as const;

  return (
    <div className="max-w-full mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-500">{totalDeals} deals &middot; Total value: ৳{(totalValue / 100000).toFixed(1)}L</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => openAddDeal()}>
            <Plus className="w-4 h-4" /> Add Deal
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-1">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search deals by name, contact, or ID..."
          className="max-w-md"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-1">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Deals</p>
          <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Pipeline Value</p>
          <p className="text-2xl font-bold text-gray-900">৳{(totalValue / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Won Deals</p>
          <p className="text-2xl font-bold text-success-600">{wonDeals.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Avg Deal Value</p>
          <p className="text-2xl font-bold text-gray-900">{totalDeals > 0 ? `৳${Math.round(totalValue / totalDeals / 1000)}K` : "—"}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px] px-1">
          {displayStages.map((stageName) => {
            const config = stageConfig[stageName];
            const stageDeals = filteredDeals.filter(d => d.stage === stageName);
            const stageIdx = pipelineStageOrder.indexOf(stageName);
            return (
              <div key={stageName} className="flex-1 min-w-[240px]">
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{stageName}</h3>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{stageDeals.length}</span>
                </div>

                {/* Deal Cards */}
                <div className="space-y-2.5">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className={`${config.bgColor} border ${config.borderColor} rounded-xl p-3.5 hover:shadow-md transition-all`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">{deal.name}</h4>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${priorityColors[deal.priority] || ""}`}>{deal.priority}</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><Users className="w-3 h-3" />{deal.contact}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1"><Banknote className="w-3.5 h-3.5 text-gray-400" />৳{deal.value.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">{deal.date}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        {stageIdx > 0 && stageName !== "Won" && (
                          <button
                            onClick={() => handleMoveBack(deal.id, stageName)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-gray-500 border border-gray-200 rounded-lg py-1 hover:bg-gray-100 transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back
                          </button>
                        )}
                        {stageName !== "Won" && (
                          <button
                            onClick={() => handleMoveForward(deal.id, stageName)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-brand-600 border border-brand-200 rounded-lg py-1 hover:bg-brand-50 transition-colors"
                          >
                            Forward <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {stageName !== "Won" && (stageName as string) !== "Lost" && (
                          <button
                            onClick={() => handleMarkLost(deal.id)}
                            className="flex items-center justify-center text-[10px] font-medium text-danger-500 border border-danger-200 rounded-lg py-1 px-2 hover:bg-danger-50 transition-colors"
                            title="Mark as Lost"
                          >
                            Lost
                          </button>
                        )}
                        {stageName === "Won" && (
                          <button
                            onClick={() => handleMoveBack(deal.id, stageName)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-gray-500 border border-gray-200 rounded-lg py-1 hover:bg-gray-100 transition-colors"
                          >
                            <ArrowLeft className="w-3 h-3" /> Move Back
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                      <p className="text-xs text-gray-400">No deals</p>
                    </div>
                  )}

                  {/* Add deal button */}
                  <button
                    onClick={() => openAddDeal(stageName)}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-3 text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lost Deals Section (if any) */}
      {state.crmDeals.filter(d => d.stage === "Lost").length > 0 && (
        <div className="px-1">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-700 mb-3">Lost Deals ({state.crmDeals.filter(d => d.stage === "Lost").length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {state.crmDeals.filter(d => d.stage === "Lost").map(deal => (
                <div key={deal.id} className="bg-white border border-red-100 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                    <p className="text-xs text-gray-500">{deal.contact} · ৳{deal.value.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleMoveBack(deal.id, "Lost")}
                    className="text-[10px] font-medium text-brand-600 border border-brand-200 rounded-lg py-1 px-2 hover:bg-brand-50 transition-colors"
                  >
                    Reopen
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      <Modal
        open={showAddDeal}
        onClose={() => setShowAddDeal(false)}
        title={`Add Deal — ${addToStage}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowAddDeal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitDeal}>Add Deal</Button>
          </>
        }
      >
        <form onSubmit={handleSubmitDeal} className="space-y-4">
          <FormField label="Deal Name" required value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Corporate Retreat Package" />
          <FormField label="Contact" required value={form.contact} onChange={(v) => setForm(f => ({ ...f, contact: v }))} placeholder="e.g. Karim International" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Value (BDT)" type="number" value={form.value} onChange={(v) => setForm(f => ({ ...f, value: v }))} placeholder="e.g. 150000" />
            <FormField
              label="Priority"
              value={form.priority}
              onChange={(v) => setForm(f => ({ ...f, priority: v }))}
              options={[
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
