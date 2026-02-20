import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getProfile, calculateHealthScore, saveDailyLog, getTodayLog, type DailyLog } from "@/lib/health";
import { ArrowRight, Droplets, Moon, Footprints, Dumbbell } from "lucide-react";

export default function TrackerPage() {
  const profile = getProfile();
  const todayLog = getTodayLog();
  const navigate = useNavigate();

  const [sleep, setSleep] = useState(todayLog?.sleepHours?.toString() || "");
  const [water, setWater] = useState(todayLog?.waterIntake?.toString() || "");
  const [exercise, setExercise] = useState(todayLog?.exercise || false);
  const [steps, setSteps] = useState(todayLog?.steps?.toString() || "");
  const [result, setResult] = useState<DailyLog | null>(todayLog);

  if (!profile) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-muted-foreground">Please create your health profile first.</p>
        <Button onClick={() => navigate("/profile")} className="rounded-full health-gradient border-0 text-primary-foreground">Go to Profile</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const logData = {
      sleepHours: parseFloat(sleep),
      waterIntake: parseFloat(water),
      exercise,
      steps: steps ? parseInt(steps) : 0,
    };
    const healthScore = calculateHealthScore(logData, profile.category);
    const log: DailyLog = { ...logData, healthScore, date: new Date().toISOString().split("T")[0] };
    saveDailyLog(log);
    setResult(log);
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-2xl font-bold text-foreground">Daily Habit Tracker</h1>
        <p className="mb-8 text-muted-foreground">Log today's habits to get your health score.</p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="space-y-2">
            <Label htmlFor="sleep" className="flex items-center gap-2"><Moon className="h-4 w-4 text-primary" /> Sleep Hours</Label>
            <Input id="sleep" type="number" step="0.5" placeholder="8" value={sleep} onChange={(e) => setSleep(e.target.value)} required min={0} max={24} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="water" className="flex items-center gap-2"><Droplets className="h-4 w-4 text-primary" /> Water Intake (Liters)</Label>
            <Input id="water" type="number" step="0.1" placeholder="2.5" value={water} onChange={(e) => setWater(e.target.value)} required min={0} max={20} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
            <Label htmlFor="exercise" className="flex items-center gap-2 cursor-pointer"><Dumbbell className="h-4 w-4 text-primary" /> Did you exercise today?</Label>
            <Switch id="exercise" checked={exercise} onCheckedChange={setExercise} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="steps" className="flex items-center gap-2"><Footprints className="h-4 w-4 text-primary" /> Steps (Optional)</Label>
            <Input id="steps" type="number" placeholder="5000" value={steps} onChange={(e) => setSteps(e.target.value)} min={0} />
          </div>
          <Button type="submit" className="w-full rounded-full health-gradient border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Log Today's Habits
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 rounded-xl border border-border bg-card p-6 card-shadow text-center"
          >
            <p className="text-sm text-muted-foreground">Today's Health Score</p>
            <p className="text-5xl font-bold text-foreground">{result.healthScore}</p>
            <p className="text-muted-foreground">/100</p>

            {/* Progress bar */}
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full health-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${result.healthScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-full health-gradient border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
