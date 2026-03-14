import AppLayout from "@/components/AppLayout";
import { Activity, Upload, MessageSquare, Shield, Search, FileText, HeartPulse } from "lucide-react";

const events = [
  {
    date: "Mar 7, 2025",
    items: [
      { icon: Upload, color: "text-primary", bg: "bg-accent", label: "Blood panel uploaded & parsed", sub: "12 records extracted · HbA1c, Glucose, Lipid Panel", tag: "Upload" },
      { icon: HeartPulse, color: "text-emerald-600", bg: "bg-emerald-50", label: "Vitals updated", sub: "BP: 128/82 · Pulse: 74 bpm · Weight: 184 lbs", tag: "Vitals" },
    ],
  },
  {
    date: "Feb 20, 2025",
    items: [
      { icon: FileText, color: "text-blue-600", bg: "bg-blue-50", label: "ECG Report uploaded", sub: "Normal sinus rhythm. QTc: 412 ms", tag: "Upload" },
      { icon: Shield, color: "text-purple-600", bg: "bg-purple-50", label: "Consent granted — Stanford Research", sub: "Data scope: Conditions, Medications. Expires Jul 2025", tag: "Consent" },
    ],
  },
  {
    date: "Feb 10, 2025",
    items: [
      { icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", label: "Private message received from anon_9341", sub: "Accepted. Connection established.", tag: "Message" },
    ],
  },
  {
    date: "Jan 28, 2025",
    items: [
      { icon: Search, color: "text-foreground", bg: "bg-muted", label: "Profile made searchable", sub: "Conditions: T2D, Hypertension. Age range: 35–40. Sex: Male", tag: "Privacy" },
      { icon: Activity, color: "text-primary", bg: "bg-accent", label: "Wearable data synced", sub: "12,440 steps · 6.8h sleep · SpO2: 98%", tag: "Wearable" },
    ],
  },
  {
    date: "Jan 15, 2025",
    items: [
      { icon: Upload, color: "text-primary", bg: "bg-accent", label: "Account created & wallet linked", sub: "0x3f…a9b2 · ProfileRegistry anchored on-chain", tag: "System" },
    ],
  },
];

const tagColors: Record<string, string> = {
  Upload: "bg-primary/10 text-primary",
  Consent: "bg-purple-50 text-purple-700",
  Message: "bg-amber-50 text-amber-700",
  Privacy: "bg-slate-100 text-slate-600",
  Wearable: "bg-emerald-50 text-emerald-700",
  Vitals: "bg-emerald-50 text-emerald-700",
  System: "bg-muted text-muted-foreground",
};

export default function Timeline() {
  return (
    <AppLayout title="Health Timeline">
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">Your Health Timeline</h2>
          <p className="text-muted-foreground text-sm">A chronological record of uploads, consent events, and health activity.</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {events.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold text-muted-foreground">
                    {group.date.split(" ")[0].toUpperCase()}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{group.date}</div>
                </div>

                <div className="ml-16 space-y-3">
                  {group.items.map((item, i) => (
                    <div key={i} className="vault-card p-4 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColors[item.tag] || "bg-muted text-muted-foreground"}`}>
                            {item.tag}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
