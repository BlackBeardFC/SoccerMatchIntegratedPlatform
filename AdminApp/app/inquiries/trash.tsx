import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

type DeletedInquiry = {
  id: string;
  date: string;
  title: string;
  content: string;
  deletedAt: string;
};

const INITIAL_TRASH: DeletedInquiry[] = [
  {
    id: "101",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
    deletedAt: "2025.01.20",
  },
  {
    id: "102",
    date: "2025.01.16",
    title: "결제 오류 문의",
    content: "결제 중 오류가 발생했습니다.",
    deletedAt: "2025.01.21",
  },
];

// 🔹 휴지통 전용 확인 모달 (복원 / 영구 삭제 공용으로 사용)
type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor = "#EF4444",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.modalButtonBase, styles.modalCancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButtonBase,
                { backgroundColor: confirmColor },
              ]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function InquiryTrashScreen() {
  const [trash, setTrash] = useState<DeletedInquiry[]>(INITIAL_TRASH);

  // 어떤 동작 확인 중인지 (복원 / 영구 삭제)
  const [mode, setMode] = useState<"restore" | "delete" | null>(null);
  const [target, setTarget] = useState<DeletedInquiry | null>(null);

  const askRestore = (item: DeletedInquiry) => {
    setTarget(item);
    setMode("restore");
  };

  const askDeleteForever = (item: DeletedInquiry) => {
    setTarget(item);
    setMode("delete");
  };

  const handleCancel = () => {
    setMode(null);
    setTarget(null);
  };

  const handleConfirm = () => {
    if (!target || !mode) return;

    if (mode === "restore") {
      // ✅ 복원: 일단 휴지통에서 제거
      // TODO: 나중에 문의 목록 페이지로 실제 복원 (전역 상태/백엔드 연동)
      setTrash((prev) => prev.filter((q) => q.id !== target.id));
      console.log("복원된 문의:", target);
    } else {
      // ✅ 영구 삭제: 휴지통에서 완전히 제거 (다시 볼 수 없음)
      setTrash((prev) => prev.filter((q) => q.id !== target.id));
      console.log("영구 삭제된 문의:", target);
    }

    setMode(null);
    setTarget(null);
  };

  const renderItem = ({ item }: { item: DeletedInquiry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>삭제됨</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.contentText} numberOfLines={2}>
        {item.content}
      </Text>

      <Text style={styles.deletedAtText}>삭제일: {item.deletedAt}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={() => askRestore(item)}
        >
          <Text style={styles.restoreText}>복원</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => askDeleteForever(item)}
        >
          <Text style={styles.deleteText}>영구 삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const showConfirm = !!mode && !!target;
  const confirmTitle =
    mode === "restore" ? "문의 복원" : "문의 영구 삭제";
  const confirmMessage =
    mode === "restore"
      ? `"${target?.title}" 문의를 복원하시겠습니까?`
      : `"${target?.title}" 문의를 영구 삭제하시겠습니까?\n복원할 수 없습니다.`;
  const confirmLabel = mode === "restore" ? "복원" : "삭제";
  const confirmColor = mode === "restore" ? "#2563EB" : "#EF4444";

  return (
    <>
      <Stack.Screen
        options={{
          title: "휴지통",
        }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {trash.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>휴지통이 비어있어요</Text>
              <Text style={styles.emptyText}>
                삭제한 문의가 여기 모여요.{"\n"}
                필요 없다면 영구 삭제할 수 있어요.
              </Text>
            </View>
          ) : (
            <FlatList
              data={trash}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* 복원 / 영구 삭제 확인 모달 */}
        <ConfirmModal
          visible={showConfirm}
          title={confirmTitle}
          message={confirmMessage}
          confirmLabel={confirmLabel}
          confirmColor={confirmColor}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  deletedAtText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8,
  },
  restoreButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  restoreText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
  deleteText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },

  // 모달 공통 스타일
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalCard: {
    width: "82%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  modalButtonBase: {
    minWidth: 80,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F3F4F6",
  },
  modalCancelText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  modalConfirmText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
