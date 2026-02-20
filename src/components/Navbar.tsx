import { Link, useLocation } from "react-router-dom";
import { Activity, Home, ClipboardList, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/profile", label: "Profile", icon: ClipboardList },
  { path: "/tracker", label: "Tracker", icon: Activity },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg health-gradient">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold health-gradient-text">VitalTrack AI</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Mobile nav */}
        <div className="flex items-center gap-1 md:hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-lg p-2 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-mobile"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
