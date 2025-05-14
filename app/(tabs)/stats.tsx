import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabits } from '@/context/HabitsContext';
import { useTheme } from '@/context/ThemeContext';
import { StreakCard } from '@/components/StreakCard';
import { ProgressChart } from '@/components/ProgressChart';
import { EmptyState } from '@/components/EmptyState';
import { format } from 'date-fns';

export default function StatsScreen() {
  const { habits, stats } = useHabits();
  const { colors } = useTheme();

  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState 
          title="No stats yet"
          message="Add habits to start tracking your progress"
          buttonText="Add a habit"
          buttonLink="/add"
        />
      </View>
    );
  }

  const completionRate = stats.totalDays > 0 
    ? Math.round((stats.completedDays / stats.totalDays) * 100) 
    : 0;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Your Progress
      </Text>

      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Current Streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.longestStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Longest Streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {completionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Completion Rate
            </Text>
          </View>
        </View>
      </View>

      <ProgressChart habits={habits} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Habit Streaks
      </Text>

      {habits.map(habit => (
        <StreakCard key={habit.id} habit={habit} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 16,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 12,
  },
});