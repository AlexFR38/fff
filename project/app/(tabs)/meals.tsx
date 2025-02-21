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
import AddFoodModal from '../../components/AddFoodModal';

type Meal = {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  calories: number;
  items: Array<{
    name: string;
    quantity: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }>;
};

export default function MealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      type: 'breakfast',
      time: '08:00',
      calories: 450,
      items: [
        {
          name: 'Oeufs brouillés',
          quantity: 100,
          calories: 155,
          proteins: 13,
          carbs: 1,
          fats: 11,
        },
        {
          name: 'Pain complet',
          quantity: 50,
          calories: 115,
          proteins: 4,
          carbs: 20,
          fats: 2,
        },
      ],
    },
    {
      id: '2',
      type: 'lunch',
      time: '12:30',
      calories: 650,
      items: [
        {
          name: 'Salade de quinoa',
          quantity: 200,
          calories: 246,
          proteins: 9,
          carbs: 40,
          fats: 8,
        },
        {
          name: 'Poulet grillé',
          quantity: 150,
          calories: 250,
          proteins: 31,
          carbs: 0,
          fats: 14,
        },
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<Meal['type'] | null>(
    null
  );

  const getMealIcon = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast':
        return 'cafe';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'moon';
      case 'snack':
        return 'nutrition';
      default:
        return 'restaurant';
    }
  };

  const getMealTitle = (type: Meal['type']) => {
    switch (type) {
      case 'breakfast':
        return 'Petit-déjeuner';
      case 'lunch':
        return 'Déjeuner';
      case 'dinner':
        return 'Dîner';
      case 'snack':
        return 'Collation';
      default:
        return '';
    }
  };

  const handleAddFood = (food: {
    name: string;
    quantity: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }) => {
    if (!selectedMealType) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setMeals((prevMeals) => {
      const existingMeal = prevMeals.find(
        (meal) => meal.type === selectedMealType
      );

      if (existingMeal) {
        return prevMeals.map((meal) =>
          meal.id === existingMeal.id
            ? {
                ...meal,
                calories: meal.calories + food.calories,
                items: [...meal.items, food],
              }
            : meal
        );
      }

      return [
        ...prevMeals,
        {
          id: Date.now().toString(),
          type: selectedMealType,
          time,
          calories: food.calories,
          items: [food],
        },
      ];
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Repas d'aujourd'hui</Text>
      </View>

      <View style={styles.mealTypes}>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.mealTypeButton}
            onPress={() => {
              setSelectedMealType(type);
              setShowAddModal(true);
            }}>
            <Ionicons
              name={getMealIcon(type)}
              size={24}
              color="#3498db"
            />
            <Text style={styles.mealTypeText}>{getMealTitle(type)}</Text>
            <Ionicons name="add" size={24} color="#3498db" />
          </TouchableOpacity>
        ))}
      </View>

      {meals.map((meal) => (
        <View key={meal.id} style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTypeContainer}>
              <Ionicons
                name={getMealIcon(meal.type)}
                size={24}
                color="#3498db"
              />
              <Text style={styles.mealType}>{getMealTitle(meal.type)}</Text>
            </View>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>

          <View style={styles.mealContent}>
            {meal.items.map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodItemHeader}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <Text style={styles.foodItemQuantity}>
                    {item.quantity}g
                  </Text>
                </View>
                <View style={styles.foodItemNutrients}>
                  <Text style={styles.nutrientText}>
                    {item.calories} calories
                  </Text>
                  <Text style={styles.nutrientText}>
                    {item.proteins}g protéines
                  </Text>
                  <Text style={styles.nutrientText}>
                    {item.carbs}g glucides
                  </Text>
                  <Text style={styles.nutrientText}>
                    {item.fats}g lipides
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.mealFooter}>
            <Text style={styles.calories}>{meal.calories} calories</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSelectedMealType(meal.type);
                setShowAddModal(true);
              }}>
              <Text style={styles.editButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <AddFoodModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedMealType(null);
        }}
        onAddFood={handleAddFood}
      />
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
  mealTypes: {
    padding: 10,
    gap: 10,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mealTypeText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mealTime: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  mealContent: {
    marginBottom: 15,
  },
  foodItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  foodItemQuantity: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  foodItemNutrients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nutrientText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  editButtonText: {
    color: '#2c3e50',
    fontSize: 14,
  },
});