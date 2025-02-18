import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';

const healthBenefits = [
  {
    time: '20 minutes',
    benefit: 'Your heart rate and blood pressure drop',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
  },
  {
    time: '12 hours',
    benefit: 'Carbon monoxide level in your blood drops to normal',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400',
  },
  {
    time: '2-12 weeks',
    benefit: 'Your circulation improves and your lung function increases',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
  },
  {
    time: '1-9 months',
    benefit: 'Coughing and shortness of breath decrease',
    image: 'https://images.unsplash.com/photo-1518611507436-f9221403cca2?auto=format&fit=crop&q=80&w=400',
  },
  {
    time: '1 year',
    benefit: 'Your risk of coronary heart disease is about half that of a smoker',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
  },
  {
    time: '5 years',
    benefit: 'Stroke risk is reduced to that of a nonsmoker',
    image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?auto=format&fit=crop&q=80&w=400',
  },
];

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Benefits Timeline</Text>
        <Text style={styles.subtitle}>
          See how your body recovers after quitting
        </Text>
      </View>

      {healthBenefits.map((benefit, index) => (
        <View key={index} style={styles.card}>
          <Image
            source={{ uri: benefit.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.timeframe}>{benefit.time}</Text>
            <Text style={styles.benefit}>{benefit.benefit}</Text>
          </View>
        </View>
      ))}
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
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  timeframe: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  benefit: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});