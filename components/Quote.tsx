import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const QUOTES = [
  {
    text: "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh"
  },
  {
    text: "Mindfulness isn't difficult. We just need to remember to do it.",
    author: "Sharon Salzberg"
  },
  {
    text: "The best way to capture moments is to pay attention. This is how we cultivate mindfulness.",
    author: "Jon Kabat-Zinn"
  },
  {
    text: "Drink your tea slowly and reverently, as if it is the axis on which the world earth revolves.",
    author: "Thich Nhat Hanh"
  },
  {
    text: "Be where you are, otherwise you will miss your life.",
    author: "Buddha"
  },
  {
    text: "The little things? The little moments? They aren't little.",
    author: "Jon Kabat-Zinn"
  },
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle"
  },
  {
    text: "You can't stop the waves, but you can learn to surf.",
    author: "Jon Kabat-Zinn"
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha"
  }
];

export const Quote: React.FC = () => {
  const { colors } = useTheme();
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Get a random quote based on the day
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % QUOTES.length;
    
    setQuote(QUOTES[quoteIndex]);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.quoteText, { color: colors.text }]}>
        "{quote.text}"
      </Text>
      <Text style={[styles.author, { color: colors.secondaryText }]}>
        — {quote.author}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  quoteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  author: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
});