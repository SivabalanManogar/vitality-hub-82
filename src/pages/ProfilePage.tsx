import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBMI, getBMICategory, saveProfile, getProfile, type HealthProfile } from "@/lib/health";
import { ArrowRight, Scale } from "lucide-react";

export default function ProfilePage() {
  const existing = getProfile();
  const navigate = useNavigate();

  const [age, setAge] = useState(existing?.age?.toString() || "");
  const [gender, setGender] = useState(existing?.gender || "");
  const [height, setHeight] = useState(existing?.height?.toString() || "");
  const [weight, setWeight] = useState(existing?.weight?.toString() || "");
  const [result, setResult] = useState<HealthProfile | null>(existing);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const bmi = calculateBMI(w, h);
    const category = getBMICategory(bmi);
    const profile: HealthProfile = { age: parseInt(age), gender, height: h, weight: w, bmi, category };
    saveProfile(profile);
    setResult(profile);
  };

  const categoryColor = (cat: string) => {
    if (cat === "Normal") return "text-health-green";
    if (cat === "Underweight") return "text-primary";
    if (cat === "Overweight") return "text-amber-500";
    return "text-destructive";
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 text-2xl font-bold text-foreground">Health Profile</h1>
        <p className="mb-8 text-muted-foreground">Enter your details to calculate your BMI.</p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} required min={1} max={120} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} required min={50} max={300} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} required min={10} max={500} />
            </div>
          </div>
          <Button type="submit" className="w-full health-gradient border-0 text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
            <Scale className="mr-2 h-4 w-4" /> Calculate BMI
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 rounded-xl border border-border bg-card p-6 card-shadow text-center"
          >
            <p className="text-sm text-muted-foreground">Your BMI</p>
            <p className="text-4xl font-bold text-foreground">{result.bmi}</p>
            <p className={`mt-1 text-lg font-semibold ${categoryColor(result.category)}`}>{result.category}</p>

            <div className="mt-4 grid grid-cols-4 gap-1 text-xs text-muted-foreground">
              {["< 18.5", "18.5–24.9", "25–29.9", "30+"].map((range, i) => (
                <div key={range} className={`rounded-md py-1 ${i === ["Underweight", "Normal", "Overweight", "Obese"].indexOf(result.category) ? "bg-accent font-semibold text-accent-foreground" : "bg-muted"}`}>
                  {["Underweight", "Normal", "Overweight", "Obese"][i]}<br />{range}
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/tracker")}
              className="mt-6 rounded-full health-gradient border-0 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Continue to Habit Tracker <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
