import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Habit } from '@/types/habit';
import { getDynamicIcon } from '@/utils/iconMapping';
import { format, isThisWeek, parseISO } from 'date-fns';

interface StreakCardProps {
  habit: Habit;
}

export const StreakCard: React.FC<StreakCardProps> = ({ habit }) => {
  const { colors } = useTheme();
  const HabitIcon = getDynamicIcon(habit.icon);
  
  // Get last 7 days of history
  const recentHistory = [...habit.history]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();
  
  // Calculate completion percentage for this week
  const weekEntries = habit.history.filter(day => isThisWeek(parseISO(day.date)));
  const weekCompletionRate = weekEntries.length > 0
    ? Math.round((weekEntries.filter(day => day.completed).length / weekEntries.length) * 100)
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: habit.color + '20' }
            ]}
          >
            <HabitIcon size={18} color={habit.color} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {habit.name}
          </Text>
        </View>
        <Text style={[styles.streakBadge, { backgroundColor: habit.color }]}>
          {habit.streak} days
        </Text>
      </View>
      
      <View style={styles.weekContainer}>
        {recentHistory.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View 
              style={[
                styles.dayCircle, 
                { 
                  backgroundColor: day.completed ? habit.color : 'transparent',
                  borderColor: habit.color,
                }
              ]}
            />
            <Text style={[styles.dayLabel, { color: colors.secondaryText }]}>
              {format(parseISO(day.date), 'E')}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.weeklyText, { color: colors.secondaryText }]}>
          This week: {weekCompletionRate}% completed
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  streakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayContainer: {
    alignItems: 'center',
    width: 32,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 4,
  },
  dayLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  footer: {
    marginTop: 8,
  },
  weeklyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});