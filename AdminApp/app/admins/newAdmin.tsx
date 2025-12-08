import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type NewAdminFormValues = {
  name: string;
  email: string;
  post: string;
  role: "관리자" | "마스터";
};

type NewAdminModalProps = {
  visible: boolean;
  onClose: () => void; // 취소 / X
  onSubmit: (values: NewAdminFormValues) => void; // 등록됨
};

const NewAdminModal: React.FC<NewAdminModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [post, setPost] = useState("");
  const [role, setRole] = useState<"관리자" | "마스터">("관리자");
  const [roleOpen, setRoleOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      post,
      role,
    });

    // 전송 후 초기화
    setName("");
    setEmail("");
    setPost("");
    setRole("관리자");
    setRoleOpen(false);
  };

  const handleClose = () => {
    setRoleOpen(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            {/* 헤더: 타이틀 + X 버튼 */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>관리자 등록</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* 이름 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="관리자 이름"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* 이메일 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="이메일 주소"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 포스트 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>포스트</Text>
              <TextInput
                style={styles.input}
                placeholder="포스트"
                placeholderTextColor="#9CA3AF"
                value={post}
                onChangeText={setPost}
              />
            </View>

            {/* 권한 드롭다운 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>권한</Text>

              {/* 선택 박스 */}
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setRoleOpen((prev) => !prev)}
                activeOpacity={0.8}
              >
                <Text style={styles.selectText}>{role}</Text>
                <Ionicons
                  name={roleOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#4B5563"
                />
              </TouchableOpacity>

              {/* 옵션 리스트 */}
              {roleOpen && (
                <View style={styles.optionList}>
                  {(["관리자", "마스터"] as const).map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.optionItem}
                      onPress={() => {
                        setRole(item);
                        setRoleOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          role === item && styles.optionTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 버튼 영역 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>등록됨</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NewAdminModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  closeBtn: {
    padding: 4,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectText: {
    fontSize: 14,
    color: "#111827",
  },
  optionList: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
    color: "#4B5563",
  },
  optionTextActive: {
    fontWeight: "600",
    color: "#2563EB",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
    columnGap: 8,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
