import Application from '../models/Application.js';

/**
 * Generate a guaranteed unique Application ID: IEM-2026-XXXX
 */
export const generateUniqueAppId = async () => {
  const year = new Date().getFullYear();
  let isUnique = false;
  let appId = '';

  while (!isUnique) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    appId = `IEM-${year}-${randomDigits}`;
    
    // Check collision in DB
    const existing = await Application.findOne({ applicationNumber: appId });
    if (!existing) {
      isUnique = true;
    }
  }

  return appId;
};
