import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { Habit } from '@/types/habit';
import { useTheme } from '@/context/ThemeContext';
import { getDynamicIcon } from '@/utils/iconMapping';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useHabits } from '@/context/HabitsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, completed: boolean) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  const { colors } = useTheme();
  const { deleteHabit } = useHabits();
  
  const HabitIcon = getDynamicIcon(habit.icon);

  const rightSwipeActions = (dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity 
        style={[styles.deleteButton, { backgroundColor: colors.error }]}
        onPress={() => deleteHabit(habit.id)}
      >
        <Animated.Text
          style={[styles.deleteButtonText, { transform: [{ scale }] }]}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <Swipeable
      renderRightActions={(progress, dragX) => rightSwipeActions(dragX)}
    >
      <View 
        style={[
          styles.card, 
          { 
            backgroundColor: colors.card,
            borderLeftColor: habit.color,
          }
        ]}
      >
        <View style={styles.cardContent}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: habit.color + '20' }
            ]}
          >
            <HabitIcon size={24} color={habit.color} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.habitName, { color: colors.text }]}>
              {habit.name}
            </Text>
            <Text style={[styles.streak, { color: colors.secondaryText }]}>
              {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak today'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.checkButton,
              { 
                backgroundColor: habit.completedToday ? habit.color : 'transparent',
                borderColor: habit.color,
              }
            ]}
            onPress={() => onToggle(habit.id, !habit.completedToday)}
          >
            {habit.completedToday && (
              <Check size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  habitName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  streak: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    padding: 10,
  },
});