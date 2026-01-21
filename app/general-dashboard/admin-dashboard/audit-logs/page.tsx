"use client";

import React, { useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCog, 
  Terminal, 
  Download, 
  Clock, 
  Globe, 
  Database,
  AlertCircle,
  FileSpreadsheet,
  Activity,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

// Mock Forensic Data
const INITIAL_LOGS = [
  {
    id: "LOG-10029",
    adminName: "SuperAdmin_01",
    action: "Approved Seller",
    target: "TechStore_Nigeria",
    timestamp: "Jan 21, 2026 - 07:45:12",
    ip: "192.168.1.45",
    severity: "Medium"
  },
  {
    id: "LOG-10030",
    adminName: "Admin_Bayo",
    action: "Triggered Refund",
    target: "Order #55201",
    timestamp: "Jan 21, 2026 - 07:50:00",
    ip: "102.89.23.111",
    severity: "High"
  },
  {
    id: "LOG-10031",
    adminName: "SuperAdmin_01",
    action: "Role Escalation",
    target: "User #882 (Chidi)",
    timestamp: "Jan 21, 2026 - 08:15:22",
    ip: "192.168.1.45",
    severity: "Critical"
  }
];

export default function AdminAuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs] = useState(INITIAL_LOGS);

  const handleExport = () => {
    toast.success("Audit Export Initiated", {
      description: "A secure &quot;Read-Only&quot; CSV file is being generated for compliance."
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Forensic Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Audit <span className="text-primary not-italic">Vault</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-primary" /> Immutable Platform Logs &bull; Traceability Active
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={handleExport}
                  className="bg-card border border-border px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-2 shadow-xl shadow-primary/5"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export for Compliance
                </button>
              </div>
            </div>

            {/* A. Search & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="relative md:col-span-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter by Admin Name, Target, or Action ID..." 
                  className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent text-[10px] font-black uppercase outline-none flex-1">
                  <option>All Severities</option>
                  <option>Critical Actions</option>
                  <option>Financial Changes</option>
                  <option>Account Overrides</option>
                </select>
              </div>
            </div>

            {/* B. Logs Table */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Admin &amp; IP</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Action Performed</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Entity</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Timestamp</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-xs uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                              {log.adminName}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 mt-1">
                              <Globe className="w-3 h-3" /> {log.ip}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-primary opacity-50" />
                            <span className="text-[10px] font-black uppercase">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground italic border border-border px-2 py-1 rounded bg-muted/20">
                            {log.target}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[9px] font-bold uppercase flex items-center gap-1.5 opacity-60">
                            <Clock className="w-3 h-3" /> {log.timestamp}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border ${
                            log.severity === "Critical" ? "bg-destructive/10 text-destructive border-destructive/20 shadow-lg shadow-destructive/5 animate-pulse" :
                            log.severity === "High" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-green-500/10 text-green-500 border-green-500/20"
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-muted/30 border border-dashed border-border rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-primary">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase italic tracking-tighter">Data Retention Policy</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight max-w-lg leading-relaxed mt-1">
                    In compliance with global marketplace standards, audit logs are &quot;Write-Once&quot; and cannot be deleted or modified by any user, including Super Admins. Logs are retained for a minimum of 7 years.
                  </p>
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary">
                  <ShieldCheck className="w-4 h-4" /> Integrity Verified
                </div>
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}