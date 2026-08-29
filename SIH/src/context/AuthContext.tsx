import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Authority, FieldOfficer } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (roleKey: string, identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ner_safeslope_session_auth';

// Pre-configured Demo Accounts for Hackathon demonstration
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
    sampleId: 'NER-ADMIN-01',
    samplePass: 'admin123',
    userProfile: {
      id: 'auth-01',
      name: 'Dr. P. Lyndem (ADC)',
      role: 'Authority',
      email: 'admin.ekh@ner.gov.in',
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
    sampleId: 'FO-204',
    samplePass: 'officer123',
    userProfile: {
      id: 'fo-204',
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
    sampleId: '9876543210',
    samplePass: 'citizen123',
    userProfile: {
      id: 'cit-104',
      name: 'Wanda Lyngdoh',
      role: 'Citizen',
      phone: '+91 98765 43210',
      email: 'wanda.lyngdoh@community.ner',
      district: 'East Khasi Hills',
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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
    // Artificial 400ms delay to simulate secure authentication processing
    await new Promise((resolve) => setTimeout(resolve, 400));

    const normalizedKey = roleKey.toLowerCase();
    const roleConfig = DEMO_CREDENTIALS[normalizedKey];

    if (!roleConfig) {
      return { success: false, error: 'Invalid portal role requested.' };
    }

    if (!identifier.trim()) {
      return { success: false, error: 'Please enter your ID, email, or mobile number.' };
    }

    if (!password.trim()) {
      return { success: false, error: 'Please enter your account password.' };
    }

    // Check against standard demo credentials (or accept any reasonable demo input with matching pass)
    const isValidPass =
      password === roleConfig.samplePass ||
      password === 'admin123' ||
      password === 'demo123' ||
      password === 'password123';

    if (!isValidPass) {
      return {
        success: false,
        error: `Invalid credentials. For demo access, use ID: "${roleConfig.sampleId}" and Password: "${roleConfig.samplePass}".`,
      };
    }

    // Construct authenticated session profile
    const authenticatedUser: User = {
      ...roleConfig.userProfile,
      name: identifier.includes('@')
        ? identifier.split('@')[0].toUpperCase()
        : identifier.startsWith('9') || identifier.startsWith('+')
        ? `Citizen (${identifier})`
        : roleConfig.userProfile.name,
    };

    setUser(authenticatedUser);
    return { success: true };
  };

  const logout = () => {
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
