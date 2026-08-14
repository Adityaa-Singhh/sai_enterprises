/**
 * Firebase Authentication Context — Sai Enterprises
 *
 * Replaces the previous dummy/mock authentication system with real
 * Firebase Authentication. Role information is stored in Firestore
 * at users/{uid} and read on login.
 *
 * This context exposes:
 *   currentUser      — Firebase User object (or null)
 *   userProfile      — Firestore user document with role info
 *   isAuthenticated  — boolean
 *   isLoading        — initial auth state check loading
 *   error            — current auth error message
 *   login()          — email/password sign in
 *   logout()         — sign out
 *   resetPassword()  — send password reset email
 *   hasPermission()  — RBAC check
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { COLLECTIONS, type FirestoreUser, type UserRole } from '../../lib/firestore-types';

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------
export type Permission =
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'categories.manage'
  | 'brands.manage'
  | 'gallery.manage'
  | 'testimonials.manage'
  | 'faqs.manage'
  | 'enquiries.view'
  | 'enquiries.manage'
  | 'enquiries.updateStatus'
  | 'business.edit'
  | 'content.edit'
  | 'users.manage'
  | 'analytics.view'
  | 'settings.manage'
  | 'security.manage'
  | 'activity.view';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.manage', 'brands.manage', 'gallery.manage', 'testimonials.manage',
    'faqs.manage', 'enquiries.view', 'enquiries.manage', 'enquiries.updateStatus',
    'business.edit', 'content.edit', 'users.manage', 'analytics.view',
    'settings.manage', 'security.manage', 'activity.view',
  ],
  MANAGER: [
    'products.view', 'products.create', 'products.edit',
    'categories.manage', 'brands.manage', 'gallery.manage', 'testimonials.manage',
    'faqs.manage', 'enquiries.view', 'enquiries.manage', 'enquiries.updateStatus',
    'content.edit', 'analytics.view', 'activity.view',
  ],
  STAFF: [
    'products.view', 'enquiries.view', 'enquiries.updateStatus', 'activity.view',
  ],
};

// Re-export for compatibility with other files
export type { UserRole };
export type { FirestoreUser as AdminUser };

// ---------------------------------------------------------------------------
// Context Type
// ---------------------------------------------------------------------------
interface AuthContextType {
  /** Raw Firebase user (null if not signed in) */
  currentUser: User | null;
  /** Firestore profile with role, displayName, status */
  userProfile: FirestoreUser | null;
  /** True once onAuthStateChanged fires for the first time */
  isAuthenticated: boolean;
  /** True during the initial auth state resolution */
  isLoading: boolean;
  /** Current error message */
  error: string | null;
  /** Sign in with email + password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Send password reset email */
  resetPassword: (email: string) => Promise<boolean>;
  /** Update user profile data in Auth and Firestore */
  updateProfileData: (data: { displayName?: string; phone?: string; avatarUrl?: string }) => Promise<boolean>;
  /** Change password via re-authentication */
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  /** Save user security & notification settings */
  updateUserSettings: (settings: Record<string, unknown>) => Promise<boolean>;
  /** Check RBAC permission for current user's role */
  hasPermission: (permission: Permission) => boolean;
  /** Clear current error */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact the administrator.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

async function fetchUserProfile(uid: string): Promise<FirestoreUser | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (snap.exists()) {
      return snap.data() as FirestoreUser;
    }
    return null;
  } catch (err) {
    console.error('[fetchUserProfile] Error fetching user profile:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        // Update lastLoginAt on every auth state resolution
        if (profile) {
          setDoc(
            doc(db, COLLECTIONS.USERS, firebaseUser.uid),
            { lastLoginAt: serverTimestamp() },
            { merge: true }
          ).catch(() => {/* non-critical */});
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
      clearTimeout(timer);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // login
  // ---------------------------------------------------------------------------
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await fetchUserProfile(credential.user.uid);

      if (!profile) {
        // User exists in Firebase Auth but has no Firestore profile yet.
        // This can happen if admin was created via Firebase Console without seeding.
        await signOut(auth);
        setError('Account setup incomplete. Please contact the system administrator.');
        return false;
      }

      if (profile.status === 'DISABLED') {
        await signOut(auth);
        setError('This account has been disabled. Please contact the administrator.');
        return false;
      }

      setCurrentUser(credential.user);
      setUserProfile(profile);
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(mapFirebaseError(code));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // logout
  // ---------------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch {
      // Ignore sign-out errors — state will clear via onAuthStateChanged
    }
  }, []);

  // ---------------------------------------------------------------------------
  // resetPassword
  // ---------------------------------------------------------------------------
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(mapFirebaseError(code));
      return false;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // updateProfileData
  // ---------------------------------------------------------------------------
  const updateProfileData = useCallback(
    async (data: { displayName?: string; phone?: string; avatarUrl?: string }): Promise<boolean> => {
      if (!currentUser) return false;
      setError(null);
      try {
        if (data.displayName !== undefined || data.avatarUrl !== undefined) {
          await updateProfile(currentUser, {
            displayName: data.displayName !== undefined ? data.displayName : currentUser.displayName,
            photoURL: data.avatarUrl !== undefined ? data.avatarUrl : currentUser.photoURL,
          });
        }

        const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
        const updateData: Record<string, unknown> = {
          updatedAt: serverTimestamp(),
        };
        if (data.displayName !== undefined) updateData.displayName = data.displayName;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

        await setDoc(userRef, updateData, { merge: true });

        setUserProfile((prev) =>
          prev
            ? ({
                ...prev,
                ...(data.displayName !== undefined && { displayName: data.displayName }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
              } as FirestoreUser)
            : null
        );
        return true;
      } catch (err: unknown) {
        console.error('Failed to update profile:', err);
        setError('Failed to update profile details. Please try again.');
        return false;
      }
    },
    [currentUser]
  );

  // ---------------------------------------------------------------------------
  // changePassword
  // ---------------------------------------------------------------------------
  const changePassword = useCallback(
    async (currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
      if (!currentUser || !currentUser.email) {
        return { success: false, message: 'No active authenticated user.' };
      }
      setError(null);
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPass);
        return { success: true };
      } catch (err: unknown) {
        console.error('Failed to change password:', err);
        const code = (err as { code?: string })?.code ?? '';
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          return { success: false, message: 'Current password is incorrect.' };
        }
        if (code === 'auth/weak-password') {
          return { success: false, message: 'New password must be at least 6 characters long.' };
        }
        return { success: false, message: 'Failed to update password. Please check current credentials.' };
      }
    },
    [currentUser]
  );

  // ---------------------------------------------------------------------------
  // updateUserSettings
  // ---------------------------------------------------------------------------
  const updateUserSettings = useCallback(
    async (newSettings: Record<string, unknown>): Promise<boolean> => {
      if (!currentUser) return false;
      setError(null);
      try {
        const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
        const currentSettings = userProfile?.settings || {};
        const mergedSettings = { ...currentSettings, ...newSettings };

        const updateData: Record<string, unknown> = {
          settings: mergedSettings,
          updatedAt: serverTimestamp(),
        };

        if (newSettings.twoFactorEnabled !== undefined) {
          updateData.twoFactorEnabled = Boolean(newSettings.twoFactorEnabled);
        }

        await setDoc(userRef, updateData, { merge: true });

        setUserProfile((prev) =>
          prev
            ? ({
                ...prev,
                settings: mergedSettings,
                ...(newSettings.twoFactorEnabled !== undefined && {
                  twoFactorEnabled: Boolean(newSettings.twoFactorEnabled),
                }),
              } as FirestoreUser)
            : null
        );
        return true;
      } catch (err) {
        console.error('Failed to update user settings:', err);
        setError('Failed to update settings in database.');
        return false;
      }
    },
    [currentUser, userProfile?.settings]
  );

  // ---------------------------------------------------------------------------
  // hasPermission
  // ---------------------------------------------------------------------------
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!userProfile) return false;
      const permissions = ROLE_PERMISSIONS[userProfile.role] ?? [];
      return permissions.includes(permission);
    },
    [userProfile]
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAuthenticated: !!currentUser && !!userProfile,
        isLoading,
        error,
        login,
        logout,
        resetPassword,
        updateProfileData,
        changePassword,
        updateUserSettings,
        hasPermission,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
