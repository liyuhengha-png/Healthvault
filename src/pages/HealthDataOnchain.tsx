import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  CheckCircle2,
  FileJson,
  Link2,
  Lock,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

type ParsedIndicator = {
  id: string;
  name: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: string;
  instrument?: string;
};

type ParseResponse = {
  fileName: string;
  indicatorCount: number;
  indicators: ParsedIndicator[];
};

type OnchainOption = {
  id: string;
  title: string;
  description: string;
  visibility: string;
  payload: Record<string, unknown>;
};

type SimulationResult = {
  publishedItems: string[];
  protectedFields: string[];
  walletAddress: string;
  transactionHash: string;
  simulatedAt: string;
};

const CATEGORY_ORDER = [
  "Lab Results",
  "Vitals",
  "Imaging / Reports",
  "Conditions & Diagnoses",
  "Medications",
  "Wearable Data",
];

const PROTECTED_FIELDS = [
  "Full name",
  "Date of birth",
  "Phone number",
  "Home address",
  "Hospital / clinic identifier",
  "Original PDF file",
];

const DEMO_WALLET_ADDRESS = "0x8F31A7c65d10B3fF2c9a6212e7A018A63A12F4D9";
const DEMO_TRANSACTION_HASH = "0x7c4d18b9a6ef10d0d99b221445af31dd2f91d4b6016f3da8937ebff201f0c2aa";
const SESSION_KEY = "vital-key-chain:health-data:onchain-source:v1";

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "category";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function buildOptionsFromReport(report: ParseResponse): OnchainOption[] {
  const groups = new Map<string, ParsedIndicator[]>();
  for (const cat of CATEGORY_ORDER) groups.set(cat, []);

  for (const ind of report.indicators) {
    const key = ind.category || "Uncategorized";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ind);
  }

  const options: OnchainOption[] = [];
  const ordered = [
    ...CATEGORY_ORDER.filter((c) => (groups.get(c)?.length ?? 0) > 0),
    ...[...groups.keys()].filter((k) => !CATEGORY_ORDER.includes(k) && (groups.get(k)?.length ?? 0) > 0).sort(),
  ];

  for (const cat of ordered) {
    const indicators = groups.get(cat) ?? [];
    if (!indicators.length) continue;
    const abnormalCount = indicators.filter((i) => ["high", "low", "abnormal"].includes(i.status)).length;
    options.push({
      id: `category:${slugify(cat)}`,
      title: cat,
      description: `${indicators.length} indicator${indicators.length === 1 ? "" : "s"}${abnormalCount > 0 ? `, ${abnormalCount} flagged` : ""}`,
      visibility: "Only summary-level commitments for this category are published on-chain.",
      payload: {
        fileName: report.fileName,
        category: cat,
        indicatorCount: indicators.length,
        abnormalCount,
        statusBreakdown: indicators.reduce<Record<string, number>>((acc, i) => {
          const s = i.status || "unknown";
          acc[s] = (acc[s] ?? 0) + 1;
          return acc;
        }, {}),
        indicatorIds: indicators.map((i) => i.id),
      },
    });
  }
  return options;
}

export default function HealthDataOnchain() {
  const { connect, address, shortAddress, isConnected, isConnecting, isWalletAvailable } = useWalletContext();
  const { toast } = useToast();
  const [report, setReport] = useState<ParseResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && parsed?.report) {
        setReport(parsed.report as ParseResponse);
      }
    } catch {
      // Ignore malformed sessionStorage
    }
  }, []);

  const onchainOptions = useMemo(() => (report ? buildOptionsFromReport(report) : []), [report]);

  useEffect(() => {
    if (onchainOptions.length > 0 && selectedIds.length === 0) {
      setSelectedIds(onchainOptions.map((o) => o.id));
    }
  }, [onchainOptions]);

  const selectedOptions = useMemo(
    () => onchainOptions.filter((option) => selectedIds.includes(option.id)),
    [selectedIds, onchainOptions],
  );

  const toggleSelection = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) return current.includes(id) ? current : [...current, id];
      return current.filter((item) => item !== id);
    });
  };

  const handleSimulateOnchain = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Select at least one item",
        description: "Choose one or more records before continuing with the on-chain flow.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let walletAddress = address;

      if (!walletAddress && isWalletAvailable) {
        walletAddress = await connect();
        if (!walletAddress) {
          toast({
            title: "Wallet connection was not completed",
            description: "Reconnect your browser wallet and try again.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!walletAddress) {
        walletAddress = DEMO_WALLET_ADDRESS;
        toast({
          title: "Temporary wallet session",
          description: "No browser wallet was detected, so a temporary wallet address was prepared to continue this flow.",
        });
      }

      await wait(900);
      await wait(1200);

      setResult({
        publishedItems: selectedOptions.map((option) => option.title),
        protectedFields: PROTECTED_FIELDS,
        walletAddress,
        transactionHash: DEMO_TRANSACTION_HASH,
        simulatedAt: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      toast({
        title: "On-chain record created",
        description: "Your transaction summary is now ready to review.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty state — no report data in sessionStorage
  if (!report) {
    return (
      <AppLayout title="On-Chain Review">
        <div className="p-6 flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <FileJson className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">No report data found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Upload and parse a health report first to continue with the on-chain flow.
          </p>
          <Button asChild>
            <Link to="/health-data">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Health Data
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (result) {
    return (
      <AppLayout title="On-Chain Review">
        <div className="p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <section className="overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,hsl(171_72%_28%)_0%,hsl(191_63%_24%)_100%)] p-6 text-white shadow-[var(--shadow-lg)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Transaction completed</Badge>
                  <h2 className="text-3xl font-bold tracking-tight">Selected health data has been prepared for on-chain publishing.</h2>
                  <p className="max-w-2xl text-sm text-white/80">
                    Review exactly what was published, what remained private, and which wallet session was used for confirmation.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/65">Wallet</div>
                  <div className="mt-1 text-sm font-semibold">{result.walletAddress}</div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="vault-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Published on-chain
                </h3>
                <div className="mt-4 space-y-3">
                  {result.publishedItems.map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-muted/20 p-4">
                      <div className="text-sm font-medium text-foreground">{item}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-5" />

                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Lock className="h-4 w-4 text-primary" />
                  Protected privacy fields
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {result.protectedFields.map((field) => (
                    <div key={field} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                      {field}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="vault-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">Transaction receipt</h3>
                  <div className="mt-4 space-y-4 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Wallet address</div>
                      <div className="mt-1 font-medium text-foreground break-all">{result.walletAddress}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Transaction hash</div>
                      <div className="mt-1 font-medium text-foreground break-all">{result.transactionHash}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recorded at</div>
                      <div className="mt-1 font-medium text-foreground">{result.simulatedAt}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-accent p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="text-sm text-accent-foreground">
                      <strong>Privacy is still protected.</strong> Only summary-level commitments and integrity proofs are published. Raw report details and personal identifiers remain off-chain.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild className="gap-2">
                    <Link to="/health-data">
                      Back to report review
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setResult(null)}
                  >
                    Create another record
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="On-Chain Review">
      <div className="p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,hsl(220_45%_14%)_0%,hsl(193_60%_17%)_55%,hsl(171_62%_20%)_100%)] p-6 text-white shadow-[var(--shadow-lg)]">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Selective publishing</Badge>
                  <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Privacy protected</Badge>
                  <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">Wallet confirmation</Badge>
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Do you want to publish part of this report on-chain?</h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/78">
                    Choose only the summary-level items you want to anchor. Privacy-sensitive fields stay protected and are never shown publicly on-chain.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/55">On-chain</div>
                    <div className="mt-2 text-sm font-semibold">Summary commitments</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/55">Off-chain</div>
                    <div className="mt-2 text-sm font-semibold">Personal identifiers and report file</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/55">Wallet</div>
                    <div className="mt-2 text-sm font-semibold">{isConnected ? shortAddress : "Connect on action"}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Select what to publish</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {onchainOptions.map((option) => (
                <div
                  key={option.id}
                  className={`vault-card p-5 cursor-pointer transition-all ${
                    selectedIds.includes(option.id) ? "border-primary/50 bg-accent/30" : ""
                  }`}
                  onClick={() => toggleSelection(option.id, !selectedIds.includes(option.id))}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.includes(option.id)}
                      onCheckedChange={(checked) => toggleSelection(option.id, checked === true)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{option.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                      <div className="text-xs text-muted-foreground/70 mt-2">{option.visibility}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/health-data">
                <ArrowLeft className="h-4 w-4" />
                Back to report
              </Link>
            </Button>
            <Button
              className="gap-2"
              disabled={isSubmitting || selectedOptions.length === 0}
              onClick={handleSimulateOnchain}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Blocks className="h-4 w-4" />}
              {isSubmitting ? "Processing..." : "Publish on-chain"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
