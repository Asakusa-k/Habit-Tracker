import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { completeHabit } from '@/store/habitsSlice';
import { useTheme } from '@/context/ThemeContext';
import { HabitCard } from '@/components/HabitCard';
import { Quote } from '@/components/Quote';
import { EmptyState } from '@/components/EmptyState';
import { format } from 'date-fns';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const isLoading = useSelector((state: RootState) => state.habits.isLoading);
  const error = useSelector((state: RootState) => state.habits.error);
  const { colors } = useTheme();

  const handleToggleHabit = (id: string, completed: boolean) => {
    dispatch(completeHabit({ id, completed }));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.dateContainer}>
        <Text style={[styles.date, { color: colors.secondaryText }]}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
      </View>

      <Quote />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard 
            habit={item}
            onToggle={handleToggleHabit}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState 
            title="No habits yet" 
            message="Add your first mindful habit to start tracking"
            buttonText="Add a habit"
            buttonLink="/add"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  date: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});