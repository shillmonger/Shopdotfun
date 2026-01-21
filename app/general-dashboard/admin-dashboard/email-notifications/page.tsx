"use client";

import React, { useState } from "react";
import { 
  Send, 
  Users, 
  UserCheck, 
  Store, 
  Mail, 
  Paperclip, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Layout,
  Search,
  Zap,
  Trash2,
  Info
} from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "@/components/admin-dashboard/AdminHeader";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminNav from "@/components/admin-dashboard/AdminNav";

export default function EmailNotificationSystem() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Mock Queue Data
  const queueItems = [
    { id: "Q-991", subject: "New Policy Update", status: "Sent", recipients: 1240 },
    { id: "Q-992", subject: "Weekly Payouts", status: "In Queue", recipients: 45 },
  ];

  const handleSend = () => {
    if (!subject || !message) {
      return toast.error("Missing Data", {
        description: "Please fill in both the &quot;Subject&quot; and &quot;Message&quot; fields."
      });
    }

    setIsSending(true);
    // Simulate background job queueing
    setTimeout(() => {
      setIsSending(false);
      setSubject("");
      setMessage("");
      toast.success("Broadcast Queued", {
        description: `Your message has been added to the background worker for &quot;${recipientType}&quot;.`
      });
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Broadcast <span className="text-primary not-italic">Center</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" /> Direct SMTP &bull; Background Job Queuing
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* A. Composer Section */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Email Subject</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Account Verification Required"
                      className="w-full bg-background border border-border rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Template Selector</label>
                      <select className="w-full bg-background border border-border rounded-xl p-4 text-[10px] font-black uppercase outline-none">
                        <option>Blank Canvas</option>
                        <option>Policy Update (Legal)</option>
                        <option>Platform Maintenance</option>
                        <option>Seller Onboarding</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Priority Level</label>
                      <select className="w-full bg-background border border-border rounded-xl p-4 text-[10px] font-black uppercase outline-none">
                        <option>Standard (Marketing)</option>
                        <option>High (Transactional)</option>
                        <option>Urgent (Critical Updates)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Message Body</label>
                    <textarea 
                      rows={8}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your platform announcement here..."
                      className="w-full bg-background border border-border rounded-2xl p-6 text-sm font-medium leading-relaxed outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all">
                    <Paperclip className="w-4 h-4" /> Add Attachments
                  </button>
                  <button 
                    disabled={isSending}
                    onClick={handleSend}
                    className="bg-primary text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 disabled:opacity-50 shadow-xl shadow-primary/10"
                  >
                    {isSending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Broadcast Message
                  </button>
                </div>
              </div>

              {/* B. Recipient Selector & Stats */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Recipient Card */}
                <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-8">
                  <h3 className="text-sm font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Recipient Logic
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All Active Users", icon: Users },
                      { id: "sellers", label: "Only Sellers", icon: Store },
                      { id: "buyers", label: "Only Buyers", icon: UserCheck },
                      { id: "single", label: "Single User (Manual)", icon: Mail },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setRecipientType(type.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          recipientType === type.id 
                          ? "bg-primary border-primary text-white" 
                          : "bg-background border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                        <type.icon className={`w-4 h-4 ${recipientType === type.id ? "opacity-100" : "opacity-30"}`} />
                      </button>
                    ))}
                  </div>

                  {recipientType === "single" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <input 
                        type="email" 
                        placeholder="user@example.com"
                        className="w-full bg-background border border-border rounded-xl p-3 text-xs font-bold outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Queue Tracking */}
                <div className="bg-card border border-border rounded-[2.5rem] p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Live Job Queue
                  </h3>
                  <div className="space-y-3">
                    {queueItems.map((item) => (
                      <div key={item.id} className="p-3 bg-muted/20 border border-border rounded-xl">
                        <div className="flex justify-between items-start">
                          <p className="text-[9px] font-black uppercase truncate max-w-[150px] italic">{item.subject}</p>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                            item.status === "Sent" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground mt-1 uppercase">{item.recipients} Recipients</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Anti-Spam Guidelines */}
            <div className="mt-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[11px] font-black uppercase text-amber-500 mb-1">Rate Limiting & Anti-Abuse</h4>
                <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tight leading-relaxed">
                  System allows 1,000 marketing emails per hour to prevent SMTP &quot;Grey-Listing&quot;. Critical Transactional emails are prioritized. All broadcasts include a mandatory &quot;Unsubscribe&quot; tag to ensure compliance with CAN-SPAM regulations.
                </p>
              </div>
            </div>

          </div>
        </main>

        <AdminNav />
      </div>
    </div>
  );
}