// app/mypage-pages/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // 표시용 기본 데이터 (나중에 백엔드/DB 값으로 교체하면 됨)
  const displayName = user?.name || user?.email?.split("@")[0] || "회원";
  const email = user?.email || "sample@example.com";

  const phone = "010-0000-0000";
  const birth = "2000-01-01";
  const socialProvider: "kakao" | "email" = "kakao";
  const emailVerified = true;

  const cardLast4 = "1234"; // **** **** **** 1234 이런 식
  const receiptEmail = email;
  const [paymentAlert, setPaymentAlert] = useState(true);

  const [bookingNotify, setBookingNotify] = useState(true);
  const [recommendNotify, setRecommendNotify] = useState(true);
  const [clubNotify, setClubNotify] = useState(true);
  const [promoNotify, setPromoNotify] = useState(true);

  const homeCity = "서울";
  const homeStadium = "검은수염 스타디움";

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    if (!logout) return;
    logout();
  };

  const handleDeleteAccount = () => {
    // TODO: 실제 회원 탈퇴 API 호출
    setShowDeleteModal(false);
    // 필요하다면 여기서 로그아웃 + 홈 이동 등 처리
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* [ 프로필 이미지 + 닉네임 ] / 이메일 · 전화번호 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={32} color="#000" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{displayName}님</Text>
            <Text style={styles.profileSub}>{email}</Text>
            <Text style={styles.profileSub}>{phone}</Text>

            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.profileEditButton}
                activeOpacity={0.85}
              >
                <Text style={styles.profileEditText}>프로필 이미지 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileRemoveButton}
                activeOpacity={0.85}
              >
                <Text style={styles.profileRemoveText}>이미지 제거</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ──────────────────── 1. 기본 프로필 정보 ──────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>기본 프로필 정보</Text>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>이름 / 닉네임</Text>
            <Text style={styles.rowValue}>{displayName}</Text>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>이메일 (로그인 아이디)</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>전화번호</Text>
            <Text style={styles.rowValue}>{phone}</Text>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>생년월일</Text>
            <Text style={styles.rowValue}>{birth}</Text>
          </View>
        </View>

        {/* ─────── 2. 계정 정보 관련 ─────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>계정 정보</Text>

          {/* 비밀번호 변경 */}
          <TouchableOpacity style={styles.rowButton} activeOpacity={0.8}>
            <View style={styles.rowButtonLeft}>
              <Ionicons name="lock-closed-outline" size={18} color="#fff" />
              <Text style={styles.rowButtonText}>비밀번호 변경</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          {/* 소셜 계정 표시 */}
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>로그인 방식</Text>
            <View style={styles.socialBadge}>
              {socialProvider === "kakao" ? (
                <Text style={styles.socialBadgeText}>KAKAO 계정으로 로그인</Text>
              ) : (
                <Text style={styles.socialBadgeText}>이메일 로그인</Text>
              )}
            </View>
          </View>

          {/* 이메일 인증 여부 */}
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>이메일 인증</Text>
            <View style={styles.emailStatusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: emailVerified ? "#22c55e" : "#f97316" },
                ]}
              />
              <Text style={styles.emailStatusText}>
                {emailVerified ? "인증 완료" : "미인증"}
              </Text>
              {!emailVerified && (
                <TouchableOpacity style={styles.resendButton}>
                  <Text style={styles.resendText}>재전송</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* ─────── 3. 결제/이용 정보 ─────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>결제 / 이용 정보</Text>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>등록된 결제 수단</Text>
            <Text style={styles.rowValue}>
              {cardLast4
                ? `**** **** **** ${cardLast4}`
                : "등록된 카드가 없습니다"}
            </Text>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>영수증 이메일</Text>
            <Text style={styles.rowValue}>{receiptEmail}</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingLabel}>결제 알림</Text>
              <Text style={styles.settingSub}>
                결제 완료 / 취소, 환불 처리 알림
              </Text>
            </View>
            <Switch
              value={paymentAlert}
              onValueChange={setPaymentAlert}
              thumbColor={paymentAlert ? Colors.primary : "#555"}
            />
          </View>
        </View>

        {/* ─────── 4. 알림 설정 ─────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <View className="push">
            <View style={styles.settingRow}>
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>예매 완료 알림</Text>
                <Text style={styles.settingSub}>
                  예매/취소 완료 시 푸시 알림
                </Text>
              </View>
              <Switch
                value={bookingNotify}
                onValueChange={setBookingNotify}
                thumbColor={bookingNotify ? Colors.primary : "#555"}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>추천 경기 알림</Text>
                <Text style={styles.settingSub}>
                  선호 구단/지역 기반 맞춤 경기 추천
                </Text>
              </View>
              <Switch
                value={recommendNotify}
                onValueChange={setRecommendNotify}
                thumbColor={recommendNotify ? Colors.primary : "#555"}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>응원 구단 경기 시작 알림</Text>
                <Text style={styles.settingSub}>
                  응원 구단 경기 시작 전 리마인드
                </Text>
              </View>
              <Switch
                value={clubNotify}
                onValueChange={setClubNotify}
                thumbColor={clubNotify ? Colors.primary : "#555"}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextBox}>
                <Text style={styles.settingLabel}>이벤트 / 프로모션 알림</Text>
                <Text style={styles.settingSub}>
                  참여형 이벤트, 할인 혜택, 프로모션 소식
                </Text>
              </View>
              <Switch
                value={promoNotify}
                onValueChange={setPromoNotify}
                thumbColor={promoNotify ? Colors.primary : "#555"}
              />
            </View>
          </View>
        </View>

        {/* ─────── 5. 위치 정보 / 홈 구장 설정 ─────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>위치 / 홈 구장 설정</Text>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>기본 도시</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{homeCity}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>홈 구장</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{homeStadium}</Text>
            </View>
          </View>

          <Text style={styles.locationHint}>
            홈 구장 기준으로 가까운 경기, 추천 경기가 먼저 노출됩니다.
          </Text>
        </View>

        {/* ─────── 6. 계정 삭제 ─────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>계정 삭제</Text>
          <Text style={styles.sectionDescription}>
            회원 탈퇴 시 예매 내역, 응원 구단, 개인화 데이터 등이 삭제되며 복구할
            수 없습니다.
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.85}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>

        {/* 로그아웃 버튼은 맨 아래에 살짝 */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 계정 삭제 안내 모달 */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>정말 탈퇴하시겠습니까?</Text>
            <Text style={styles.modalBody}>
              회원 탈퇴 시 아래 정보가 영구적으로 삭제됩니다.
              {"\n\n"}
              · 예매 내역 및 이용 기록{"\n"}
              · 응원 구단 및 개인화 추천 정보{"\n"}
              · 알림 및 프로모션 설정{"\n\n"}
              탈퇴 후에는 계정을 복구할 수 없습니다.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalDeleteText}>탈퇴 진행</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 상단 프로필 영역
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  profileName: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
  },
  profileSub: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  profileActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
    flexWrap: "wrap",
  },
  profileEditButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  profileEditText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  profileRemoveButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#555",
  },
  profileRemoveText: {
    color: "#ccc",
    fontSize: 11,
  },

  // 공통 카드
  sectionCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionDescription: {
    color: "#a3a3a3",
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 18,
  },

  // 일반 row
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowLabel: {
    color: "#b5b5b8",
    fontSize: 13,
  },
  rowValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // 버튼 row
  rowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 4,
  },
  rowButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  // 소셜 뱃지
  socialBadge: {
    backgroundColor: "#facc15",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  socialBadgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "700",
  },

  // 이메일 인증 상태
  emailStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emailStatusText: {
    color: "#fff",
    fontSize: 12,
  },
  resendButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#555",
  },
  resendText: {
    color: "#ccc",
    fontSize: 11,
  },

  // 설정 row
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  settingTextBox: {
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  settingSub: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },

  // 위치 힌트
  locationHint: {
    color: "#777",
    fontSize: 11,
    marginTop: 6,
  },

  // 계정 삭제 버튼
  deleteButton: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f87171",
    paddingVertical: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: "600",
  },

  // 로그아웃 버튼
  logoutButton: {
    alignSelf: "center",
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  logoutText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  // 모달
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "82%",
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalBody: {
    color: "#ddd",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
  },
  modalCancelButton: {
    backgroundColor: "#222",
  },
  modalDeleteButton: {
    backgroundColor: "#7f1d1d",
  },
  modalCancelText: {
    color: "#e5e5e5",
    fontSize: 12,
  },
  modalDeleteText: {
    color: "#fecaca",
    fontSize: 12,
    fontWeight: "700",
  },
});
