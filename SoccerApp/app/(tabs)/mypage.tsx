import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";    
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function tabsMyPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAuthed = !!user;
  const displayName = user?.name || user?.email?.split("@")[0] || "회원";

  const goProtected = (path: Href) => {
    if (!isAuthed) {
      Alert.alert(
        "로그인이 필요합니다",
        "이 기능을 사용하려면 로그인해주세요.",
        [
          { text: "취소", style: "cancel" },
          { text: "로그인", onPress: () => router.push("/auth/login" as Href) },
        ]
      );
      return;
    }
    router.push(path);
  };

  const onLogoutPress = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          style: "destructive",
          onPress: async () => {
            try { await logout?.(); } catch {}
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle} />
        <View style={styles.profileRight}>
          {!isAuthed ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/auth/login" as Href)}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>로그인</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.welcomeText}>{displayName}님 환영합니다</Text>
          )}

          <View style={styles.infoRow}>
            <TouchableOpacity
              style={styles.infoBtn}
              onPress={() => router.push("/mypage-pages/profile")}
            >
              <Text style={styles.infoBtnText}>내 정보</Text>
            </TouchableOpacity>

            {!isAuthed && <Text style={styles.infoDivider}>|</Text>}

            {!isAuthed && (
              <TouchableOpacity
                style={styles.infoBtn}
                onPress={() => router.push("/auth/register" as Href)}
              >
                <Text style={styles.infoBtnText}>회원가입</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/mypage-pages/orders")}
        >
          <Text style={styles.menuText}>예매 내역</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          // onPress={() => goProtected("/mypage-pages/notifications")}
          onPress={() => router.push("/mypage-pages/notifications")}
        >
          <Text style={styles.menuText}>알림</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          // onPress={() => goProtected("/mypage-pages/support")}
          onPress={() => router.push("/mypage-pages/support")}
        >
          <Text style={styles.menuText}>응원 구단</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push("/mypage-pages/contact" as Href)}
        >
          <Text style={styles.menuText}>문의사항</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isAuthed && (
        <TouchableOpacity style={styles.logoutContainer} onPress={onLogoutPress}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", paddingTop: 40 },
  profileContainer: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginLeft: 30, marginBottom: 10 },
  profileCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#d9d9d9", marginRight: 15 },
  profileRight: { flexDirection: "column", justifyContent: "center" },

  loginButton: { backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, alignSelf: "flex-start" },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  welcomeText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  infoBtn: { height: 28, paddingHorizontal: 3, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  infoBtnText: { color: "#fff", fontSize: 15, fontWeight: "500", lineHeight: 18 },
  infoDivider: { color: "#fff", marginHorizontal: 8, fontSize: 16, lineHeight: 28 },

  menuContainer: { width: "90%", marginTop: 25, marginBottom: 20 },
  menuButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111111", borderRadius: 10, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 12 },
  menuText: { color: "#fff", fontSize: 16 },

  logoutContainer: { marginTop: 190 },
  logoutText: { color: Colors.primary, fontSize: 16, fontWeight: "500" },
});
