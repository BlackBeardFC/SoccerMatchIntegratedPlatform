import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MASTER_PASSWORD = "1234";

type AuthModalProps = {
  visible: boolean;
  onSuccess: () => void; // 비번 성공
  onCancel: () => void;  // 취소(뒤로가기)
};

const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleConfirm = () => {
    if (password === MASTER_PASSWORD) {
      setErrorText("");
      setPassword("");
      onSuccess();
    } else {
      setErrorText("마스터 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* 반투명 오버레이 */}
      <View style={styles.overlay}>
        {/* 가운데 카드 */}
        <View style={styles.card}>
          {/* ✖ 닫기 버튼 (오른쪽 상단 고정) */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Ionicons name="close" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          {/* 🔒 동그란 배경 + 잠금 아이콘 (상단 중앙) */}
          <View style={styles.lockWrapper}>
            <View style={styles.lockCircle}>
              <Ionicons
                name="lock-closed-outline"
                size={26}
                color="#2563EB"
              />
            </View>
          </View>

          {/* 텍스트 영역 */}
          <Text style={styles.title}>마스터 관리자 전용</Text>
          <Text style={styles.subtitle}>
            관리자 관리 페이지에 접근하려면{"\n"}
            마스터 비밀번호를 입력해주세요.
          </Text>

          {/* 입력 영역 */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errorText) setErrorText("");
              }}
              placeholder="마스터 비밀번호를 입력하세요"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
            />
          </View>

          {errorText ? (
            <Text style={styles.errorText}>{errorText}</Text>
          ) : null}

          {/* 버튼 영역 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onCancel}
            >
              <Text style={styles.secondaryButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConfirm}
            >
              <Text style={styles.primaryButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AuthModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    position: "relative",
  },
  // ✖ 아이콘 위치 (오른쪽 상단)
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
    zIndex: 10,
  },
  // 🔒 아이콘 전체 영역
  lockWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  lockCircle: {
    width: 45,
    height: 45,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 18,
  },
  inputRow: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
    marginLeft: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginBottom: 4,
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 8,
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: "#F3F4F6",
  },
  secondaryButtonText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
