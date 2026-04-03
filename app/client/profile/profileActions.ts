"use server";

import { updateUserAvatar, updateUserProfile } from '@/lib/db';
import { User } from '@prisma/client';

/**
 * Updates the user's profile avatar.
 * @param userId - ID of the user
 * @param imageData - Base64 or URL of the new image
 */
export async function updateAvatar(userId: number, imageData: string) {
  try {
    const updatedUser = await updateUserAvatar(userId, imageData);
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("[PROFILE_ACTIONS] Avatar update failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates simple profile information.
 */
export async function updateProfile(userId: number, data: { name?: string, phone?: string, email?: string }) {
  try {
    const updatedUser = await updateUserProfile(userId, data);
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("[PROFILE_ACTIONS] Profile update failed:", error);
    return { success: false, error: error.message };
  }
}
