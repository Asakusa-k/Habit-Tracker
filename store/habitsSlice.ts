import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, NewHabit, HabitStats } from '@/types/habit';
import { format, subDays } from 'date-fns';

interface HabitsState {
  habits: Habit[];
  stats: HabitStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    completedDays: 0,
    totalDays: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunks for loading and saving habits
export const loadHabits = createAsyncThunk('habits/load', async () => {
  const savedHabits = await AsyncStorage.getItem('@habits');
  return savedHabits ? JSON.parse(savedHabits) : [];
});

export const saveHabits = createAsyncThunk('habits/save', async (habits: Habit[]) => {
  await AsyncStorage.setItem('@habits', JSON.stringify(habits));
  return habits;
});

export const addHabit = createAsyncThunk('habits/add', async (newHabit: NewHabit, { getState, dispatch }) => {
  const state = getState() as { habits: HabitsState };
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const habit: Habit = {
    id: Date.now().toString(),
    ...newHabit,
    createdAt: new Date().toISOString(),
    streak: 0,
    longestStreak: 0,
    completedToday: false,
    history: [
      { date: yesterday, completed: false },
      { date: today, completed: false }
    ],
  };
  const updatedHabits = [...state.habits.habits, habit];
  await AsyncStorage.setItem('@habits', JSON.stringify(updatedHabits));
  return updatedHabits;
});

export const completeHabit = createAsyncThunk(
  'habits/complete',
  async ({ id, completed }: { id: string; completed: boolean }, { getState }) => {
    const state = getState() as any;
    const habits: Habit[] = state.habits.habits.map((habit: Habit) => {
      if (habit.id === id) {
        // Update today's completion
        const today = format(new Date(), 'yyyy-MM-dd');
        let updated = false;
        const newHistory = habit.history.map((h) => {
          if (h.date === today) {
            updated = true;
            return { ...h, completed };
          }
          return h;
        });
        // If today not in history, add it
        if (!updated) newHistory.push({ date: today, completed });
        return {
          ...habit,
          completedToday: completed,
          history: newHistory,
        };
      }
      return habit;
    });
    await AsyncStorage.setItem('@habits', JSON.stringify(habits));
    return habits;
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits(state, action: PayloadAction<Habit[]>) {
      state.habits = action.payload;
    },
    // Add more reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHabits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadHabits.fulfilled, (state, action) => {
        state.habits = action.payload;
        state.isLoading = false;
      })
      .addCase(loadHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to load habits';
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
        state.isLoading = false;
      })
      .addCase(completeHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeHabit.fulfilled, (state, action) => {
        state.habits = action.payload;
        state.isLoading = false;
      })
      .addCase(completeHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to complete habit';
      });
  },
});

export const { setHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
export * from './habitsSlice';