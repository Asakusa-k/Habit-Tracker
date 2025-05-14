import React from 'react';
import { Brain, Radiation as Meditation, Droplets, Wind, BookOpen, Heart, Sun, Dumbbell, Apple, Utensils, Clock, MoveHorizontal, Moon, PenTool, Milestone, Bone as Icon } from 'lucide-react-native';

type IconMapping = {
  [key: string]: typeof Icon;
};

// Map string names to Lucide icon components
const iconMap: IconMapping = {
  'brain-circuit': Brain,
  'meditation': Meditation,
  'water': Droplets,
  'breathing': Wind,
  'reading': BookOpen,
  'gratitude': Heart,
  'morning-routine': Sun,
  'exercise': Dumbbell,
  'nutrition': Apple,
  'healthy-eating': Utensils,
  'time-tracking': Clock,
  'stretching': MoveHorizontal,
  'sleep': Moon,
  'journaling': PenTool,
  'goal': Milestone,
};

// Get a dynamic icon component based on string name
export const getDynamicIcon = (iconName: string): typeof Icon => {
  return iconMap[iconName] || Brain; // Default to Brain if icon not found
};