import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type UserProfile = {
  // 회원 정보
  nickname: string;
  name: string;
  email: string;
  phone: string;
  birth: string;
  profileImageUri: string | null;

  // 카드 정보
  hasCard?: boolean;
  cardBrand?: string;   // ex) "하나카드"
  cardLast4?: string;   // ex) "1234"
};

type AuthContextType = {
  user: UserProfile;                                   // 항상 뭔가 하나는 있음 (기본 유저 포함)
  isAuthed: boolean;                                   // 진짜 로그인 여부
  updateUser: (patch: Partial<UserProfile>) => void;   // 내 정보 수정에서 사용
  login: (email: string, pw: string) => Promise<void>; // 로그인 페이지에서 사용
  logout: () => Promise<void>;                         // 마이페이지 로그아웃 버튼에서 사용
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 앱 기본 유저 (로그아웃 상태일 때도 이 값 사용)
const defaultUser: UserProfile = {
  nickname: "검은수염팬",
  name: "진영문",
  email: "blackbeard@example.com",
  phone: "010-1234-5678",
  birth: "2003.03.05",
  profileImageUri: null,

  // 카드 정보
  hasCard: false,
  cardBrand: undefined,
  cardLast4: undefined,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // user는 항상 뭔가 값을 갖고 있게 유지 (null 아님)
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  // 내정보 수정에서 쓰는 업데이트
  const updateUser = (patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  };

  // 🔹 임시 로그인 구현 (백엔드 붙기 전까지)
  const login = async (email: string, pw: string) => {
    // 여기서는 그냥 아무 이메일/비번이나 통과시킴 (실패 없음)
    // 필요하면 나중에 조건 넣고 throw 하면 됨
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
    }));
    setIsAuthed(true);
  };

  // 🔹 로그아웃: 로그인 여부만 false로, 유저는 기본값으로 되돌림
  const logout = async () => {
    setIsAuthed(false);
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthed, updateUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
}
