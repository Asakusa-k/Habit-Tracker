import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- Add this import
import { useTheme } from '@/context/ThemeContext';
import { useHabits } from '@/context/HabitsContext';
import { IconPicker } from '@/components/IconPicker';
import { ColorPicker } from '@/components/ColorPicker';
import { router } from 'expo-router';
import { HabitCategory } from '@/types/habit';
import { useDispatch } from 'react-redux';
import { addHabit } from '@/store/habitsSlice';
import type { AppDispatch } from '@/store'; // <-- Import AppDispatch type

export default function AddHabitScreen() {
  // const { addHabit, habits } = useHabits();
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>(); // <-- Type the dispatch
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('mindfulness');
  const [icon, setIcon] = useState('brain-circuit');
  const [color, setColor] = useState('#5FBDB0');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Helper to convert "HH:mm" to Date
  const getTimeAsDate = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hour);
    now.setMinutes(minute);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  // Helper to convert Date to "HH:mm"
  const getTimeString = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleReminderSwitch = (value: boolean) => {
    setReminderEnabled(value);
    if (value) setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(getTimeString(selectedDate));
    }
  };

  const handleSave = () => {
    if (name.trim() === '') return;
    dispatch(addHabit({  name,
      category,
      icon,
      color,
      reminderEnabled,
      reminderTime,
    }));
   
    resetStates();
    router.navigate('/home');
  };

  const resetStates = () => {
    setName('');
    setCategory('mindfulness');
    setIcon('brain-circuit');
    setColor('#5FBDB0');
    setReminderEnabled(false);
    setReminderTime('09:00');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Habit Name</Text>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border
            }
          ]}
          placeholder="What mindful habit do you want to track?"
          placeholderTextColor={colors.placeholderText}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {['mindfulness', 'exercise', 'nutrition', 'productivity', 'sleep'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                { 
                  backgroundColor: category === cat ? colors.primary : colors.card,
                }
              ]}
              onPress={() => setCategory(cat as HabitCategory)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  { color: category === cat ? colors.white : colors.text }
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
        <IconPicker 
          selectedIcon={icon}
          onSelectIcon={setIcon}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Color</Text>
        <ColorPicker 
          selectedColor={color}
          onSelectColor={setColor}
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.reminderHeader}>
          <Text style={[styles.label, { color: colors.text }]}>Daily Reminder</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={handleReminderSwitch}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </View>
        {reminderEnabled && (
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>
              Reminder Time: {reminderTime}
            </Text>
          </TouchableOpacity>
        )}
        {showTimePicker && (
          <DateTimePicker
            value={getTimeAsDate(reminderTime)}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
        disabled={name.trim() === ''}
      >
        <Text style={styles.saveButtonText}>Create Habit</Text>
      </TouchableOpacity>
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});