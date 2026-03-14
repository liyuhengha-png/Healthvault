import PublicLayout from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff, Database, Activity, ArrowRight } from "lucide-react";

const layers = [
  {
    icon: Database,
    title: "Data Never Leaves You Raw",
    desc: "When you upload health records, they are encrypted client-side before transmission. We never see your raw data — only encrypted blobs.",
    badge: "Client-Side Encryption",
  },
  {
    icon: EyeOff,
    title: "De-Identification Pipeline",
    desc: "Before any data is shared or made searchable, it passes through our de-identification engine. Names, dates of birth, addresses, and other PII are stripped automatically.",
    badge: "Auto De-ID",
  },
  {
    icon: Eye,
    title: "Pseudonymous Profiles",
    desc: "Your public profile shows only a pseudonym and de-identified health attributes. Age is shown as a range (e.g., 30–35). Location is never shown.",
    badge: "Privacy by Default",
  },
  {
    icon: Shield,
    title: "On-Chain Consent Registry",
    desc: "Every consent grant or revocation is anchored to the blockchain. Institutions cannot claim you consented if the chain says otherwise.",
    badge: "Verifiable Consent",
  },
  {
    icon: Lock,
    title: "Public vs Private Separation",
    desc: "Every health data field is tagged as public (searchable) or private (encrypted, not shared). You toggle at any time from the Consent Center.",
    badge: "Granular Control",
  },
  {
    icon: Activity,
    title: "Immutable Audit Log",
    desc: "Every access, share, or consent event is logged and anchored on-chain. You can audit exactly who accessed what, when.",
    badge: "Full Audit Trail",
  },
];

export default function PrivacyExplainer() {
  return (
    <PublicLayout>
      <div className="py-24 container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            Privacy Architecture
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">How we protect your health data</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            HealthVault is built privacy-first from the ground up. Here's exactly how your data is protected at every layer.
          </p>
        </div>

        <div className="space-y-6">
          {layers.map((layer, i) => (
            <div key={layer.title} className="vault-card p-8 flex gap-6 items-start animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <layer.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{layer.title}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 font-mono uppercase tracking-wider">
                    {layer.badge}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 vault-card p-8 text-center" style={{ background: "var(--gradient-hero)" }}>
          <h2 className="text-2xl font-bold text-white mb-3">Questions about our privacy model?</h2>
          <p className="text-white/60 mb-6">Our architecture is open for review. We believe in radical transparency about how we handle health data.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:opacity-90 shadow-teal gap-2">
                Start with Privacy <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10">
                Read FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
