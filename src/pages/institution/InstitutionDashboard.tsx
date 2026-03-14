import InstitutionLayout from "@/components/InstitutionLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, Mail, Search, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Active Campaigns", value: "3", icon: FileText, trend: "+1 this month" },
  { label: "Consented Participants", value: "847", icon: Users, trend: "+142 this week" },
  { label: "Invitations Sent", value: "2,341", icon: Mail, trend: "12% accept rate" },
  { label: "Cohort Matches", value: "14.2k", icon: Search, trend: "+892 new profiles" },
];

const campaigns = [
  { name: "T2D GLP-1 Outcomes Study", status: "active", participants: 412, target: 500, progress: 82 },
  { name: "Hypertension & CVD Risk", status: "active", participants: 287, target: 400, progress: 72 },
  { name: "ACE Inhibitor Effectiveness", status: "completed", participants: 148, target: 150, progress: 100 },
];

export default function InstitutionDashboard() {
  return (
    <InstitutionLayout title="Institution Dashboard">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome, Stanford Research</h2>
            <p className="text-muted-foreground text-sm">Manage your research campaigns and participant engagement.</p>
          </div>
          <Link to="/institution/campaigns">
            <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-teal">
              <FileText className="w-4 h-4" /> New Campaign
            </Button>
          </Link>
        </div>

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

        <div className="vault-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Your Campaigns
            </h3>
            <Link to="/institution/campaigns" className="text-xs text-primary hover:underline">View all</Link>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div key={camp.name} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground text-sm">{camp.name}</span>
                    {camp.status === "active" ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-badge bg-slate-100 text-slate-600 border border-slate-200">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {camp.participants}/{camp.target} participants · {camp.progress}% enrolled
                  </div>
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${camp.progress}%` }} />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0 gap-1 text-xs">
                  Manage <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InstitutionLayout>
  );
}
