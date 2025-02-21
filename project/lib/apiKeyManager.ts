import { Platform } from 'react-native';

export type ApiKeyConfig = {
  key: string;
  remainingQuota: number;
  resetTime?: Date;
};

class ApiKeyManager {
  private keys: ApiKeyConfig[] = [];
  private currentKeyIndex: number = 0;
  private storageKey = 'api_keys_status';

  constructor(initialKeys: string[]) {
    this.initializeKeys(initialKeys);
    this.loadKeyStatus();
  }

  private initializeKeys(keys: string[]) {
    this.keys = keys.map(key => ({
      key,
      remainingQuota: 100, // Valeur par défaut
    }));
  }

  private loadKeyStatus() {
    if (Platform.OS === 'web') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const status = JSON.parse(stored);
          this.keys = status.keys;
          this.currentKeyIndex = status.currentKeyIndex;
        }
      } catch (error) {
        console.error('Error loading key status:', error);
      }
    }
  }

  private saveKeyStatus() {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify({
          keys: this.keys,
          currentKeyIndex: this.currentKeyIndex,
        }));
      } catch (error) {
        console.error('Error saving key status:', error);
      }
    }
  }

  public getCurrentKey(): string {
    return this.keys[this.currentKeyIndex].key;
  }

  public markKeyAsExhausted() {
    this.keys[this.currentKeyIndex].remainingQuota = 0;
    this.rotateToNextKey();
  }

  private rotateToNextKey() {
    let attempts = 0;
    const totalKeys = this.keys.length;

    while (attempts < totalKeys) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % totalKeys;
      if (this.keys[this.currentKeyIndex].remainingQuota > 0) {
        this.saveKeyStatus();
        return;
      }
      attempts++;
    }

    throw new Error('Toutes les clés API ont atteint leur limite');
  }

  public async executeWithRetry<T>(
    operation: (key: string) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const result = await operation(this.getCurrentKey());
        return result;
      } catch (error) {
        if (error instanceof Error && 
            error.message.includes('429') || 
            error.message.includes('quota')) {
          this.markKeyAsExhausted();
          attempts++;
        } else {
          throw error;
        }
      }
    }

    throw new Error('Nombre maximum de tentatives atteint');
  }
}

// Liste des clés API
const API_KEYS = [
  process.env.EXPO_PUBLIC_OPENAI_API_KEY || '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',
  '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',
  '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',
];

export const apiKeyManager = new ApiKeyManager(API_KEYS);