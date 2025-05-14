export type HabitCategory = 'mindfulness' | 'exercise' | 'nutrition' | 'productivity' | 'sleep';

export interface HabitDay {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  color: string;
  reminderEnabled: boolean;
  reminderTime: string;
  createdAt: string;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  history: HabitDay[];
}

export interface NewHabit {
  name: string;
  category: HabitCategory;
  icon: string;
  color: string;
  reminderEnabled: boolean;
  reminderTime: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  totalDays: number;
}