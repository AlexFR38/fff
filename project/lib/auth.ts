import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { saveProfileLocally, getLocalProfile, defaultProfile } from './localDatabase';

export type ActivityLevel = 'sedentary' | 'moderate' | 'active';

export interface UserProfile {
  email: string;
  age: number;
  gender: 'homme' | 'femme';
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
  dailyCalorieGoal?: number;
  waterGoal?: number;
}

export const calculateDailyCalories = (profile: UserProfile): number => {
  let bmr = 0;
  
  if (profile.gender === 'homme') {
    bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  }

  const activityFactors = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.725,
  };

  const tdee = bmr * activityFactors[profile.activityLevel];
  
  return Math.round(profile.targetWeight < profile.weight ? tdee - 500 : tdee);
};

export const calculateWaterGoal = (weight: number, activityLevel: ActivityLevel): number => {
  let waterGoal = weight * 30;
  
  switch (activityLevel) {
    case 'active':
      waterGoal *= 1.3;
      break;
    case 'moderate':
      waterGoal *= 1.2;
      break;
  }
  
  return Math.round(waterGoal);
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // Essayer d'abord de récupérer le profil local
    const localProfile = await getLocalProfile();
    if (localProfile) {
      return localProfile;
    }

    // Si pas de profil local, essayer Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      await saveProfileLocally(profile);
      return profile;
    }
    
    // Si aucun profil n'est disponible, utiliser le profil par défaut
    return defaultProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return defaultProfile;
  }
};

export const updateUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    if (!auth.currentUser) throw new Error('Utilisateur non connecté');

    const dailyCalorieGoal = calculateDailyCalories(profile);
    const waterGoal = calculateWaterGoal(profile.weight, profile.activityLevel);
    const updatedProfile = { ...profile, dailyCalorieGoal, waterGoal };

    // Sauvegarder d'abord localement
    await saveProfileLocally(updatedProfile);

    // Puis essayer de sauvegarder dans Firestore
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), updatedProfile);
    } catch (firebaseError) {
      console.error('Error updating Firebase profile:', firebaseError);
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  profile: Omit<UserProfile, 'email'>
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    const dailyCalorieGoal = calculateDailyCalories({ ...profile, email });
    const waterGoal = calculateWaterGoal(profile.weight, profile.activityLevel);
    const fullProfile = { ...profile, email, dailyCalorieGoal, waterGoal };

    // Sauvegarder d'abord localement
    await saveProfileLocally(fullProfile);

    // Puis essayer de sauvegarder dans Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), fullProfile);
    } catch (firebaseError) {
      console.error('Error saving to Firebase:', firebaseError);
    }
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};