// Example of how to extend the Firebase Auth implementation
// This file demonstrates additional Firebase features you can add

import { 
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    await updateProfile(user, {
      displayName,
      photoURL
    });
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Update Password
export const changePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    await updatePassword(user, newPassword);
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Send Email Verification
export const sendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  try {
    await sendEmailVerification(user);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Create User Document in Firestore
export const createUserDocument = async (user: User, additionalData?: Record<string, unknown>) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }

  return userRef;
};

// Get User Document from Firestore
export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  
  try {
    const userDocument = await getDoc(doc(db, 'users', uid));
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
};
