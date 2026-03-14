import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Activity, LayoutDashboard, Search, FileText, Mail, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/institution/dashboard" },
  { label: "Campaigns", icon: FileText, href: "/institution/campaigns" },
  { label: "Search Cohorts", icon: Search, href: "/institution/search" },
  { label: "Invitations", icon: Mail, href: "/institution/invitations" },
];

interface InstitutionLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function InstitutionLayout({ children, title }: InstitutionLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-[220px] flex-shrink-0 flex flex-col" style={{ background: "var(--gradient-navy)" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex-shrink-0">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-bold text-sidebar-accent-foreground tracking-tight">HealthVault</span>
            <div className="text-[10px] text-sidebar-foreground/60">Research Portal</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("flex-shrink-0 w-4 h-4", active && "text-primary")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border flex-shrink-0">
          {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg ml-auto">
            <div className="w-6 h-6 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">S</div>
            <span className="text-sm font-medium text-accent-foreground">Stanford Research</span>
            <span className="status-active text-[10px]">Verified</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
