import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { storage } from '../../src/utils/storage';

export default function SettingsScreen() {
  const [cigarettesPerDay, setCigarettesPerDay] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [sleepTime, setSleepTime] = useState('22:00');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedCigarettes = await storage.getItem('cigarettesPerDay');
    const savedPrice = await storage.getItem('pricePerPack');
    const savedWakeTime = await storage.getItem('wakeTime');
    const savedSleepTime = await storage.getItem('sleepTime');

    if (savedCigarettes) setCigarettesPerDay(savedCigarettes);
    if (savedPrice) setPricePerPack(savedPrice);
    if (savedWakeTime) setWakeTime(savedWakeTime);
    if (savedSleepTime) setSleepTime(savedSleepTime);
  }

  async function saveSettings(key: string, value: string) {
    await storage.setItem(key, value);
  }

  function calculateGumDosage(cigarettes: number): string {
    if (cigarettes < 7) {
      return 'Half of 2mg gum';
    } else if (cigarettes <= 20) {
      return '1x 2mg gum';
    } else {
      return '1x 4mg gum';
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Smoking Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cigarettes per day</Text>
          <TextInput
            style={styles.input}
            value={cigarettesPerDay}
            onChangeText={(text) => {
              setCigarettesPerDay(text);
              saveSettings('cigarettesPerDay', text);
            }}
            keyboardType="numeric"
            placeholder="Enter number"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price per pack ($)</Text>
          <TextInput
            style={styles.input}
            value={pricePerPack}
            onChangeText={(text) => {
              setPricePerPack(text);
              saveSettings('pricePerPack', text);
            }}
            keyboardType="numeric"
            placeholder="Enter price"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminder Schedule</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Wake-up time</Text>
          <TextInput
            style={styles.input}
            value={wakeTime}
            onChangeText={(text) => {
              setWakeTime(text);
              saveSettings('wakeTime', text);
            }}
            placeholder="HH:MM"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sleep time</Text>
          <TextInput
            style={styles.input}
            value={sleepTime}
            onChangeText={(text) => {
              setSleepTime(text);
              saveSettings('sleepTime', text);
            }}
            placeholder="HH:MM"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Nicotine Gum Dosage</Text>
        <Text style={styles.dosageText}>
          {calculateGumDosage(Number(cigarettesPerDay))}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dosageText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});