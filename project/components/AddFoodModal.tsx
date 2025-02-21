import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchLocalFoods, FoodItem } from '../lib/foodDatabase';

type AddFoodModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem & { quantity: number }) => void;
};

export default function AddFoodModal({
  visible,
  onClose,
  onAddFood,
}: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un aliment à rechercher');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Simuler un délai de recherche pour une meilleure UX
      await new Promise(resolve => setTimeout(resolve, 300));
      const searchResults = searchLocalFoods(searchQuery);
      
      if (searchResults.length === 0) {
        setError('Aucun aliment trouvé. Essayez avec un autre terme.');
      }
      
      setResults(searchResults);
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setError(null);
  };

  const handleAddFood = () => {
    if (!selectedFood) {
      setError('Veuillez sélectionner un aliment');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Veuillez entrer une quantité valide');
      return;
    }

    const factor = quantityNum / 100;
    onAddFood({
      ...selectedFood,
      quantity: quantityNum,
      calories: Math.round(selectedFood.calories * factor),
      proteins: Math.round(selectedFood.proteins * factor * 10) / 10,
      carbs: Math.round(selectedFood.carbs * factor * 10) / 10,
      fats: Math.round(selectedFood.fats * factor * 10) / 10,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un aliment</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un aliment..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setError(null);
                }}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Recherche en cours...</Text>
              </View>
            ) : (
              <ScrollView style={styles.resultsList}>
                {results.map((food, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.foodItem,
                      selectedFood?.name === food.name && styles.foodItemSelected,
                    ]}
                    onPress={() => handleSelectFood(food)}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodInfo}>
                      {food.calories} cal • {food.proteins}g prot • {food.carbs}g
                      glucides • {food.fats}g lipides
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {selectedFood && (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantité (g):</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text);
                    setError(null);
                  }}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddFood}>
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    padding: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  resultsList: {
    flex: 1,
    marginTop: 20,
  },
  foodItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  foodItemSelected: {
    backgroundColor: '#ebf5fb',
    borderColor: '#3498db',
    borderWidth: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  foodInfo: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
    marginTop: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});