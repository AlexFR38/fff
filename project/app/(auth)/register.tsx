import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { signUp, ActivityLevel } from '../../lib/auth';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'homme' | 'femme' | ''>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !age || !gender || !height || !weight || !targetWeight) {
      setError('Veuillez remplir tous les champs');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (parseInt(age) < 18 || parseInt(age) > 100) {
      setError('L\'âge doit être compris entre 18 et 100 ans');
      return false;
    }

    if (parseInt(height) < 100 || parseInt(height) > 250) {
      setError('La taille doit être comprise entre 100 et 250 cm');
      return false;
    }

    if (parseInt(weight) < 30 || parseInt(weight) > 300) {
      setError('Le poids doit être compris entre 30 et 300 kg');
      return false;
    }

    if (parseInt(targetWeight) < 30 || parseInt(targetWeight) > 300) {
      setError('Le poids cible doit être compris entre 30 et 300 kg');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await signUp(email, password, {
        age: parseInt(age),
        gender,
        height: parseInt(height),
        weight: parseInt(weight),
        targetWeight: parseInt(targetWeight),
        activityLevel,
      });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Commencez votre parcours vers une vie plus saine
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Âge"
            value={age}
            onChangeText={(text) => {
              setAge(text.replace(/[^0-9]/g, ''));
              setError(null);
            }}
            keyboardType="numeric"
            editable={!loading}
          />

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'homme' && styles.genderButtonActive,
              ]}
              onPress={() => {
                setGender('homme');
                setError(null);
              }}
              disabled={loading}>
              <Text
                style={[
                  styles.genderText,
                  gender === 'homme' && styles.genderTextActive,
                ]}>
                Homme
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'femme' && styles.genderButtonActive,
              ]}
              onPress={() => {
                setGender('femme');
                setError(null);
              }}
              disabled={loading}>
              <Text
                style={[
                  styles.genderText,
                  gender === 'femme' && styles.genderTextActive,
                ]}>
                Femme
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Taille (cm)"
            value={height}
            onChangeText={(text) => {
              setHeight(text.replace(/[^0-9]/g, ''));
              setError(null);
            }}
            keyboardType="numeric"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Poids actuel (kg)"
            value={weight}
            onChangeText={(text) => {
              setWeight(text.replace(/[^0-9]/g, ''));
              setError(null);
            }}
            keyboardType="numeric"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Poids cible (kg)"
            value={targetWeight}
            onChangeText={(text) => {
              setTargetWeight(text.replace(/[^0-9]/g, ''));
              setError(null);
            }}
            keyboardType="numeric"
            editable={!loading}
          />

          <View style={styles.activityContainer}>
            <Text style={styles.activityTitle}>Niveau d'activité</Text>
            <TouchableOpacity
              style={[
                styles.activityButton,
                activityLevel === 'sedentary' && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel('sedentary')}
              disabled={loading}>
              <Text
                style={[
                  styles.activityText,
                  activityLevel === 'sedentary' && styles.activityTextActive,
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
                activityLevel === 'moderate' && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel('moderate')}
              disabled={loading}>
              <Text
                style={[
                  styles.activityText,
                  activityLevel === 'moderate' && styles.activityTextActive,
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
                activityLevel === 'active' && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel('active')}
              disabled={loading}>
              <Text
                style={[
                  styles.activityText,
                  activityLevel === 'active' && styles.activityTextActive,
                ]}>
                Actif
              </Text>
              <Text style={styles.activityDescription}>
                Exercice intense 6-7 fois par semaine
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity style={styles.loginLink} disabled={loading}>
            <Text style={styles.loginText}>
              Déjà un compte ? Se connecter
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 60 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 15,
    marginBottom: 30,
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
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
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
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#3498db',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
});