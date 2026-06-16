import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  X,
  LayoutDashboard,
  Receipt,
  ChartPie,
  PlusCircle,
  // Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
  Wallet
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SpendlyLogo } from "@/assets/SpendlyLogo";

const NAV_MAIN = [
  { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
  { label: "Expenses", path: "/expenses", Icon: Receipt },
  { label: "Analytics", path: "/analytics", Icon: ChartPie },
  { label: "Add income", path: "/incomes", Icon: PlusCircle },
  { label: "Budgets", path: "/budgets", Icon: Wallet },
];

const NAV_ACCOUNT = [
  // { label: "Alerts", path: "/alerts", Icon: Bell },
  { label: "Settings", path: "/settings", Icon: Settings },
];

export const PageShell = ({title, subtitle, action, children}: {title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode}) => {
  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            {title  && <h1 className="text-lg sm:text-xl font-semibold text-muted-foreground leading-tight">{title}</h1>}
             {subtitle  && <p className="text-xs sm:text-sm text-secondary mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="flex items-center gap-2 shrink-0">
              {action}
              </div>}
          </div>
      )}
      {children}
    </div>
  )
}

const NavItem = ({
  collapsed,
  label,
  path,
  Icon,
  onClick,
}: {
  collapsed?: boolean;
  label: string;
  path: string;
  Icon: LucideIcon;
  onClick?: () => void;
}) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150",
          "hover:bg-card-foreground hover:text-muted-foreground",
          isActive
            ? "bg-card-foreground text-primary before:absolute before:left-0 before:top-2 before:bottom-2 before:bg-primary before:rounded-full border-r-2 border-primary"
            : "text-secondary",
        )
      }
      onClick={onClick}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

const DesktopSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen bg-card transition-all duration-200 shrink-0 relative",
        collapsed ? "w-16" : "w-[220px]",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-5",
          collapsed && "justify-center px-0",
        )}
      >
        <SpendlyLogo className="w-8 h-8" />
        {!collapsed && (
          <span className="text-[18px] font-semibold text-muted-foreground tracking-tight">
            Spendly
          </span>
        )}
      </div>
      {/* main nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}
        {!collapsed ? (
          <p className="pt-2 pb-1 px-4 text-[13px] font-medium text-secondary/50 uppercase tracking-widest">
            Account
          </p>
        ) : (
          <div className="h-px bg-border my-3 mx-1" />
        )}
        {NAV_ACCOUNT.map((item) => (
          <NavItem key={item.path} {...item} collapsed={collapsed} />
        ))}
      </nav>
      {/* user + logout */}
      <div className="border-t border-border px-2 py-3 space-y-1">
        <div
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-[14px] font-semibold text-primary-foreground">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {user?.username ?? "User"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary",
            "hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer",
          )}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[28px] w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-secondary hover:text-muted-foreground hover:border-secondary transition-all z-10 shadow-md cursor-pointer"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
};

const MobileDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/signin", { replace: true });
  };

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-200",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />
      {/* drawer panel */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <SpendlyLogo className="w-8 h-8"/>
            <span className="text-sm font-semibold text-muted-foreground">
              Spendly
            </span>
          </div>
          <button
            className="p-1.5 rounded-full text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto space-y-1">
          {NAV_MAIN.map((item) => (
            <NavItem key={item.path} {...item} onClick={onClose} />
          ))}
          <p className="pt-4 pb-1 px-4 text-[11px] font-bold text-secondary/50 uppercase tracking-widest">
            Account
          </p>
          {NAV_ACCOUNT.map((item) => (
            <NavItem key={item.path} {...item} onClick={onClose} />
          ))}
        </nav>
        <div className="border-t border-border px-3 py-3 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary-foreground">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {user?.username ?? "User"}
              </p>
              <p className="text-[11px] text-secondary truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
          >
            <LogOut size={17} className="shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const MobileTopBar = ({ onMenuOpen }: { onMenuOpen: () => void }) => {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <SpendlyLogo className="w-8 h-8"/>
        <span className="text-sm font-semibold text-muted-foreground">
          Spendly
        </span>
      </div>
      <button
        onClick={onMenuOpen}
        className="p-2 rounded-full text-secondary hover:text-muted-foreground hover:bg-card-foreground transition-colors cursor-pointer"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DesktopSidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileTopBar onMenuOpen={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
