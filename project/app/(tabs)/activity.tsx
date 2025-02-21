import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Activity = {
  id: string;
  type: string;
  duration: number;
  calories: number;
  time: string;
};

export default function ActivityScreen() {
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'Marche',
      duration: 45,
      calories: 180,
      time: '09:30',
    },
    {
      id: '2',
      type: 'Vélo',
      duration: 30,
      calories: 250,
      time: '16:00',
    },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activités d'aujourd'hui</Text>
        <TouchableOpacity 
          style={styles.addButton}
          role="button"
          onPress={() => {
            // TODO: Implement add activity functionality
          }}>
          <Ionicons name="add-circle" size={24} color="#3498db" />
          <Text style={styles.addButtonText}>Ajouter une activité</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>430</Text>
          <Text style={styles.statLabel}>Calories brûlées</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>75</Text>
          <Text style={styles.statLabel}>Minutes d'activité</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>2/3</Text>
          <Text style={styles.statLabel}>Objectif quotidien</Text>
        </View>
      </View>

      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityTypeContainer}>
              <Ionicons name="fitness" size={24} color="#3498db" />
              <Text style={styles.activityType}>{activity.type}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>

          <View style={styles.activityContent}>
            <View style={styles.activityDetail}>
              <Ionicons name="time-outline" size={20} color="#7f8c8d" />
              <Text style={styles.activityDetailText}>
                {activity.duration} minutes
              </Text>
            </View>
            <View style={styles.activityDetail}>
              <Ionicons name="flame-outline" size={20} color="#7f8c8d" />
              <Text style={styles.activityDetailText}>
                {activity.calories} calories
              </Text>
            </View>
          </View>

          <TouchableOpacity
            role="button"
            style={styles.deleteButton}
            onPress={() => {
              // TODO: Implement delete functionality
            }}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  activityTime: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activityContent: {
    marginBottom: 15,
  },
  activityDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activityDetailText: {
    fontSize: 16,
    color: '#34495e',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 14,
  },
});