import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  lastLogin: string;
  totalOrders: number;
  totalAmount: number;
  status: "활성" | "비활성";
};

type Props = {
  visible: boolean;
  user: UserDetail | null;
  onClose: () => void;
  onEdit?: (user: UserDetail) => void;
};

const UserDetailModal: React.FC<Props> = ({ visible, user, onClose, onEdit }) => {
  if (!user) return null;

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
            <Text style={styles.modalTitle}>사용자 상세 정보</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 프로필 영역 */}
          <View style={styles.modalProfileSection}>
            <View style={styles.modalAvatar}>
              <Ionicons name="person-outline" size={32} color="#2563EB" />
            </View>
            <Text style={styles.modalName}>{user.name}</Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{user.status}</Text>
            </View>
          </View>

          {/* 기본 정보 */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>기본 정보</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이메일:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>전화번호:</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>가입일:</Text>
              <Text style={styles.infoValue}>{user.joinedAt}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>최근 로그인:</Text>
              <Text style={styles.infoValue}>{user.lastLogin}</Text>
            </View>
          </View>

          {/* 구매 정보 */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>구매 정보</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>총 주문 수:</Text>
              <Text style={styles.infoValue}>{user.totalOrders}건</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>총 구매 금액:</Text>
              <Text style={[styles.infoValue, styles.infoValueAccent]}>
                ₩{user.totalAmount.toLocaleString("ko-KR")}
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
              onPress={() => onEdit && onEdit(user)}
            >
              <Text style={styles.modalPrimaryText}>수정</Text>
            </TouchableOpacity>
          </View>
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
  },
  modalSecondaryButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
