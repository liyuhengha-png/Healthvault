import heroImg from "@/assets/hero-bg.jpg";
import PublicLayout from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield, Lock, Search, MessageSquare, FlaskConical,
  CheckCircle2, ArrowRight, Globe, Cpu, Key, ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Zero Raw Data On-Chain",
    desc: "Only encrypted metadata and identifiers are stored on the blockchain. Your health data never leaves your control.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "All data is encrypted before upload. De-identification removes personal identifiers before any sharing.",
  },
  {
    icon: Search,
    title: "Find Similar Profiles",
    desc: "Search for people with similar conditions, medications, or health profiles — all pseudonymously.",
  },
  {
    icon: MessageSquare,
    title: "Private Messaging",
    desc: "Connect with others through fee-gated private messages. Escrow protects both parties.",
  },
  {
    icon: FlaskConical,
    title: "Research Participation",
    desc: "Institutions can invite you to relevant studies. You choose what to share and can revoke at any time.",
  },
  {
    icon: Key,
    title: "Consent Center",
    desc: "Granular control over who sees what. Grant, revoke, and audit all consents in one place.",
  },
];

const stats = [
  { value: "100%", label: "Data Ownership" },
  { value: "0", label: "Raw Data On-Chain" },
  { value: "On-Chain", label: "Audit Trail" },
  { value: "HIPAA", label: "Compliant Design" },
];

const howItWorks = [
  { step: "01", title: "Create a pseudonymous profile", desc: "No real name required. Link your wallet for on-chain verification." },
  { step: "02", title: "Upload & organize health data", desc: "Manual entry, PDFs, or wearable integrations. Auto-categorized by AI." },
  { step: "03", title: "De-identify before sharing", desc: "Remove all personal identifiers. Choose what's searchable by others." },
  { step: "04", title: "Connect & participate", desc: "Find similar profiles, message privately, or join research studies." },
];

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220 45% 8% / 0.92) 0%, hsl(195 55% 10% / 0.85) 50%, hsl(171 50% 10% / 0.80) 100%)" }} />

        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-600/30 bg-teal-900/20 text-teal-400 text-xs font-medium mb-6 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Privacy-Preserving Health Data Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Your health data,{" "}
              <span className="teal-glow-text">owned by you.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
              HealthVault is a decentralized platform where you upload, manage, and selectively share your health data — with zero raw data on-chain and full consent control.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 shadow-teal gap-2 text-base px-6">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/privacy">
                <Button size="lg" variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 text-base px-6 backdrop-blur-sm">
                  How Privacy Works
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label} className="glass-panel rounded-xl px-4 py-3">
                  <div className="text-xl font-bold teal-glow-text">{s.value}</div>
                  <div className="text-xs text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
              Core Features
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Built for privacy. Designed for trust.</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every feature is architected around the principle that you — not platforms — own your health story.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="vault-card-hover p-6 group">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-5 h-5 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How HealthVault works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps to full control of your health data.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="vault-card p-6">
                  <div className="font-mono text-3xl font-bold text-primary/20 mb-3">{step.step}</div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Trust Banner */}
      <section className="py-16 border-t border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {[
              { icon: Globe, label: "Blockchain Anchored" },
              { icon: Lock, label: "End-to-End Encrypted" },
              { icon: Cpu, label: "On-Device Processing" },
              { icon: CheckCircle2, label: "HIPAA Aligned" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/70">
                <Icon className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control?</h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Join thousands of users who have taken back ownership of their health data.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 shadow-teal gap-2">
              Create Your Vault <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
