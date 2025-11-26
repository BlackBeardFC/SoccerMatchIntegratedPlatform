import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>; // ✅ 추가
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fakeDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const login = async (email: string, _password: string) => {
    // TODO: 실제 API 연동 자리
    await fakeDelay(400);
    setUser({ id: "u_" + Date.now(), email });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, _password: string) => {
    // TODO: 실제 API 연동 자리
    await fakeDelay(500);
    // 보통은 회원가입 후 자동 로그인 처리
    setUser({ id: "u_" + Date.now(), name, email });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
