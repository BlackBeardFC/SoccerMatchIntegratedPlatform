import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type DeleteConfirmModalProps = {
  visible: boolean;
  targetName?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  targetName,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>관리자 삭제</Text>
          <Text style={styles.message}>
            {targetName
              ? `${targetName} 관리자를 삭제하시겠습니까?`
              : "이 관리자를 삭제하시겠습니까?"}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
