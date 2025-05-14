import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Brain, Radiation as Meditation, Droplets, Wind, BookOpen, Heart, Sun, Dumbbell, Apple, Utensils, Clock, MoveHorizontal, Moon, PenTool, Milestone } from 'lucide-react-native';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

const ICONS = [
  { name: 'brain-circuit', component: Brain },
  { name: 'meditation', component: Meditation },
  { name: 'water', component: Droplets },
  { name: 'breathing', component: Wind },
  { name: 'reading', component: BookOpen },
  { name: 'gratitude', component: Heart },
  { name: 'morning-routine', component: Sun },
  { name: 'exercise', component: Dumbbell },
  { name: 'nutrition', component: Apple },
  { name: 'healthy-eating', component: Utensils },
  { name: 'time-tracking', component: Clock },
  { name: 'stretching', component: MoveHorizontal },
  { name: 'sleep', component: Moon },
  { name: 'journaling', component: PenTool },
  { name: 'goal', component: Milestone },
];

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelectIcon }) => {
  const { colors } = useTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {ICONS.map((icon) => {
        const Icon = icon.component;
        const isSelected = selectedIcon === icon.name;
        
        return (
          <TouchableOpacity
            key={icon.name}
            style={[
              styles.iconButton,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              }
            ]}
            onPress={() => onSelectIcon(icon.name)}
          >
            <Icon 
              size={24} 
              color={isSelected ? colors.white : colors.text}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
});