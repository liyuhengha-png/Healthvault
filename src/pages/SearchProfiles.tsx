import { useState, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, MessageSquare, User, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProfileItem = {
  id: string;
  conditions: string[];
  meds: string[];
  ageRange: string;
  sex: string;
  matchScore: number;
  wearable: boolean;
};

const filters = [
  { label: "Condition", key: "condition", options: ["Type 2 Diabetes", "Hypertension", "High Cholesterol", "GERD"] },
  { label: "Age Range", key: "age", options: ["18–25", "25–35", "35–40", "40–45", "45–50", "50+"] },
  { label: "Sex", key: "sex", options: ["Male", "Female", "Other"] },
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export default function SearchProfiles() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [messageTarget, setMessageTarget] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (next[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (activeFilters.condition) params.set("condition", activeFilters.condition);
      if (activeFilters.age) params.set("age", activeFilters.age);
      if (activeFilters.sex) params.set("sex", activeFilters.sex);

      const res = await fetch(`${apiBaseUrl}/api/profiles/search?${params.toString()}`);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      setProfiles(data.items ?? []);
    } catch (err) {
      toast({
        title: "Search failed",
        description: err instanceof Error ? err.message : "Unable to reach the search service.",
        variant: "destructive",
      });
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeFilters, toast]);

  return (
    <AppLayout title="Search Profiles">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Search Health Profiles</h2>
          <p className="text-muted-foreground text-sm">Find similar profiles by condition, medication, or demographics. All profiles are pseudonymous and de-identified.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by condition, medication, or keyword..."
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-teal" onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {filterOpen && (
          <div className="vault-card p-4 flex flex-wrap gap-6">
            {filters.map((f) => (
              <div key={f.label}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">{f.label}</label>
                <div className="flex flex-wrap gap-1.5">
                  {f.options.map((opt) => (
                    <button
                      key={opt}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        activeFilters[f.key] === opt
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-accent text-foreground"
                      }`}
                      onClick={() => toggleFilter(f.key, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {searched && !loading && (
          <div className="text-sm text-muted-foreground">{profiles.length} profile{profiles.length !== 1 ? "s" : ""} found</div>
        )}

        {searched && !loading && profiles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No profiles found matching your criteria.</p>
          </div>
        )}

        {profiles.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="vault-card-hover p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-mono font-semibold text-foreground">{profile.id}</div>
                      <div className="text-xs text-muted-foreground">{profile.ageRange} · {profile.sex}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-xs font-medium text-primary">{profile.matchScore}%</div>
                    <div className="text-[10px] text-muted-foreground">match</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Conditions</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.conditions.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Medications</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.meds.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 gap-1.5 bg-primary text-primary-foreground hover:opacity-90" onClick={() => setMessageTarget(profile.id)}>
                    <MessageSquare className="w-3 h-3" /> Request Message
                  </Button>
                  {profile.wearable && (
                    <span className="status-active text-[10px]">Wearable Data</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={messageTarget !== null} onOpenChange={(open) => { if (!open) { setMessageTarget(null); setMessageText(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="text-sm text-muted-foreground">
              To: <span className="font-mono font-medium text-foreground">{messageTarget}</span>
            </div>
            <Textarea
              placeholder="Write your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setMessageTarget(null); setMessageText(""); }}>Cancel</Button>
            <Button
              disabled={messageText.trim() === ""}
              onClick={() => {
                const target = messageTarget;
                setMessageTarget(null);
                setMessageText("");
                toast({ title: "Message request sent", description: `Your message has been sent to ${target}.` });
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
