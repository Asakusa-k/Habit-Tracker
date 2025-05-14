import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const COLORS = [
  '#5FBDB0', // Teal
  '#B0A3D4', // Lavender
  '#F98B7F', // Coral
  '#7FB069', // Green
  '#F7B267', // Orange
  '#3D84A8', // Blue
  '#E07A5F', // Rose
  '#6D6875', // Purple-Gray
  '#E5989B', // Pink
  '#5D576B', // Dark Purple
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {COLORS.map((color) => {
        const isSelected = selectedColor === color;
        
        return (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color }
            ]}
            onPress={() => onSelectColor(color)}
          >
            {isSelected && (
              <Check size={20} color="#FFFFFF" />
            )}
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
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});