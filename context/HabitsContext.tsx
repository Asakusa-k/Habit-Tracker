import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, NewHabit, HabitStats } from '@/types/habit';
import { format, isToday, parseISO, subDays } from 'date-fns';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

interface HabitsContextType {
  habits: Habit[];
  stats: HabitStats;
  isLoading: boolean;
  error: string | null;
  addHabit: (newHabit: NewHabit) => Promise<void>;
  completeHabit: (id: string, completed: boolean) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  clearAllHabits: () => Promise<void>;
  editHabit: (id: string, updates: Partial<NewHabit>) => Promise<void>;
  exportHabits: () => Promise<string>;
  importHabits: (data: string) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats>({
    currentStreak: 0,
    longestStreak: 0,
    completedDays: 0,
    totalDays: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [habits]);

  const requestNotificationPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    }
  };

  const scheduleNotification = async (habit: Habit) => {
    if (Platform.OS === 'web' || !habit.reminderEnabled) return;

    try {
      const identifiers = await Notifications.getAllScheduledNotificationsAsync();
      const existingNotification = identifiers.find(
        notification => notification.content.data.habitId === habit.id
      );
      
      if (existingNotification) {
        await Notifications.cancelScheduledNotificationAsync(existingNotification.identifier);
      }

      if (habit.reminderEnabled) {
        const [hours, minutes] = habit.reminderTime.split(':').map(Number);
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Daily Zen Reminder',
            body: `Time for your mindful habit: ${habit.name}`,
            data: { habitId: habit.id },
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  const loadHabits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedHabits = await AsyncStorage.getItem('@habits');
      if (savedHabits !== null) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      setError('Failed to load habits');
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem('@habits', JSON.stringify(newHabits));
    } catch (error) {
      setError('Failed to save habits');
      console.error('Failed to save habits:', error);
    }
  };

  const calculateStats = () => {
    if (habits.length === 0) {
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        completedDays: 0,
        totalDays: 0,
      });
      return;
    }

    let completedDays = 0;
    let totalDays = 0;
    
    habits.forEach(habit => {
      completedDays += habit.history.filter(day => day.completed).length;
      totalDays += habit.history.length;
    });

    const todayCompleted = habits.every(habit => habit.completedToday);
    const currentStreak = todayCompleted ? Math.max(...habits.map(h => h.streak)) : 0;
    const longestStreak = Math.max(...habits.map(h => h.longestStreak));

    setStats({
      currentStreak,
      longestStreak,
      completedDays,
      totalDays,
    });
  };

  const refreshHabits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const updatedHabits = habits.map(habit => {
        const hasToday = habit.history.some(day => day.date === today);
        
        if (!hasToday) {
          return {
            ...habit,
            history: [...habit.history, { date: today, completed: false }],
            completedToday: false,
          };
        }
        
        return habit;
      });
      
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      setError('Failed to refresh habits');
      console.error('Failed to refresh habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHabit = async (newHabit: NewHabit) => {
    setIsLoading(true);
    setError(null);
    try {
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
      
      const updatedHabits = [...habits, habit];
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      
      if (habit.reminderEnabled) {
        await scheduleNotification(habit);
      }
    } catch (error) {
      setError('Failed to add habit');
      console.error('Failed to add habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const editHabit = async (id: string, updates: Partial<NewHabit>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedHabits = habits.map(habit => {
        if (habit.id === id) {
          const updatedHabit = { ...habit, ...updates };
          if (updates.reminderEnabled !== undefined || updates.reminderTime !== undefined) {
            scheduleNotification(updatedHabit);
          }
          return updatedHabit;
        }
        return habit;
      });
      
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      setError('Failed to edit habit');
      console.error('Failed to edit habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeHabit = async (id: string, completed: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const updatedHabits = habits.map(habit => {
        if (habit.id !== id) return habit;
        
        const updatedHistory = habit.history.map(day => {
          if (day.date === today) {
            return { ...day, completed };
          }
          return day;
        });
        
        let streak = habit.streak;
        if (completed) {
          streak = streak + 1;
        } else {
          streak = 0;
        }
        
        const longestStreak = Math.max(habit.longestStreak, streak);
        
        return {
          ...habit,
          history: updatedHistory,
          completedToday: completed,
          streak,
          longestStreak,
        };
      });
      
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      setError('Failed to update habit completion');
      console.error('Failed to update habit completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHabit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const habitToDelete = habits.find(h => h.id === id);
      
      if (habitToDelete && habitToDelete.reminderEnabled && Platform.OS !== 'web') {
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        const notification = notifications.find(n => n.content.data.habitId === id);
        if (notification) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
      
      const updatedHabits = habits.filter(habit => habit.id !== id);
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      setError('Failed to delete habit');
      console.error('Failed to delete habit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllHabits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
      
      setHabits([]);
      await saveHabits([]);
    } catch (error) {
      setError('Failed to clear habits');
      console.error('Failed to clear habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportHabits = async () => {
    try {
      return JSON.stringify(habits);
    } catch (error) {
      throw new Error('Failed to export habits');
    }
  };

  const importHabits = async (data: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const importedHabits = JSON.parse(data);
      setHabits(importedHabits);
      await saveHabits(importedHabits);
      
      // Reschedule notifications for imported habits
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        for (const habit of importedHabits) {
          if (habit.reminderEnabled) {
            await scheduleNotification(habit);
          }
        }
      }
    } catch (error) {
      setError('Failed to import habits');
      console.error('Failed to import habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        stats,
        isLoading,
        error,
        addHabit,
        completeHabit,
        deleteHabit,
        refreshHabits,
        clearAllHabits,
        editHabit,
        exportHabits,
        importHabits,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};