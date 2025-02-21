import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [waterIntake, setWaterIntake] = useState(0);
  const waterGoal = 2000; // ml

  // Exemple de données pour le graphique
  const data = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        data: [2100, 1950, 2300, 2000, 1800, 2200, 2150],
      },
    ],
  };

  const badges = [
    {
      id: 1,
      name: 'Premier pas',
      description: 'Première journée de suivi complétée',
      icon: 'footsteps',
      achieved: true,
    },
    {
      id: 2,
      name: 'Hydratation parfaite',
      description: 'Objectif d\'eau atteint 7 jours de suite',
      icon: 'water',
      achieved: false,
    },
    {
      id: 3,
      name: 'Équilibre nutritionnel',
      description: 'Macronutriments équilibrés pendant 5 jours',
      icon: 'nutrition',
      achieved: true,
    },
  ];

  const renderChart = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webChartPlaceholder}>
          <Text style={styles.webChartText}>Graphique des calories hebdomadaires</Text>
          {data.datasets[0].data.map((value, index) => (
            <View key={index} style={styles.webChartRow}>
              <Text style={styles.webChartLabel}>{data.labels[index]}</Text>
              <Text style={styles.webChartValue}>{value} cal</Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    );
  };

  const addWater = (amount: number) => {
    setWaterIntake((prev) => Math.min(prev + amount, waterGoal));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bilan d'aujourd'hui</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>1850</Text>
            <Text style={styles.statLabel}>Calories consommées</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>2000</Text>
            <Text style={styles.statLabel}>Objectif quotidien</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>350</Text>
            <Text style={styles.statLabel}>Calories brûlées</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Hydratation</Text>
          <Text style={styles.waterProgress}>
            {waterIntake}ml / {waterGoal}ml
          </Text>
        </View>
        
        <View style={styles.waterContainer}>
          <View style={styles.waterProgress}>
            <View 
              style={[
                styles.waterFill, 
                { width: `${(waterIntake / waterGoal) * 100}%` }
              ]} 
            />
          </View>
          
          <View style={styles.waterButtons}>
            <TouchableOpacity
              style={styles.waterButton}
              onPress={() => addWater(250)}>
              <Ionicons name="water" size={24} color="#3498db" />
              <Text style={styles.waterButtonText}>250ml</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.waterButton}
              onPress={() => addWater(500)}>
              <Ionicons name="water" size={24} color="#3498db" />
              <Text style={styles.waterButtonText}>500ml</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Évolution hebdomadaire</Text>
        {renderChart()}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Badges</Text>
        <View style={styles.badgesContainer}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <View style={[styles.badgeIcon, !badge.achieved && styles.badgeIconLocked]}>
                <Ionicons
                  name={badge.icon as any}
                  size={24}
                  color={badge.achieved ? '#3498db' : '#95a5a6'}
                />
              </View>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conseils du jour</Text>
        <Text style={styles.advice}>
          Vous êtes sur la bonne voie ! Continuez à maintenir un déficit calorique modéré pour atteindre vos objectifs de poids sainement.
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
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  waterContainer: {
    marginTop: 10,
  },
  waterProgress: {
    height: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  waterFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  waterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf7fd',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  waterButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
  badgesContainer: {
    gap: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#edf7fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIconLocked: {
    backgroundColor: '#f0f0f0',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  badgeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  advice: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  webChartPlaceholder: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  webChartText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3498db',
    marginBottom: 12,
    textAlign: 'center',
  },
  webChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  webChartLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  webChartValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
  },
});