import { UserProfile } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = 'user_profile';
const CACHE_VERSION = '1.0.0';

let localProfile: UserProfile | null = null;
let isInitialized = false;

const initializeStorage = async () => {
  if (isInitialized) return;
  
  try {
    const version = await AsyncStorage.getItem('cache_version');
    if (version !== CACHE_VERSION) {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('cache_version', CACHE_VERSION);
    }
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

export const saveProfileLocally = async (profile: UserProfile): Promise<void> => {
  await initializeStorage();
  
  try {
    localProfile = profile;
    const profileString = JSON.stringify(profile);
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, profileString);
  } catch (error) {
    console.error('Error saving profile locally:', error);
    throw new Error('Failed to save profile locally');
  }
};

export const getLocalProfile = async (): Promise<UserProfile | null> => {
  await initializeStorage();
  
  if (localProfile) {
    return localProfile;
  }
  
  try {
    const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      localProfile = JSON.parse(storedProfile);
      return localProfile;
    }
  } catch (error) {
    console.error('Error reading profile from storage:', error);
  }
  
  return null;
};

export const clearLocalProfile = async (): Promise<void> => {
  try {
    localProfile = null;
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing profile from storage:', error);
    throw new Error('Failed to clear profile from storage');
  }
};

export const defaultProfile: UserProfile = {
  email: 'utilisateur@example.com',
  age: 30,
  gender: 'homme',
  height: 175,
  weight: 75,
  targetWeight: 70,
  activityLevel: 'moderate',
  dailyCalorieGoal: 2000,
  waterGoal: 2000,
};