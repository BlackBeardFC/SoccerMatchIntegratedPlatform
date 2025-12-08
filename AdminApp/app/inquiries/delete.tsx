import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  visible,
  title = "문의 삭제",
  message,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        {/* 팝업 카드 */}
        <View style={styles.card}>
          {/* 제목 */}
          <Text style={styles.titleText}>{title}</Text>

          {/* 설명 */}
          <Text style={styles.messageText}>{message}</Text>

          {/* 버튼 영역 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonBase, styles.deleteButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  card: {
    width: "82%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
  },
  buttonBase: {
    minWidth: 80,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  cancelText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  deleteText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
