import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;

  // 어떤 문의에 대한 답변인지 표시용
  inquiryTitle: string;
  inquiryContent: string;

  // 실제 저장/전송은 부모에서 처리
  onSubmit: (answerText: string) => void;
};

export default function AnswerModal({
  visible,
  onClose,
  inquiryTitle,
  inquiryContent,
  onSubmit,
}: Props) {
  const [answer, setAnswer] = useState("");

  // 모달 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (visible) {
      setAnswer("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!answer.trim()) {
      // 간단한 클라이언트 체크 (원하면 Alert로 변경 가능)
      return;
    }
    onSubmit(answer.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* 바깥 클릭 시 닫기 */}
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 실제 팝업 카드 */}
        <View style={styles.card}>
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>문의 답변 작성</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 문의 정보 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>문의 제목</Text>
            <Text style={styles.sectionText} numberOfLines={2}>
              {inquiryTitle}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>문의 내용</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{inquiryContent}</Text>
            </View>
          </View>

          {/* 관리자 답변 입력 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>답변 내용</Text>
            <TextInput
              style={styles.answerInput}
              value={answer}
              onChangeText={setAnswer}
              placeholder="문의에 대한 답변을 입력해주세요."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonBase,
                styles.submitButton,
                !answer.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!answer.trim()}
            >
              <Text style={styles.submitButtonText}>답변 등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    width: "88%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  contentBox: {
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  contentText: {
    fontSize: 13,
    color: "#4B5563",
  },
  answerInput: {
    marginTop: 4,
    minHeight: 100,
    maxHeight: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    columnGap: 8,
  },
  buttonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#2563EB",
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitButtonText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
