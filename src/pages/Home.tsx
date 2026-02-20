import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Heart, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Activity, title: "BMI Tracking", desc: "Calculate and monitor your body mass index over time." },
  { icon: Heart, title: "Habit Monitoring", desc: "Log sleep, water, exercise and track your daily health score." },
  { icon: TrendingUp, title: "AI Recommendations", desc: "Get personalized diet, workout and lifestyle tips." },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground card-shadow">
            <Activity className="h-4 w-4 text-primary" />
            Preventive Health Companion
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="health-gradient-text">VitalTrack AI</span>
          </h1>
          <p className="mb-2 text-xl font-medium text-foreground">
            Track. Improve. Prevent.
          </p>
          <p className="mb-8 text-lg text-muted-foreground">
            A smart preventive health dashboard combining BMI tracking, habit monitoring, and AI-powered health recommendations.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/profile")}
            className="health-gradient border-0 text-primary-foreground rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-4 py-16">
        <div className="container mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="rounded-xl border border-border bg-background p-6 card-shadow transition-shadow hover:card-shadow-hover"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent p-2.5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
