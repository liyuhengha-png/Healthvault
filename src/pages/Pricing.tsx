import PublicLayout from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Individual",
    price: "Free",
    period: "forever",
    desc: "For people who want to take control of their personal health data.",
    features: [
      "Pseudonymous profile",
      "Up to 500MB encrypted storage",
      "Manual health data entry",
      "Basic search & discovery",
      "Consent center",
      "On-chain audit log",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Individual Pro",
    price: "$9",
    period: "per month",
    desc: "For power users with more data and more privacy needs.",
    features: [
      "Everything in Free",
      "5GB encrypted storage",
      "PDF & image upload parsing",
      "Apple Health integration",
      "Wearable data sync",
      "Priority message inbox",
      "Advanced analytics timeline",
    ],
    cta: "Start Pro",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Research Institution",
    price: "$299",
    period: "per month",
    desc: "For hospitals, CROs, and academic researchers running health studies.",
    features: [
      "Institution verified badge",
      "Research campaign creation",
      "Cohort search & filtering",
      "Bulk invitation send",
      "Consent verification API",
      "Compliance audit exports",
      "Dedicated support",
    ],
    cta: "Contact Us",
    href: "/institutions",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <PublicLayout>
      <div className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            Transparent Pricing
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Simple, honest pricing</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            No hidden fees. No data monetization. You pay for infrastructure, not your privacy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`vault-card p-8 flex flex-col relative ${plan.highlight ? "border-primary/40 shadow-teal" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-teal">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Link to={plan.href}>
                <Button
                  className={`w-full gap-2 ${plan.highlight ? "bg-primary text-primary-foreground hover:opacity-90 shadow-teal" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include end-to-end encryption, on-chain audit logs, and HIPAA-aligned data handling.
            <br />
            <Link to="/faq" className="text-primary hover:underline">Have questions? See our FAQ →</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
