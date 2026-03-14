import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import {
  Activity, Shield, MessageSquare, Upload, Search,
  TrendingUp, Lock, AlertCircle, CheckCircle2, ArrowRight,
  Wallet, FileText, HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Health Records", value: "24", icon: FileText, trend: "+3 this month" },
  { label: "Profile Views", value: "147", icon: Search, trend: "+12 this week" },
  { label: "Consent Grants", value: "3", icon: Shield, trend: "All active" },
  { label: "Messages", value: "8", icon: MessageSquare, trend: "3 unread" },
];

const recentActivity = [
  { type: "upload", text: "Blood panel report parsed & categorized", time: "2h ago", icon: Upload, color: "text-primary" },
  { type: "view", text: "Your profile was viewed 14 times", time: "5h ago", icon: Search, color: "text-blue-500" },
  { type: "consent", text: "Stanford Research Institute sent an invitation", time: "1d ago", icon: FileText, color: "text-amber-500" },
  { type: "message", text: "New message from profile anon_9341", time: "2d ago", icon: MessageSquare, color: "text-purple-500" },
  { type: "audit", text: "Consent log anchored on-chain", time: "3d ago", icon: CheckCircle2, color: "text-primary" },
];

const healthSummary = [
  { category: "Conditions", count: 2, items: ["Type 2 Diabetes", "Hypertension"] },
  { category: "Medications", count: 3, items: ["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg"] },
  { category: "Vitals (latest)", count: 4, items: ["BP: 128/82", "Glucose: 142 mg/dL", "BMI: 27.4", "HbA1c: 6.8%"] },
];

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, <span className="text-primary font-mono">anon_7842</span></h2>
            <p className="text-muted-foreground text-sm mt-0.5">Your vault is encrypted and up to date.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/health-data">
              <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-teal">
                <Upload className="w-4 h-4" /> Upload Data
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="vault-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-primary">{stat.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Health Summary */}
          <div className="lg:col-span-2 vault-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-primary" /> Health Summary
              </h3>
              <Link to="/health-data" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {healthSummary.map((cat) => (
                <div key={cat.category} className="bg-muted/50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat.category}</div>
                  <div className="space-y-1.5">
                    {cat.items.map((item) => (
                      <div key={item} className="text-xs text-foreground bg-background rounded-lg px-2.5 py-1.5 border border-border">{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Status */}
          <div className="vault-card p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-5">
              <Lock className="w-4 h-4 text-primary" /> Privacy Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Profile visibility</span>
                <span className="status-active">Searchable</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Wallet linked</span>
                <span className="status-active">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Raw data shared</span>
                <span className="status-private">None</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Active consents</span>
                <span className="status-pending">3 active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">De-ID verified</span>
                <span className="status-active">Passed</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-mono">0x3f…a9b2 · Connected</span>
              </div>
              <Link to="/consent">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  Manage Consent <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="vault-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Recent Activity
            </h3>
            <Link to="/timeline" className="text-xs text-primary hover:underline">Full timeline</Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{item.text}</div>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
