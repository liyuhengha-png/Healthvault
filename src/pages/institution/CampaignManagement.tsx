import InstitutionLayout from "@/components/InstitutionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Users, Calendar, DollarSign, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const campaigns = [
  {
    name: "T2D GLP-1 Outcomes Study",
    status: "active",
    participants: 412,
    target: 500,
    created: "Feb 15, 2025",
    compensation: "$150 gift card",
    progress: 82,
    invitationsSent: 892,
    acceptRate: "46%",
  },
  {
    name: "Hypertension & CVD Risk",
    status: "active",
    participants: 287,
    target: 400,
    created: "Mar 1, 2025",
    compensation: "$200 + follow-up benefits",
    progress: 72,
    invitationsSent: 614,
    acceptRate: "47%",
  },
  {
    name: "ACE Inhibitor Effectiveness",
    status: "completed",
    participants: 148,
    target: 150,
    created: "Nov 10, 2024",
    compensation: "$100",
    progress: 100,
    invitationsSent: 320,
    acceptRate: "46%",
  },
];

export default function CampaignManagement() {
  return (
    <InstitutionLayout title="Campaign Management">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Campaigns</h2>
            <p className="text-muted-foreground text-sm">Create and manage research campaigns to recruit participants.</p>
          </div>
          <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-teal">
            <Plus className="w-4 h-4" /> Create Campaign
          </Button>
        </div>

        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div key={camp.name} className="vault-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground">{camp.name}</h3>
                      {camp.status === "active" ? (
                        <span className="status-active"><Clock className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="status-badge bg-slate-100 text-slate-600 border border-slate-200">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {camp.created}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {camp.compensation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:opacity-90">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Enrolled</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-foreground">{camp.participants}</span>
                    <span className="text-sm text-muted-foreground">/ {camp.target}</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Progress</div>
                  <div className="text-xl font-bold text-foreground">{camp.progress}%</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Invitations Sent</div>
                  <div className="text-xl font-bold text-foreground">{camp.invitationsSent}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Accept Rate</div>
                  <div className="text-xl font-bold text-primary">{camp.acceptRate}</div>
                </div>
              </div>

              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${camp.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </InstitutionLayout>
  );
}
