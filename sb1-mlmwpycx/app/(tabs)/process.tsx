import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../../src/utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ProcessScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [nextAlarm, setNextAlarm] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [intervalHours, setIntervalHours] = useState(2);

  useEffect(() => {
    loadSettings();
    setupNotifications();
  }, []);

  async function loadSettings() {
    const startDate = await storage.getItem('startDate');
    if (startDate) {
      const start = new Date(startDate);
      const diffTime = Math.abs(new Date().getTime() - start.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      const week = Math.min(diffWeeks, 12);
      setCurrentWeek(week);
      
      // Calculate interval based on current week (2 hours + 0.5 hour per week)
      const baseInterval = 2;
      const additionalHours = (week - 1) * 0.5;
      setIntervalHours(baseInterval + additionalHours);
    }

    const enabled = await storage.getItem('alarmsEnabled');
    setIsEnabled(enabled === 'true');
  }

  async function setupNotifications() {
    if (Platform.OS === 'web') {
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    }
  }

  async function toggleAlarms() {
    const newState = !isEnabled;
    setIsEnabled(newState);
    await storage.setItem('alarmsEnabled', String(newState));

    if (newState) {
      scheduleNextAlarm();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNextAlarm(null);
    }
  }

  async function scheduleNextAlarm() {
    if (Platform.OS === 'web') {
      return;
    }

    const wakeTime = await storage.getItem('wakeTime') || '06:00';
    const sleepTime = await storage.getItem('sleepTime') || '22:00';

    const now = new Date();
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    const [sleepHours, sleepMinutes] = sleepTime.split(':').map(Number);

    let nextTime = new Date(now);
    nextTime.setHours(wakeHours, wakeMinutes, 0, 0);

    while (nextTime <= now) {
      nextTime.setTime(nextTime.getTime() + intervalHours * 60 * 60 * 1000);
    }

    // Check if next time is after sleep time
    const sleepDateTime = new Date(now);
    sleepDateTime.setHours(sleepHours, sleepMinutes, 0, 0);

    if (nextTime > sleepDateTime) {
      nextTime = new Date(now);
      nextTime.setDate(nextTime.getDate() + 1);
      nextTime.setHours(wakeHours, wakeMinutes, 0, 0);
    }

    setNextAlarm(nextTime);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for Nicotine Gum',
        body: 'Take your nicotine gum now and hold for 10 seconds',
        sound: true,
      },
      trigger: {
        date: nextTime,
      },
    });
  }

  function formatTime(date: Date | null) {
    if (!date) return 'Not scheduled';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Gum Reminder Process</Text>
        <Text style={styles.subtitle}>Week {currentWeek} of 12</Text>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Gum Reminders</Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleAlarms}
            trackColor={{ false: '#767577', true: '#81c784' }}
            thumbColor={isEnabled ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Current Interval:</Text>
          <Text style={styles.infoValue}>{intervalHours} hours</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Next Reminder:</Text>
          <Text style={styles.infoValue}>{formatTime(nextAlarm)}</Text>
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.webNotice}>
            Note: Notifications are not available in web browsers. Please use the mobile app for reminders.
          </Text>
        )}
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>How to Use Nicotine Gum</Text>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Place the gum in your mouth and chew slowly until you feel a tingling sensation</Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Park the gum between your cheek and gum for 10 seconds</Text>
        </View>
        <View style={styles.instructionStep}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Repeat the process for 30 minutes, then discard the gum</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  webNotice: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff9c4',
    borderRadius: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  instructionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
});