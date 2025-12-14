import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export default function MyInfoScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // 🔹 프로필 (추후 AuthContext/백엔드 연결)
  // const name = "진영문";
  // const nickname = "검은수염팬";
  // const email = "blackbeard@example.com";

  // 🔹 결제 정보 (추후 실제 카드 등록 여부와 연동)
  const hasCard = !!user.hasCard;
  const cardName = user.cardBrand ?? "등록된 카드 없음";
  const cardLast4 = user.cardLast4 ?? "";

  // 🔹 알림 토글 상태
  const [bookingAlert, setBookingAlert] = useState(true);
  const [recommendAlert, setRecommendAlert] = useState(true);
  const [eventAlert, setEventAlert] = useState(true);

  const handleEditProfile = () => {
    // TODO: 내정보 디테일/수정 페이지 라우트 연결
    router.push("/mypage-pages/profile-detail");
    console.log("내 정보 수정 화면으로 이동 (라우트 연결 예정)");
  };

  const handleManageCard = () => {
    // 카드 등록
    router.push("/mypage-pages/profile-detail-add-card");
    // 예: router.push("/payment/add-card");
  };

  const handleLogout = () => {
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
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "내 정보",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          contentStyle: { backgroundColor: "#000" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* 1. 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileImageWrapper}>
              {user.profileImageUri ? (
                <Image
                  source={{ uri: user.profileImageUri }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileEmptyCircle}>
                  <Ionicons name="person" size={28} color="#555" />
                </View>
              )}
            </View>

            <View style={styles.profileTextWrapper}>
              <Text style={styles.profileName}>
                {user.name}
                {user.nickname ? ` (${user.nickname})` : ""}
              </Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>내 정보 수정</Text>
          </TouchableOpacity>
        </View>

        {/* 2. 결제 섹션 */}
        <View style={styles.sectionCard}>
          <SectionTitle title="결제" />

          {hasCard ? (
            <View style={styles.rowBetween}>
              <View>
              <Text style={styles.sectionLabel}>등록된 카드</Text>
              <Text style={styles.sectionValue}>
                {cardName} {cardLast4 ? `• • • • ${cardLast4}` : ""}
              </Text>
            </View>
            <TouchableOpacity
                style={styles.smallButton}
                onPress={handleManageCard}
              >
                <Text style={styles.smallButtonText}>카드 관리</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.rowBetween}>
              <Text style={styles.sectionEmptyText}>
                등록된 카드가 없습니다.
              </Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleManageCard}
              >
                <Text style={styles.smallButtonText}>카드 등록</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3. 알림 설정 섹션 */}
        <View style={styles.sectionCard}>
          <SectionTitle title="알림 설정" />

          <SettingToggle
            label="예매 완료 알림"
            value={bookingAlert}
            onValueChange={setBookingAlert}
          />
          <SettingToggle
            label="추천 경기 알림"
            value={recommendAlert}
            onValueChange={setRecommendAlert}
          />
          <SettingToggle
            label="이벤트 및 프로모션 알림"
            value={eventAlert}
            onValueChange={setEventAlert}
            isLast
          />
        </View>

        {/* 4. 계정 섹션 */}
        <View style={styles.sectionCard}>
          <SectionTitle title="계정" />

          <TouchableOpacity style={styles.accountRow} onPress={handleLogout}>
            <Text style={styles.accountText}>로그아웃</Text>
          </TouchableOpacity>
{/* 
          <TouchableOpacity
            style={[styles.accountRow, styles.accountRowLast]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.accountDeleteText}>계정 탈퇴</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </>
  );
};

type SettingToggleProps = {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
};

const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  value,
  onValueChange,
  isLast,
}) => (
  <View
    style={[
      styles.toggleRow,
      !isLast && {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(255,255,255,0.08)",
      },
    ]}
  >
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#555555", true: "#b30e29" }}
      thumbColor="#ffffff"
    />
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionTitleWrapper}>
    <View style={styles.sectionAccent} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#b30e29",
    overflow: "hidden",
    marginRight: 14,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileEmptyCircle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2c",
  },
  profileTextWrapper: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 12,
    color: "#9a9a9a",
    marginTop: 4,
  },
  editButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#b30e29",
  },
  editButtonText: {
    fontSize: 12,
    color: "#b30e29",
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    borderRadius: 3,
    backgroundColor: "#b30e29",
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#c5c5c5",
  },
  sectionValue: {
    fontSize: 13,
    color: "#ffffff",
  },
  sectionEmptyText: {
    fontSize: 13,
    color: "#9a9a9a",
  },
  smallButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#b30e29",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallButtonText: {
    fontSize: 12,
    color: "#b30e29",
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 14,
    color: "#ffffff",
  },
  accountRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  accountRowLast: {
    borderBottomWidth: 0,
  },
  accountText: {
    fontSize: 14,
    color: "#ffffff",
  },
  accountDeleteText: {
    fontSize: 14,
    color: "#ff4e4e",
    fontWeight: "600",
  },
});