import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  Radio,
  Users,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

interface RoleConfig {
  title: string;
  badge: string;
  badgeClass: string;
  icon: React.ReactNode;
  iconBgClass: string;
  fieldLabel: string;
  fieldPlaceholder: string;
  fieldHelp: string;
  isEmailType?: boolean;
  purposeText: string;
  targetRoute: string;
  demoId: string;
  demoPass: string;
  isSupabaseAuth?: boolean;
}

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const roleKey = (role || 'authority').toLowerCase();

  // Role metadata configurations
  const roleConfigs: Record<string, RoleConfig> = {
    authority: {
      title: 'District Administration Login',
      badge: 'SUPABASE AUTHENTICATION',
      badgeClass: 'bg-blue-950 text-blue-300 border-blue-800',
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      iconBgClass: 'bg-blue-600/20 border-blue-500/40 text-blue-400',
      fieldLabel: 'Authority Email Address',
      fieldPlaceholder: 'e.g. 25104023@nec.edu.in',
      fieldHelp: 'Enter your registered official administration email address',
      isEmailType: true,
      purposeText: 'Monitor regional landslide risk, alerts and emergency priorities.',
      targetRoute: '/authority',
      demoId: '25104023@nec.edu.in',
      demoPass: '',
      isSupabaseAuth: true,
    },
    field: {
      title: 'Field Officer Surveillance Login',
      badge: 'SUPABASE AUTHENTICATION',
      badgeClass: 'bg-sky-950 text-sky-300 border-sky-800',
      icon: <Radio className="w-6 h-6 text-sky-400" />,
      iconBgClass: 'bg-sky-600/20 border-sky-500/40 text-sky-400',
      fieldLabel: 'Field Officer Email Address',
      fieldPlaceholder: 'e.g. officer@ner-safeslope.org',
      fieldHelp: 'Enter your registered field officer email address',
      isEmailType: true,
      purposeText: 'Report hazards, verify incidents and monitor nearby risk zones.',
      targetRoute: '/field',
      demoId: '25104023@nec.edu.in',
      demoPass: '',
      isSupabaseAuth: true,
    },
    citizen: {
      title: 'Public / Citizen Portal Login',
      badge: 'SUPABASE AUTHENTICATION',
      badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      iconBgClass: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400',
      fieldLabel: 'Citizen Email Address',
      fieldPlaceholder: 'e.g. citizen@community.ner',
      fieldHelp: 'Enter your registered citizen email address',
      isEmailType: true,
      purposeText: 'Report hazards and receive safety warnings in your area.',
      targetRoute: '/citizen',
      demoId: '25104023@nec.edu.in',
      demoPass: '',
      isSupabaseAuth: true,
    },
  };

  const config = roleConfigs[roleKey] || roleConfigs.authority;

  // Form State
  const [identifier, setIdentifier] = useState(config.demoId || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // If already authenticated in the matching role, offer fast-track redirect
  const isAlreadyLoggedInThisRole =
    isAuthenticated &&
    user &&
    ((roleKey === 'authority' && user.role === 'Authority') ||
      (roleKey === 'field' && user.role === 'FieldOfficer') ||
      (roleKey === 'citizen' && user.role === 'Citizen'));

  const handleFillDemo = () => {
    setIdentifier(config.demoId);
    if (config.demoPass) {
      setPassword(config.demoPass);
    }
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Inline form validation
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = `${config.fieldLabel} is required`;
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await login(roleKey, identifier, password);
      if (result.success) {
        navigate(config.targetRoute, { replace: true });
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Role Selection"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Role Selection</span>
            </Link>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                NER-SafeSlope
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-900 text-slate-400 border border-slate-800">
            {config.isSupabaseAuth ? 'SUPABASE AUTH GATEWAY' : 'SECURE ACCESS GATEWAY'}
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Active Session Notification (If already logged in) */}
          {isAlreadyLoggedInThisRole && (
            <div className="bg-blue-950/60 border border-blue-800 text-blue-200 p-4 rounded-xl flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Logged in as <strong>{user?.name}</strong></span>
              </div>
              <Button
                size="xs"
                variant="primary"
                onClick={() => navigate(config.targetRoute)}
              >
                Go to Portal →
              </Button>
            </div>
          )}

          {/* Login Card Shell */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500" />

            {/* Persona Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm ${config.iconBgClass}`}>
                  {config.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeClass}`}>
                  {config.badge}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {config.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {config.purposeText}
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="bg-red-950/80 border border-red-800 text-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Authentication Failed</span>
                  <p className="text-red-300 leading-normal">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{config.fieldLabel}</span>
                  <span className="text-[10px] text-slate-500 font-normal">Required</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    {config.isEmailType ? <Mail className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <input
                    type={config.isEmailType ? 'email' : 'text'}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (fieldErrors.identifier) {
                        setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                      }
                    }}
                    placeholder={config.fieldPlaceholder}
                    disabled={isLoading}
                    autoComplete="email"
                    className={`w-full bg-slate-950 border rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors font-sans ${
                      fieldErrors.identifier
                        ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.identifier && (
                  <p className="text-[11px] text-red-400 font-medium">{fieldErrors.identifier}</p>
                )}
                <p className="text-[10px] text-slate-500">{config.fieldHelp}</p>
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-500 font-normal">Required</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Enter your security password..."
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={`w-full bg-slate-950 border rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors font-sans ${
                      fieldErrors.password
                        ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-400 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isLoading}
                  className="w-full justify-center py-2.5 text-sm font-bold shadow-md"
                >
                  {isLoading ? 'Verifying with Supabase...' : `Log In to Authority Portal`}
                </Button>

                {/* Quick Auto-Fill Demo Credentials Helper */}
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-dashed border-slate-700 hover:border-blue-500 text-xs text-slate-300 hover:text-blue-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-fill Demo Account (<strong>{config.demoId}</strong>)</span>
                </button>
              </div>
            </form>

            {/* Demonstration Notice */}
            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                {config.isSupabaseAuth
                  ? 'Real Supabase Auth Active: Authenticating securely against the live project backend.'
                  : 'Simulated Hackathon Environment: Role sessions managed via secure browser state.'}
              </span>
            </div>
          </div>

          {/* Switch Role Quick Links */}
          <div className="text-center space-y-2 text-xs text-slate-400">
            <div>
              Need to access a different portal?{' '}
              <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                Choose another role
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
        NER-SafeSlope • Role-Based Authentication Gateway • Smart India Hackathon
      </footer>
    </div>
  );
};

export default LoginPage;
