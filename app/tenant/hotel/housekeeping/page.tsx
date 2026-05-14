"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Room } from "@/lib/state/types";

const colorMap: Record<string, string> = {
  Available: "bg-success-100 border-success-400 text-success-800",
  Occupied: "bg-brand-100 border-brand-400 text-brand-800",
  Dirty: "bg-warning-100 border-warning-400 text-warning-800",
  Maintenance: "bg-danger-100 border-danger-400 text-danger-800",
};

export default function HousekeepingPage() {
  const { state, updateItem, addItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [tRoom, setTRoom] = useState("");
  const [tType, setTType] = useState("Deep Cleaning");
  const [tAssignee, setTAssignee] = useState("Nasima Begum");
  const [tPriority, setTPriority] = useState("Normal");

  const floors = [1, 2, 3, 4];

  function handleRoomClick(room: Room) {
    setSelectedRoom(room);
  }

  function changeRoomStatus(room: Room, status: Room["status"]) {
    updateItem("rooms", room.id, { status });
    addToast(`Room ${room.number} → ${status}`, "success");
    setSelectedRoom(null);
  }

  function completeTask(taskId: string) {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateItem("housekeepingTasks", taskId, { status: "Done", completedAt: now });
    addToast("Task marked as done", "success");
  }

  function startTask(taskId: string) {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateItem("housekeepingTasks", taskId, { status: "In Progress", startedAt: now });
    addToast("Task started", "info");
  }

  // Pull assignee options from employees if available
  const employeeNames = state.employees.length > 0
    ? state.employees.map(e => e.name || (e as any).designation || "Staff")
    : ["Riya Akter", "Sumon Ali", "Mina Begum"];

  function handleAddTask() {
    if (!tRoom.trim()) { addToast("Room number required", "error"); return; }
    const estMin = tType === "Deep Cleaning" ? 60 : tType === "Maintenance Check" ? 45 : 30;
    addItem("housekeepingTasks", {
      id: generateId("HK"), room: tRoom, type: tType,
      status: "Pending", assignee: tAssignee, priority: tPriority,
      estimatedMinutes: estMin,
    });
    addToast(`Task added for Room ${tRoom}`, "success");
    setAddTaskOpen(false);
  }

  const counts = {
    Available: state.rooms.filter(r => r.status === "Available").length,
    Occupied: state.rooms.filter(r => r.status === "Occupied").length,
    Dirty: state.rooms.filter(r => r.status === "Dirty").length,
    Maintenance: state.rooms.filter(r => r.status === "Maintenance").length,
  };

  const activeTasks = state.housekeepingTasks.filter(t => t.status !== "Done");

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Housekeeping Board</h1>
          <p className="text-sm text-gray-500">Click any room to change status</p>
        </div>
        <Button size="sm" onClick={() => setAddTaskOpen(true)}><Plus className="w-4 h-4" /> Add Task</Button>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-600 flex-wrap">
        {(["Available", "Occupied", "Dirty", "Maintenance"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${s === "Available" ? "bg-success-500" : s === "Occupied" ? "bg-brand-500" : s === "Dirty" ? "bg-warning-500" : "bg-danger-500"}`} />
            <span className="font-medium">{s}</span>
            <span className="text-gray-400">({counts[s]})</span>
          </span>
        ))}
      </div>

      {/* Room Grid */}
      <div className="space-y-4">
        {floors.map((floor) => {
          const floorRooms = state.rooms.filter(r => r.floor === floor);
          if (floorRooms.length === 0) return null;
          return (
            <div key={floor} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Floor {floor}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {floorRooms.map((room) => (
                  <div key={room.id} onClick={() => handleRoomClick(room)}
                    className={`border-2 rounded-xl p-3 text-center cursor-pointer hover:shadow-lg transition-all ${colorMap[room.status]}`}>
                    <p className="text-base font-bold">{room.number}</p>
                    <p className="text-[10px] mt-0.5 font-medium">{room.status}</p>
                    <p className="text-[9px] mt-0.5 text-gray-500">{room.type.split(" ")[0]}</p>
                    {room.guest && <p className="text-[9px] mt-1 truncate text-gray-600 font-medium">{room.guest.split(" ")[0]}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Active Tasks ({activeTasks.length})</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Assignee</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activeTasks.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-bold text-gray-900">{t.room}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-700">{t.type}</p>
                  {t.estimatedMinutes && <p className="text-[10px] text-gray-400">~{t.estimatedMinutes} min</p>}
                  {t.startedAt && <p className="text-[10px] text-brand-500">Started: {(t.startedAt as string).slice(11)}</p>}
                  {t.completedAt && <p className="text-[10px] text-success-600">Done: {(t.completedAt as string).slice(11)}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{t.assignee}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    t.priority === "Urgent" ? "bg-danger-100 text-danger-700" :
                    t.priority === "Normal" ? "bg-gray-100 text-gray-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>{t.priority}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {t.status === "Pending" && (
                      <button onClick={() => startTask(t.id)} className="text-[10px] px-2 py-1 bg-brand-50 text-brand-700 rounded-md hover:bg-brand-100 font-medium">Start</button>
                    )}
                    {(t.status === "Pending" || t.status === "In Progress") && (
                      <button onClick={() => completeTask(t.id)} className="text-[10px] px-2 py-1 bg-success-50 text-success-700 rounded-md hover:bg-success-100 font-medium">Done</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {activeTasks.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">All tasks completed!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Room Status Modal */}
      <Modal open={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={`Room ${selectedRoom?.number}`} size="sm" footer={
        <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>Close</Button>
      }>
        {selectedRoom && (
          <div className="space-y-4">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold border-2 ${colorMap[selectedRoom.status]}`}>{selectedRoom.number}</div>
              <p className="text-sm font-bold text-gray-900 mt-3">{selectedRoom.type}</p>
              <p className="text-xs text-gray-500">Floor {selectedRoom.floor} · {selectedRoom.status}</p>
              {selectedRoom.guest && <p className="text-xs text-gray-600 mt-1">Guest: {selectedRoom.guest}</p>}
            </div>
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Change Status:</p>
              {(["Available", "Occupied", "Dirty", "Maintenance"] as const)
                .filter(s => s !== selectedRoom.status)
                .map(s => (
                  <button key={s} onClick={() => changeRoomStatus(selectedRoom, s)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                    Mark as <strong>{s}</strong>
                  </button>
                ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} title="Add Housekeeping Task" size="sm" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddTask}>Add Task</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Room Number" required value={tRoom} onChange={setTRoom} placeholder="e.g. 102" />
          <FormField label="Task Type" value={tType} onChange={setTType} options={[
            { value: "Deep Cleaning", label: "Deep Cleaning" },
            { value: "Linen Change", label: "Linen Change" },
            { value: "Turndown Service", label: "Turndown Service" },
            { value: "Maintenance Check", label: "Maintenance Check" },
          ]} />
          <FormField label="Assignee" value={tAssignee} onChange={setTAssignee} options={[
            { value: "Nasima Begum", label: "Nasima Begum" },
            { value: "Ayesha Khatun", label: "Ayesha Khatun" },
            { value: "Rina Akter", label: "Rina Akter" },
          ]} />
          <FormField label="Priority" value={tPriority} onChange={setTPriority} options={[
            { value: "Normal", label: "Normal" },
            { value: "Urgent", label: "Urgent" },
            { value: "Low", label: "Low" },
          ]} />
        </div>
      </Modal>
    </div>
  );
}
