// //  // 마이페이지 메인

// // import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useRouter } from "expo-router";
// // import Colors from "../../constants/Colors";
// // import { useAuth } from "../../contexts/AuthContext";

// // export default function MyPage() {
// //   const router = useRouter();
// //   const { user } = useAuth(); // user가 null이면 비로그인

// //   // 공통: 보호된 화면 접근 시 로그인 요구
// //   const requireLoginThen = (go: () => void) => {
// //     if (user) return go();
// //     Alert.alert(
// //       "로그인이 필요합니다",
// //       "이 기능을 사용하려면 로그인하세요.",
// //       [
// //         { text: "취소", style: "cancel" },
// //         { text: "확인", onPress: () => router.push("/auth/login") }, // ✅ 확인→로그인
// //       ],
// //       { cancelable: true }
// //     );
// //   };

// //   const goLogin = () => router.push("/auth/login");
// //   const goRegister = () => router.push("/auth/register");

// //   // ✅ 보호 대상: 내 정보 / 응원 구단 / 구매 내역
// //   const goProfile = () => requireLoginThen(() => router.push("/mypage-pages/profile"));
// //   const goFavoriteClub = () => requireLoginThen(() => router.push("/mypage-pages/support")); // 파일명이 따로 있으면 경로 맞춰줘
// //   const goOrders = () => requireLoginThen(() => router.push("/mypage-pages/orders"));

// //   // 로그인 없이도 가능: 문의사항(원하면 보호로 바꿔도 됨)
// //   const goContact = () => router.push("/mypage-pages/contact");

// //   return (
// //     <View style={styles.container}>
// //       {/* 프로필 + 로그인 */}
// //       <View style={styles.profileContainer}>
// //         <View style={styles.profileCircle} />
// //         <View style={styles.profileRight}>
// //           <TouchableOpacity style={styles.loginButton} onPress={goLogin}>
// //             <Text style={styles.loginText}>{user ? "마이 계정" : "로그인"}</Text>
// //           </TouchableOpacity>

// //           {/* 로그인 바로 밑 내정보 / 회원가입 */}
// //           <View style={styles.infoRow}>
// //             <TouchableOpacity style={styles.infoBtn} onPress={goProfile}>
// //               <Text style={styles.infoBtnText}>내 정보</Text>
// //             </TouchableOpacity>

// //             <Text style={styles.infoDivider}>|</Text>

// //             <TouchableOpacity style={styles.infoBtn} onPress={goRegister}>
// //               <Text style={styles.infoBtnText}>회원가입</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </View>

// //       {/* 메뉴 리스트 */}
// //       <View style={styles.menuContainer}>
// //         <TouchableOpacity style={styles.menuButton} onPress={goOrders}>
// //           <Text style={styles.menuText}>구매 내역</Text>
// //           <Ionicons name="chevron-forward" size={20} color="#fff" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuButton} onPress={goFavoriteClub}>
// //           <Text style={styles.menuText}>알림</Text>
// //           <Ionicons name="chevron-forward" size={20} color="#fff" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuButton} onPress={goFavoriteClub}>
// //           <Text style={styles.menuText}>응원 구단</Text>
// //           <Ionicons name="chevron-forward" size={20} color="#fff" />
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.menuButton} onPress={goContact}>
// //           <Text style={styles.menuText}>문의사항</Text>
// //           <Ionicons name="chevron-forward" size={20} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       <TouchableOpacity style={styles.logoutContainer}>
// //         <Text style={styles.logoutText}>로그아웃</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000", alignItems: "center", paddingTop: 40 },
// //   profileContainer: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginLeft: 30, marginBottom: 10 },
// //   profileCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#d9d9d9", marginRight: 15 },
// //   profileRight: { flexDirection: "column", justifyContent: "center" },
// //   loginButton: { backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, alignSelf: "flex-start" },
// //   loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },

// //   infoRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
// //   infoBtn: { height: 28, paddingHorizontal: 3, borderRadius: 6, justifyContent: "center", alignItems: "center" },
// //   infoBtnText: { color: "#fff", fontSize: 15, fontWeight: "500", lineHeight: 18 },
// //   infoDivider: { color: "#fff", marginHorizontal: 8, fontSize: 16, lineHeight: 28 },

// //   menuContainer: { width: "90%", marginTop: 25, marginBottom: 20 },
// //   menuButton: {
// //     flexDirection: "row", justifyContent: "space-between", alignItems: "center",
// //     backgroundColor: "#111111", borderRadius: 10, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 12,
// //   },
// //   menuText: { color: "#fff", fontSize: 16 },

// //   logoutContainer: { marginTop: 190 },
// //   logoutText: { color: Colors.primary, fontSize: 16, fontWeight: "500" },
// // });


// import { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import Colors from "../../constants/Colors";
// import { useAuth } from "../../contexts/AuthContext"; // ✅

// export default function MyPage() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [showLoginAlert, setShowLoginAlert] = useState(false);

//   // 보호 기능
//   const requireLoginThen = (go: () => void) => {
//     if (user) return go();
//     setShowLoginAlert(true); // 로그인 필요 모달 띄우기
//   };

//   // 이동 함수들
//   const goLogin = () => router.push("/auth/login");
//   const goRegister = () => router.push("/auth/register");
//   const goProfile = () => requireLoginThen(() => router.push("/mypage-pages/profile"));
//   const goOrders = () => requireLoginThen(() => router.push("/mypage-pages/orders"));
//   const goSupport = () => requireLoginThen(() => router.push("/mypage-pages/support"));
//   const goContact = () => router.push("/mypage-pages/contact");

//   return (
//     <View style={styles.container}>
//       {/* 프로필 + 로그인 */}
//       <View style={styles.profileContainer}>
//         <View style={styles.profileCircle} />
//         <View style={styles.profileRight}>
//           <TouchableOpacity style={styles.loginButton} onPress={goLogin}>
//             <Text style={styles.loginText}>{user ? "마이 계정" : "로그인"}</Text>
//           </TouchableOpacity>

//           {/* 내정보 / 회원가입 */}
//           <View style={styles.infoRow}>
//             <TouchableOpacity style={styles.infoBtn} onPress={goProfile}>
//               <Text style={styles.infoBtnText}>내 정보</Text>
//             </TouchableOpacity>
//             <Text style={styles.infoDivider}>|</Text>
//             <TouchableOpacity style={styles.infoBtn} onPress={goRegister}>
//               <Text style={styles.infoBtnText}>회원가입</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* 메뉴 리스트 */}
//       <View style={styles.menuContainer}>
//         <TouchableOpacity style={styles.menuButton} onPress={goOrders}>
//           <Text style={styles.menuText}>구매 내역</Text>
//           <Ionicons name="chevron-forward" size={20} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuButton}>
//           <Text style={styles.menuText}>알림</Text>
//           <Ionicons name="chevron-forward" size={20} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuButton} onPress={goSupport}>
//           <Text style={styles.menuText}>응원 구단</Text>
//           <Ionicons name="chevron-forward" size={20} color="#fff" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.menuButton} onPress={goContact}>
//           <Text style={styles.menuText}>문의사항</Text>
//           <Ionicons name="chevron-forward" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* 로그아웃 / 로그인 유도 */}
//       <TouchableOpacity style={styles.logoutContainer}>
//         <Text style={styles.logoutText}>로그아웃</Text>
//       </TouchableOpacity>

//       {/* 로그인 필요 모달 */}
//       <Modal transparent visible={showLoginAlert} animationType="fade">
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalBox}>
//             <Ionicons name="lock-closed-outline" size={36} color={Colors.primary} style={{ marginBottom: 10 }} />
//             <Text style={styles.modalTitle}>로그인이 필요합니다</Text>
//             <Text style={styles.modalText}>이 기능은 로그인 후 이용 가능합니다.</Text>
//             <View style={styles.modalBtnRow}>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: "#333" }]}
//                 onPress={() => setShowLoginAlert(false)}
//               >
//                 <Text style={styles.modalBtnText}>취소</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: Colors.primary }]}
//                 onPress={() => {
//                   setShowLoginAlert(false);
//                   goLogin();
//                 }}
//               >
//                 <Text style={[styles.modalBtnText, { color: "#fff" }]}>로그인</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // ================== STYLE ===================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", alignItems: "center", paddingTop: 40 },
//   profileContainer: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginLeft: 30, marginBottom: 10 },
//   profileCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#d9d9d9", marginRight: 15 },
//   profileRight: { flexDirection: "column", justifyContent: "center" },
//   loginButton: { backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, alignSelf: "flex-start" },
//   loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },

//   infoRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
//   infoBtn: { height: 28, paddingHorizontal: 3, borderRadius: 6, justifyContent: "center", alignItems: "center" },
//   infoBtnText: { color: "#fff", fontSize: 15, fontWeight: "500", lineHeight: 18 },
//   infoDivider: { color: "#fff", marginHorizontal: 8, fontSize: 16, lineHeight: 28 },

//   menuContainer: { width: "90%", marginTop: 25, marginBottom: 20 },
//   menuButton: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#111",
//     borderRadius: 10,
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     marginBottom: 12,
//   },
//   menuText: { color: "#fff", fontSize: 16 },

//   logoutContainer: { marginTop: 190 },
//   logoutText: { color: Colors.primary, fontSize: 16, fontWeight: "500" },

//   // 모달 스타일
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     width: "80%",
//     backgroundColor: "#1a1a1a",
//     borderRadius: 15,
//     padding: 25,
//     alignItems: "center",
//   },
//   modalTitle: { color: Colors.primary, fontSize: 18, fontWeight: "800", marginBottom: 6 },
//   modalText: { color: "#ddd", fontSize: 14, textAlign: "center", marginBottom: 20 },
//   modalBtnRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
//   modalBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginHorizontal: 4,
//     alignItems: "center",
//   },
//   modalBtnText: { color: "#ccc", fontWeight: "600", fontSize: 15 },
// });


// app/(tabs)/mypage.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";          // ✅ 추가
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAuthed = !!user;
  const displayName = user?.name || user?.email?.split("@")[0] || "회원";


  // ✅ Href 타입으로 지정 — string 금지
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
      {/* 프로필 영역 */}
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle} />
        <View style={styles.profileRight}>
          {!isAuthed ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/auth/login" as Href)}   // ✅
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
              onPress={() =>
                isAuthed
                  ? router.push("/mypage-pages/profile" as Href)
                  : router.push("/auth/login" as Href)
              }
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

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => goProtected("/mypage-pages/orders")}
        >
          <Text style={styles.menuText}>구매 내역</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => goProtected("/mypage-pages/notifications")}
        >
          <Text style={styles.menuText}>알림</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => goProtected("/mypage-pages/support")}
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
