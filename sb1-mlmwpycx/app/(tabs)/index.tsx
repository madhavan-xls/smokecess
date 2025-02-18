import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../../src/utils/storage';

export default function HomeScreen() {
  const [savings, setSavings] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const savedStartDate = await storage.getItem('startDate');
    const cigarettesPerDay = await storage.getItem('cigarettesPerDay');
    const pricePerPack = await storage.getItem('pricePerPack');

    if (savedStartDate) {
      const start = new Date(savedStartDate);
      setStartDate(start);
      
      // Calculate current week (1-12)
      const diffTime = Math.abs(new Date().getTime() - start.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      setCurrentWeek(Math.min(diffWeeks, 12));

      // Calculate savings
      if (cigarettesPerDay && pricePerPack) {
        const cigarettesPerPack = 20;
        const dailyCost = (Number(cigarettesPerDay) / cigarettesPerPack) * Number(pricePerPack);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setSavings(dailyCost * diffDays);
      }
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Quit Smoking Journey</Text>
        <Text style={styles.subtitle}>Week {currentWeek} of 12</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Money Saved</Text>
        <Text style={styles.savingsAmount}>${savings.toFixed(2)}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Progress</Text>
        <View style={styles.weekGrid}>
          {Array.from({ length: 12 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.weekBox,
                i + 1 <= currentWeek && styles.weekBoxActive
              ]}
            >
              <Text style={[
                styles.weekNumber,
                i + 1 <= currentWeek && styles.weekNumberActive
              ]}>
                {i + 1}
              </Text>
            </View>
          ))}
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
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
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
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekBox: {
    width: 50,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekBoxActive: {
    backgroundColor: '#4CAF50',
  },
  weekNumber: {
    fontSize: 16,
    color: '#666',
  },
  weekNumberActive: {
    color: '#fff',
  },
});