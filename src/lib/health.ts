export interface HealthProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  category: string;
}

export interface DailyLog {
  date: string;
  sleepHours: number;
  waterIntake: number;
  exercise: boolean;
  steps: number;
  healthScore: number;
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 100) / 100;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateHealthScore(log: Omit<DailyLog, "healthScore" | "date">, bmiCategory: string): number {
  let score = 0;
  if (log.sleepHours >= 7) score += 25;
  if (log.waterIntake >= 2) score += 25;
  if (log.exercise) score += 25;
  if (bmiCategory === "Normal") score += 25;
  return score;
}

export function getProfile(): HealthProfile | null {
  const data = localStorage.getItem("vitaltrack_profile");
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: HealthProfile): void {
  localStorage.setItem("vitaltrack_profile", JSON.stringify(profile));
}

export function getDailyLogs(): DailyLog[] {
  const data = localStorage.getItem("vitaltrack_logs");
  return data ? JSON.parse(data) : [];
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  const existingIndex = logs.findIndex((l) => l.date === log.date);
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem("vitaltrack_logs", JSON.stringify(logs));
}

export function getTodayLog(): DailyLog | null {
  const today = new Date().toISOString().split("T")[0];
  const logs = getDailyLogs();
  return logs.find((l) => l.date === today) || null;
}

export function generateRecommendations(profile: HealthProfile, log: DailyLog | null) {
  const { age, gender, bmi, category } = profile;

  const dietSuggestions: string[] = [];
  const workouts: string[] = [];
  const lifestyleTips: string[] = [];

  // Diet based on BMI
  if (category === "Underweight") {
    dietSuggestions.push("Include calorie-dense foods like nuts, avocados, and whole grains in your meals.");
    dietSuggestions.push("Add protein-rich snacks such as Greek yogurt or trail mix between meals.");
    dietSuggestions.push("Consider smoothies with banana, peanut butter, and oats for a nutritious boost.");
  } else if (category === "Normal") {
    dietSuggestions.push("Maintain a balanced plate with vegetables, lean protein, and complex carbs.");
    dietSuggestions.push("Include colorful fruits and vegetables for a wide range of vitamins.");
    dietSuggestions.push("Stay hydrated and limit processed sugar intake to maintain your healthy weight.");
  } else if (category === "Overweight") {
    dietSuggestions.push("Focus on portion control and include more fiber-rich vegetables in meals.");
    dietSuggestions.push("Replace sugary drinks with water, herbal teas, or infused water.");
    dietSuggestions.push("Choose whole grains over refined carbs and add lean proteins to feel fuller longer.");
  } else {
    dietSuggestions.push("Start with small changes: swap fried foods for grilled or baked alternatives.");
    dietSuggestions.push("Increase your vegetable intake to half your plate at each meal.");
    dietSuggestions.push("Plan meals ahead to avoid impulsive unhealthy food choices.");
  }

  // Workouts
  if (age < 30) {
    workouts.push("Try a 20-minute HIIT session 3 times a week for cardiovascular health.");
    workouts.push("Include bodyweight exercises like push-ups, squats, and planks daily.");
    workouts.push("Go for a brisk 30-minute walk or jog to boost your energy levels.");
  } else if (age < 50) {
    workouts.push("Start with 30 minutes of moderate walking 5 days a week.");
    workouts.push("Try yoga or stretching routines to improve flexibility and reduce stress.");
    workouts.push("Include light resistance training twice a week for bone and muscle health.");
  } else {
    workouts.push("Gentle daily walks of 20–30 minutes can significantly improve heart health.");
    workouts.push("Try chair exercises or water aerobics for low-impact joint-friendly movement.");
    workouts.push("Practice balance exercises like standing on one foot to prevent falls.");
  }

  // Lifestyle
  if (log && log.sleepHours < 7) {
    lifestyleTips.push("Aim for 7–8 hours of sleep by setting a consistent bedtime routine.");
  } else {
    lifestyleTips.push("Great sleep habits! Keep your room cool and dark for optimal rest.");
  }
  if (log && log.waterIntake < 2) {
    lifestyleTips.push("Carry a water bottle and set hourly reminders to stay hydrated.");
  } else {
    lifestyleTips.push("You're well hydrated! Keep it up by sipping water throughout the day.");
  }
  lifestyleTips.push("Take 5-minute mindfulness breaks during your day to reduce stress and improve focus.");

  const motivationalMessages = [
    "Every small step you take today builds a healthier tomorrow. Keep going! 💪",
    "Your health journey is unique — celebrate every progress, no matter how small! 🌟",
    "Consistency beats perfection. Show up for yourself every day! 🏆",
    "You're investing in the most important thing — yourself. Be proud! 🌱",
  ];
  const motivation = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return { dietSuggestions, workouts, lifestyleTips, motivation };
}
