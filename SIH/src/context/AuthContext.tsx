import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Authority, FieldOfficer } from '../types';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (roleKey: string, identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ner_safeslope_session_auth';

export const DEMO_CREDENTIALS: Record<
  string,
  {
    role: UserRole;
    roleName: string;
    sampleId: string;
    samplePass: string;
    userProfile: User | Authority | FieldOfficer;
  }
> = {
  authority: {
    role: 'Authority',
    roleName: 'District Administration',
    sampleId: '25104023@nec.edu.in',
    samplePass: '',
    userProfile: {
      id: '',
      name: 'District Administration Officer',
      role: 'Authority',
      email: '25104023@nec.edu.in',
      district: 'East Khasi Hills',
      department: 'District Disaster Management Authority (DDMA)',
      designation: 'Additional Deputy Commissioner / EOC Officer in Charge',
      jurisdiction: 'Meghalaya Central Disaster Division',
      emergencyContact: '0364-2224123',
    } as Authority,
  },
  field: {
    role: 'FieldOfficer',
    roleName: 'Field Officer',
    sampleId: '',
    samplePass: '',
    userProfile: {
      id: '',
      name: 'Insp. Thendup Sangma',
      role: 'FieldOfficer',
      officerId: 'FO-204',
      badgeNumber: 'NER-ML-FO-204',
      rank: 'Senior Field Inspector',
      assignedRegion: 'Meghalaya Division (East Khasi Hills)',
      currentSector: 'Sector 4 — Shillong Bypass / Sohra Route',
      contactNumber: '+91 98620 44123',
      status: 'PATROLLING',
      batteryLevel: 88,
    } as FieldOfficer,
  },
  citizen: {
    role: 'Citizen',
    roleName: 'Public / Citizen',
    sampleId: '',
    samplePass: '',
    userProfile: {
      id: '',
      name: 'Community Citizen Sentinel',
      role: 'Citizen',
      district: 'East Khasi Hills',
    },
  },
};

function buildUserProfile(
  supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  role: UserRole
): User | Authority | FieldOfficer {
  const email = supabaseUser.email || '';
  const meta = supabaseUser.user_metadata || {};
  const name = (meta.name as string) || (meta.full_name as string) || email.split('@')[0].toUpperCase() || 'User';

  if (role === 'Authority') {
    return {
      id: supabaseUser.id,
      name: name || 'District Administration Officer',
      role: 'Authority',
      email: email,
      district: (meta.district as string) || 'East Khasi Hills',
      department: 'District Disaster Management Authority (DDMA)',
      designation: (meta.designation as string) || 'Additional Deputy Commissioner / EOC Officer',
      jurisdiction: 'Meghalaya Central Disaster Division',
      emergencyContact: '0364-2224123',
    } as Authority;
  }

  if (role === 'FieldOfficer') {
    return {
      id: supabaseUser.id,
      name: name || 'Insp. Thendup Sangma',
      role: 'FieldOfficer',
      email: email,
      officerId: (meta.officer_id as string) || 'FO-204',
      badgeNumber: (meta.badge_number as string) || 'NER-ML-FO-204',
      rank: (meta.rank as string) || 'Senior Field Inspector',
      assignedRegion: 'Meghalaya Division (East Khasi Hills)',
      currentSector: 'Sector 4 — Shillong Bypass / Sohra Route',
      contactNumber: (meta.contact_number as string) || '+91 98620 44123',
      status: 'PATROLLING',
      batteryLevel: 88,
      district: (meta.district as string) || 'East Khasi Hills',
    } as FieldOfficer;
  }

  return {
    id: supabaseUser.id,
    name: name || 'Citizen Sentinel',
    role: 'Citizen',
    email: email,
    district: (meta.district as string) || 'East Khasi Hills',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync Supabase Auth session on mount and auth state change
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        let storedRole: UserRole = 'Authority';
        try {
          const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.role) storedRole = parsed.role;
          }
        } catch {
          // ignore
        }

        const metaRole = session.user.user_metadata?.role as UserRole | undefined;
        const finalRole: UserRole = metaRole || storedRole;
        const profile = buildUserProfile(session.user, finalRole);
        setUser(profile);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        let storedRole: UserRole = 'Authority';
        try {
          const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.role) storedRole = parsed.role;
          }
        } catch {
          // ignore
        }

        const metaRole = session.user.user_metadata?.role as UserRole | undefined;
        const finalRole: UserRole = metaRole || storedRole;
        const profile = buildUserProfile(session.user, finalRole);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('SessionStorage unavailable:', e);
    }
  }, [user]);

  const login = async (
    roleKey: string,
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedKey = roleKey.toLowerCase();

    if (!identifier.trim()) {
      return { success: false, error: 'Please enter your account email address.' };
    }

    if (!password.trim()) {
      return { success: false, error: 'Please enter your account password.' };
    }

    let targetRole: UserRole = 'Authority';
    if (normalizedKey === 'field' || normalizedKey === 'fieldofficer') {
      targetRole = 'FieldOfficer';
    } else if (normalizedKey === 'citizen') {
      targetRole = 'Citizen';
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password: password,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message || 'Invalid email or password. Please verify your Supabase credentials.',
        };
      }

      // Check if user metadata specifies role
      const metaRole = data.user.user_metadata?.role as UserRole | undefined;
      const finalRole: UserRole = metaRole || targetRole;

      const profile = buildUserProfile(data.user, finalRole);
      setUser(profile);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to connect to Supabase Auth service.';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors
    }
    setUser(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
