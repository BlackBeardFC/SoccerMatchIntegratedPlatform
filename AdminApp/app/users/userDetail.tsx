import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SanctionModal from "./sanction";

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  lastLogin: string;
  totalOrders: number;
  totalAmount: number;
  status: "활성" | "비활성" | "강제탈퇴";
};

type Props = {
  visible: boolean;
  user: UserDetail | null;
  onClose: () => void;
  onEdit?: (user: UserDetail) => void;
  onChangeStatus?: (user: UserDetail) => void;
};

const UserDetailModal: React.FC<Props> = ({
  visible,
  user,
  onClose,
  onEdit,
  onChangeStatus,
}) => {
  const [localUser, setLocalUser] = useState<UserDetail | null>(user);
  const [isSanctionMode, setIsSanctionMode] = useState(false); // ✅ 제재 모드 여부

  // user가 바뀔 때마다 상세 정보 + 제재 모드 초기화
  useEffect(() => {
    setLocalUser(user);
    setIsSanctionMode(false);
  }, [user]);

  // 모달이 닫힐 때 제재 모드도 초기화
  useEffect(() => {
    if (!visible) {
      setIsSanctionMode(false);
    }
  }, [visible]);

  if (!localUser) return null;

  const handleStatusChange = (newStatus: UserDetail["status"]) => {
    const updatedUser: UserDetail = {
      ...localUser,
      status: newStatus,
    };

    setLocalUser(updatedUser);
    onChangeStatus?.(updatedUser);
    onEdit?.(updatedUser);
  };

  const getStatusBadgeStyle = () => {
    switch (localUser.status) {
      case "활성":
        return {
          container: [styles.statusBadge, { backgroundColor: "#DCFCE7" }],
          text: [styles.statusBadgeText, { color: "#16A34A" }],
        };
      case "비활성":
        return {
          container: [styles.statusBadge, { backgroundColor: "#FEF3C7" }],
          text: [styles.statusBadgeText, { color: "#D97706" }],
        };
      case "강제탈퇴":
        return {
          container: [styles.statusBadge, { backgroundColor: "#FEE2E2" }],
          text: [styles.statusBadgeText, { color: "#DC2626" }],
        };
      default:
        return {
          container: styles.statusBadge,
          text: styles.statusBadgeText,
        };
    }
  };

  const statusStyle = getStatusBadgeStyle();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* 헤더 */}
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>
              {isSanctionMode ? "계정 제재" : "사용자 상세 정보"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (isSanctionMode) {
                  setIsSanctionMode(false); // 제재 모드에서는 뒤로
                } else {
                  onClose(); // 기본 상세 화면에서는 닫기
                }
              }}
            >
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* ✅ 모드에 따라 내용 변경 */}
          {isSanctionMode ? (
            // ===== 계정 제재 화면 =====
            <SanctionModal
              currentStatus={localUser.status}
              onClose={() => setIsSanctionMode(false)}
              onApply={(newStatus) => {
                handleStatusChange(newStatus);
                setIsSanctionMode(false);
              }}
            />
          ) : (
            // ===== 기본 상세 화면 =====
            <>
              {/* 프로필 영역 */}
              <View style={styles.modalProfileSection}>
                <View style={styles.modalAvatar}>
                  <Ionicons name="person-outline" size={32} color="#2563EB" />
                </View>
                <Text style={styles.modalName}>{localUser.name}</Text>

                <View style={statusStyle.container}>
                  <Text style={statusStyle.text}>{localUser.status}</Text>
                </View>
              </View>

              {/* 기본 정보 */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>기본 정보</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>이메일:</Text>
                  <Text style={styles.infoValue}>{localUser.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>전화번호:</Text>
                  <Text style={styles.infoValue}>{localUser.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>가입일:</Text>
                  <Text style={styles.infoValue}>{localUser.joinedAt}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>최근 로그인:</Text>
                  <Text style={styles.infoValue}>{localUser.lastLogin}</Text>
                </View>
              </View>

              {/* 구매 정보 */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>구매 정보</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>총 주문 수:</Text>
                  <Text style={styles.infoValue}>
                    {localUser.totalOrders}건
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoValue, styles.infoValueAccent]}>
                    ₩{localUser.totalAmount.toLocaleString("ko-KR")}
                  </Text>
                </View>
              </View>

              {/* 하단 버튼 */}
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={onClose}
                >
                  <Text style={styles.modalSecondaryText}>닫기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={() => setIsSanctionMode(true)} // ✅ 여기서 제재 모드 ON
                >
                  <Text style={styles.modalPrimaryText}>계정 제재</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UserDetailModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  modalProfileSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#E0EDFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  modalSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
  },
  infoValueAccent: {
    color: "#2563EB",
    fontWeight: "700",
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 8,
    columnGap: 10,
    justifyContent: "flex-end",   // ★ 오른쪽 정렬
  },
  modalSecondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  modalPrimaryButton: {
    borderRadius: 999,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
