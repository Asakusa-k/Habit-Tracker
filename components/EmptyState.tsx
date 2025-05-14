import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, buttonText, buttonLink }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <PlusCircle size={60} color={colors.secondaryText} style={styles.icon} />
      
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: colors.secondaryText }]}>
        {message}
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push(buttonLink)}
      >
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});