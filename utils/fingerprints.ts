import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'user_uuid';

/**
 * Generate a new UUID
 * @returns {string} A new UUID v4
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Check if UUID exists in localStorage
 * @returns {boolean} True if UUID exists, false otherwise
 */
export const checkUUIDExists = () => {
  try {
    const uuid = localStorage.getItem(STORAGE_KEY);
    return uuid !== null && uuid.trim() !== '';
  } catch (error) {
    console.error('Error checking UUID in localStorage:', error);
    return false;
  }
};

/**
 * Get UUID from localStorage
 * @returns {string|null} The stored UUID or null if not found
 */
export const getStoredUUID = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error getting UUID from localStorage:', error);
    return null;
  }
};

/**
 * Save UUID to localStorage
 * @param {string} uuid - The UUID to save
 * @returns {boolean} True if saved successfully, false otherwise
 */
export const saveUUIDToStorage = (uuid: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, uuid);
    return true;
  } catch (error) {
    console.error('Error saving UUID to localStorage:', error);
    return false;
  }
};

/**
 * Complete UUID management flow - check if exists, if not create and save
 * @returns {string} The UUID (existing or newly created)
 */
export const handleUUIDAuth = () => {
  try {
    // Check if UUID exists in localStorage
    if (checkUUIDExists()) {
      const existingUUID = getStoredUUID();
      console.log('UUID found in localStorage:', existingUUID);
      return existingUUID;
    } else {
      // Generate new UUID and save to localStorage
      const newUUID = generateUUID();
      const saved = saveUUIDToStorage(newUUID);
      
      if (saved) {
        console.log('New UUID created and saved:', newUUID);
        return newUUID;
      } else {
        throw new Error('Failed to save UUID to localStorage');
      }
    }
  } catch (error) {
    console.error('Error in UUID auth flow:', error);
    throw error;
  }
};

/**
 * Clear UUID from localStorage
 * @returns {boolean} True if cleared successfully
 */
export const clearStoredUUID = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing UUID from localStorage:', error);
    return false;
  }
};