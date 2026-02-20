import { motion } from "framer-motion";
import { getProfile, getDailyLogs, getTodayLog, generateRecommendations } from "@/lib/health";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Scale, Heart, TrendingUp, Utensils, Dumbbell, Lightbulb, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 card-shadow"
    >
      <div className="mb-2 inline-flex rounded-lg bg-accent p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const profile = getProfile();
  const todayLog = getTodayLog();
  const logs = getDailyLogs();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-muted-foreground">Please create your health profile first.</p>
        <Button onClick={() => navigate("/profile")} className="rounded-full health-gradient border-0 text-primary-foreground">Go to Profile</Button>
      </div>
    );
  }

  const last7 = logs.slice(-7).map((l) => ({
    day: new Date(l.date).toLocaleDateString("en", { weekday: "short" }),
    score: l.healthScore,
  }));

  const avgScore = last7.length > 0 ? Math.round(last7.reduce((a, b) => a + b.score, 0) / last7.length) : 0;
  const recommendations = generateRecommendations(profile, todayLog);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">Your health overview at a glance.</p>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Scale} label="BMI" value={profile.bmi.toString()} sub={profile.category} />
          <StatCard icon={Heart} label="Today's Score" value={todayLog ? `${todayLog.healthScore}/100` : "—"} />
          <StatCard icon={TrendingUp} label="Weekly Avg" value={avgScore ? `${avgScore}%` : "—"} />
          <StatCard icon={Activity} label="Days Logged" value={logs.length.toString()} />
        </div>

        {/* Weekly Chart */}
        {last7.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 rounded-xl border border-border bg-card p-6 card-shadow"
          >
            <h2 className="mb-4 font-semibold text-foreground">Weekly Progress</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">AI Recommendations</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <RecommendationBlock icon={Utensils} title="Diet Suggestions" items={recommendations.dietSuggestions} />
            <RecommendationBlock icon={Dumbbell} title="Workout Tips" items={recommendations.workouts} />
            <RecommendationBlock icon={Lightbulb} title="Lifestyle Tips" items={recommendations.lifestyleTips} />
          </div>

          <div className="mt-6 rounded-lg bg-accent p-4 text-center text-sm text-accent-foreground">
            {recommendations.motivation}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function RecommendationBlock({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed">
            ✅ {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
