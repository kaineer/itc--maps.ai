/**
 * Утилиты для работы с localStorage с поддержкой сериализации/десериализации
 * и обработкой ошибок
 */

/**
 * Ключ для хранения состояния UI в localStorage
 */
export const UI_STORAGE_KEY = "ekb3d/ui";
const applicationKey = "ekb3d";

/**, чтобы можно было использовать подсказку и в то же время, чтобы ее можно было убирать. И для того, чтобы стили были примерно одинаковыми.
 * Сохраняет данные в localStorage с обработкой ошибок
 * @param key Ключ для сохранения
 * @param data Данные для сохранения (будут сериализованы в JSON)
 * @returns Успешно ли сохранение
 */
function saveToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error(`Ошибка сохранения в localStorage (ключ: ${key}):`, error);
    return false;
  }
}

export function saveSliceState<T>(name: string, data: T): boolean {
  const key = applicationKey + "/" + name;
  return saveToLocalStorage(key, data);
}

/**
 * Загружает данные из localStorage с обработкой ошибок
 * @param key Ключ для загрузки
 * @param defaultValue Значение по умолчанию, если данные не найдены или произошла ошибка
 * @returns Загруженные данные или значение по умолчанию
 */
function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Ошибка загрузки из localStorage (ключ: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * Загружает данные из localStorage с обработкой ошибок
 * @param name Имя слайса для загрузки
 * @param defaultValue Значение по умолчанию, если данные не найдены или произошла ошибка
 * @returns Загруженные данные или значение по умолчанию
 */
export function loadSliceState<T>(name: string, defaultValue: T): T {
  const key = "ekb3d/" + name;
  return loadFromLocalStorage(key, defaultValue);
}

/**
 * Удаляет данные из localStorage с обработкой ошибок
 * @param key Ключ для удаления
 * @returns Успешно ли удаление
 */
export function removeFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
    return false;
  }
}

/**
 * Проверяет, поддерживается ли localStorage в текущем окружении
 * @returns Поддерживается ли localStorage
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("localStorage не поддерживается в этом окружении:", error);
    return false;
  }
}

/**
 * Очищает состояние UI из localStorage
 * @returns Успешно ли очистка
 */
export function clearUIState(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  return removeFromLocalStorage(UI_STORAGE_KEY);
}

/**
 * Тип для миграции данных между версиями
 */
export interface StorageMigration<T> {
  version: number;
  migrate: (data: any) => T;
}

/**
 * Загружает данные с поддержкой миграции версий
 * @param key Ключ для загрузки
 * @param defaultValue Значение по умолчанию
 * @param migrations Массив миграций для применения
 * @returns Загруженные и мигрированные данные
 */
export function loadWithMigration<T>(
  key: string,
  defaultValue: T,
  migrations: StorageMigration<T>[] = [],
): T {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }

    const data = JSON.parse(serializedData);

    // Применяем миграции, если они есть
    if (migrations.length > 0 && data.version !== undefined) {
      let migratedData = data;
      for (const migration of migrations) {
        if (migration.version > data.version) {
          migratedData = migration.migrate(migratedData);
          migratedData.version = migration.version;
        }
      }
      return migratedData as T;
    }

    return data as T;
  } catch (error) {
    console.error(`Ошибка загрузки с миграцией (ключ: ${key}):`, error);
    return defaultValue;
  }
}

export const createStoreMiddleware =
  (name: string) => (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    const key = name + "/";

    if (action.type.startsWith(key)) {
      const state = store.getState();
      if (state[name]) {
        saveSliceState(name, state[name]);
      }
    }

    return result;
  };
