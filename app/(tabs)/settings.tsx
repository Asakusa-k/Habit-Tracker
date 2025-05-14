import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useHabits } from '@/context/HabitsContext';
import { Moon, Sun, Info, Heart, Github, Mail } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const { clearAllHabits } = useHabits();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all habits and progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'Clear All', 
          onPress: () => clearAllHabits(),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Appearance
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            {theme === 'dark' ? (
              <Moon size={20} color={colors.text} style={styles.settingIcon} />
            ) : (
              <Sun size={20} color={colors.text} style={styles.settingIcon} />
            )}
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Data
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.settingButton} onPress={handleClearData}>
          <Text style={[styles.settingButtonText, { color: colors.error }]}>
            Clear All Data
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        About
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Info size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Version
            </Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.secondaryText }]}>
            1.0.0
          </Text>
        </View>
        
        <TouchableOpacity style={[styles.settingRow, styles.borderTop]}>
          <View style={styles.settingLabelContainer}>
            <Heart size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Rate the App
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingRow, styles.borderTop]}>
          <View style={styles.settingLabelContainer}>
            <Github size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Source Code
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingRow, styles.borderTop]}>
          <View style={styles.settingLabelContainer}>
            <Mail size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Send Feedback
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.versionText, { color: colors.secondaryText }]}>
        Daily Zen - Your mindful habit tracker
      </Text>
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
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  settingButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  settingButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
});