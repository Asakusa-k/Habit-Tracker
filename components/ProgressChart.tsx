import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Habit } from '@/types/habit';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface ProgressChartProps {
  habits: Habit[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ habits }) => {
  const { colors, theme } = useTheme();
  const today = new Date();
  
  // Get current month days
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today)
  });
  
  // Calculate completion for each day
  const dayCompletions = daysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // If no habits existed on this day yet, return 0
    if (!habits.some(habit => habit.history.some(h => h.date === dateStr))) {
      return 0;
    }
    
    // Count how many habits were completed this day
    const habitsForDay = habits.filter(habit => 
      habit.history.some(h => h.date === dateStr)
    );
    
    const completedCount = habitsForDay.filter(habit => 
      habit.history.find(h => h.date === dateStr)?.completed
    ).length;
    
    return habitsForDay.length > 0 ? completedCount / habitsForDay.length : 0;
  });
  
  // Group by weeks for display
  const weeks: number[][] = [];
  let currentWeek: number[] = [];
  
  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = daysInMonth[0].getDay();
  
  // Add empty spaces for days before the first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(-1); // -1 indicates empty cell
  }
  
  // Add all days
  dayCompletions.forEach((completion, index) => {
    currentWeek.push(completion);
    
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  // Add empty spaces after the last day of month
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(-1);
    }
    weeks.push([...currentWeek]);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {format(today, 'MMMM yyyy')}
      </Text>
      
      <View style={styles.weekdaysContainer}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text 
            key={index} 
            style={[styles.weekdayText, { color: colors.secondaryText }]}
          >
            {day}
          </Text>
        ))}
      </View>
      
      <View style={styles.calendarContainer}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((completion, dayIndex) => {
              // Skip rendering empty cells
              if (completion === -1) {
                return <View key={dayIndex} style={styles.emptyCell} />;
              }
              
              // Calculate color based on completion rate
              let backgroundColor;
              if (completion === 0) {
                backgroundColor = theme === 'dark' ? '#2C2C2C' : '#EEEEEE';
              } else if (completion < 0.5) {
                backgroundColor = colors.primary + '80'; // Semi-transparent
              } else {
                backgroundColor = colors.primary;
              }
              
              const dayOfMonth = weekIndex * 7 + dayIndex - firstDayOfWeek + 1;
              const isToday = dayOfMonth === today.getDate();
              
              return (
                <View 
                  key={dayIndex} 
                  style={[
                    styles.dayCell, 
                    { backgroundColor },
                    isToday && styles.todayCell
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayText, 
                      { color: completion > 0 ? '#FFFFFF' : colors.secondaryText }
                    ]}
                  >
                    {dayOfMonth}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    width: 36,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emptyCell: {
    width: 36,
    height: 36,
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});