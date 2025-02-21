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
import { updateUserProfile, UserProfile, ActivityLevel } from '../lib/auth';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
};

export default function EditProfileModal({
  visible,
  onClose,
  currentProfile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile(profile);
      onProfileUpdated(profile);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la mise à jour');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!profile.age || profile.age < 18 || profile.age > 100) {
      setError('L\'âge doit être compris entre 18 et 100 ans');
      return false;
    }

    if (!profile.height || profile.height < 100 || profile.height > 250) {
      setError('La taille doit être comprise entre 100 et 250 cm');
      return false;
    }

    if (!profile.weight || profile.weight < 30 || profile.weight > 300) {
      setError('Le poids doit être compris entre 30 et 300 kg');
      return false;
    }

    if (!profile.targetWeight || profile.targetWeight < 30 || profile.targetWeight > 300) {
      setError('Le poids cible doit être compris entre 30 et 300 kg');
      return false;
    }

    return true;
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
            <Text style={styles.title}>Modifier le profil</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Âge</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.age.toString()}
                onChangeText={(text) => {
                  const age = parseInt(text) || 0;
                  setProfile((prev) => ({ ...prev, age }));
                  setError(null);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Genre</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    profile.gender === 'homme' && styles.genderButtonActive,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, gender: 'homme' }))}>
                  <Text
                    style={[
                      styles.genderText,
                      profile.gender === 'homme' && styles.genderTextActive,
                    ]}>
                    Homme
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    profile.gender === 'femme' && styles.genderButtonActive,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, gender: 'femme' }))}>
                  <Text
                    style={[
                      styles.genderText,
                      profile.gender === 'femme' && styles.genderTextActive,
                    ]}>
                    Femme
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.height.toString()}
                onChangeText={(text) => {
                  const height = parseInt(text) || 0;
                  setProfile((prev) => ({ ...prev, height }));
                  setError(null);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Poids actuel (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.weight.toString()}
                onChangeText={(text) => {
                  const weight = parseInt(text) || 0;
                  setProfile((prev) => ({ ...prev, weight }));
                  setError(null);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Poids cible (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={profile.targetWeight.toString()}
                onChangeText={(text) => {
                  const targetWeight = parseInt(text) || 0;
                  setProfile((prev) => ({ ...prev, targetWeight }));
                  setError(null);
                }}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Niveau d'activité</Text>
              <View style={styles.activityContainer}>
                <TouchableOpacity
                  style={[
                    styles.activityButton,
                    profile.activityLevel === 'sedentary' && styles.activityButtonActive,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, activityLevel: 'sedentary' }))}>
                  <Text
                    style={[
                      styles.activityText,
                      profile.activityLevel === 'sedentary' && styles.activityTextActive,
                    ]}>
                    Sédentaire
                  </Text>
                  <Text style={styles.activityDescription}>
                    Peu ou pas d'exercice
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.activityButton,
                    profile.activityLevel === 'moderate' && styles.activityButtonActive,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, activityLevel: 'moderate' }))}>
                  <Text
                    style={[
                      styles.activityText,
                      profile.activityLevel === 'moderate' && styles.activityTextActive,
                    ]}>
                    Modéré
                  </Text>
                  <Text style={styles.activityDescription}>
                    Exercice 3-5 fois par semaine
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.activityButton,
                    profile.activityLevel === 'active' && styles.activityButtonActive,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, activityLevel: 'active' }))}>
                  <Text
                    style={[
                      styles.activityText,
                      profile.activityLevel === 'active' && styles.activityTextActive,
                    ]}>
                    Actif
                  </Text>
                  <Text style={styles.activityDescription}>
                    Exercice intense 6-7 fois par semaine
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
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
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  genderButtonActive: {
    backgroundColor: '#3498db',
  },
  genderText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  genderTextActive: {
    color: 'white',
  },
  activityContainer: {
    gap: 10,
  },
  activityButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activityButtonActive: {
    backgroundColor: '#3498db',
  },
  activityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityTextActive: {
    color: 'white',
  },
  activityDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});