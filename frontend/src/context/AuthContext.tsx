import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('shopsphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('shopsphere_token');
  });

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);

    sessionStorage.setItem('shopsphere_user', JSON.stringify(user));
    sessionStorage.setItem('shopsphere_token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem('shopsphere_user');
    sessionStorage.removeItem('shopsphere_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
