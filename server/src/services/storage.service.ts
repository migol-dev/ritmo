import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';
import { Habit, HabitStoreData } from '../models/habit.model';
import { generateCanonicalHabits } from './seed.service';

export class LocalStorageService {
  private static filePath = ENV.DATA_FILE_PATH;

  private static ensureDataDirExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public static readStore(): HabitStoreData {
    this.ensureDataDirExists();
    if (!fs.existsSync(this.filePath)) {
      const initialData: HabitStoreData = {
        version: '3.0.0',
        lastSync: new Date().toISOString(),
        habits: generateCanonicalHabits()
      };
      this.writeStore(initialData);
      return initialData;
    }

    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(content) as HabitStoreData;
      if (Array.isArray(parsed.habits)) {
        return parsed;
      }
    } catch {
      // Si hay error de parsing, restaurar valores de semilla
    }

    const fallback: HabitStoreData = {
      version: '3.0.0',
      lastSync: new Date().toISOString(),
      habits: generateCanonicalHabits()
    };
    this.writeStore(fallback);
    return fallback;
  }

  public static writeStore(data: HabitStoreData): void {
    this.ensureDataDirExists();
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  public static getHabits(): Habit[] {
    return this.readStore().habits;
  }

  public static saveHabits(habits: Habit[]): void {
    const store = this.readStore();
    store.habits = habits.map((h, i) => ({
      ...h,
      code: String(i + 1).padStart(2, '0')
    }));
    store.lastSync = new Date().toISOString();
    this.writeStore(store);
  }

  public static resetToSeed(): Habit[] {
    const habits = generateCanonicalHabits();
    this.saveHabits(habits);
    return habits;
  }
}
