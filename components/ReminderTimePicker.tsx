import React, { useState } from 'react';
import { View, StyleSheet, Platform, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';

interface ReminderTimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export const ReminderTimePicker: React.FC<ReminderTimePickerProps> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const [hours, minutes] = value.split(':').map(Number);

  // Create a date object from the hours and minutes
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  const handleChange = (newDate: Date) => {
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    onChange(`${hours}:${minutes}`);
  };

  // For Web, we use a simple text input
  if (Platform.OS === 'web') {
    return (
      <TextInput
        style={[
          styles.timeInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          }
        ]}
        value={value}
        onChangeText={onChange}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
      />
    );
  }

  // For Native platforms, we would use DateTimePicker
  // But since we're focused on web, we'll use a simplified version
  return (
    <View 
      style={[
        styles.timeContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
    >
      <TextInput
        style={[styles.timeText, { color: colors.text }]}
        value={format(date, 'hh:mm a')}
        editable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  timeInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  timeContainer: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});