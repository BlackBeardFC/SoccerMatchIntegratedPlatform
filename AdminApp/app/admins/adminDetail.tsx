import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type AdminDetailData = {
  id: string;
  name: string;
  email: string;
  post?: string;
  role?: "관리자" | "마스터";
  createdAt?: string;
  lastLoginAt?: string;
  memo?: string;
};

type AdminDetailModalProps = {
  visible: boolean;
  admin: AdminDetailData | null;
  onClose: () => void;
  onSave: (updated: AdminDetailData) => void;
};

const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  visible,
  admin,
  onClose,
  onSave,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<AdminDetailData | null>(admin);

  // 각 인풋 포커스 이동용 ref
  const emailRef = useRef<TextInput | null>(null);
  const postRef = useRef<TextInput | null>(null);
  const memoRef = useRef<TextInput | null>(null);

  useEffect(() => {
    setForm(admin);
    setEditMode(false);
  }, [admin, visible]);

  const noTarget = !form;

  const handleTextChange = (
    key: "name" | "email" | "post" | "memo",
    value: string
  ) => {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev
    );
  };

  const handleConfirm = () => {
    if (editMode && form) {
      onSave(form);
    }
    setEditMode(false);
    Keyboard.dismiss(); // 저장 후 키보드만 내려가고, 모달은 유지 (상세 모드로 확인 가능)
  };

  const handleEdit = () => {
    if (!form) return;
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setForm(admin ?? null);
    setEditMode(false);
    Keyboard.dismiss();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const roleLabel = form?.role ?? "관리자";

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>관리자 상세정보</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {noTarget ? (
            <View style={{ paddingVertical: 20 }}>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>
                선택된 관리자 정보가 없습니다.
              </Text>
            </View>
          ) : (
            <>
              {/* 프로필 영역 */}
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={26} color="#16A34A" />
                </View>

                <View>
                  {/* 이름 + 역할 태그 한 줄 */}
                  <View style={styles.nameRow}>
                    {/* ✅ 이름은 항상 수정 불가 */}
                    <Text style={styles.nameText}>{form.name}</Text>

                    <View style={styles.roleTag}>
                      <Text style={styles.roleTagText}>{roleLabel}</Text>
                    </View>
                  </View>

                  {/* 권한 선택: 수정 모드에서만 노출 */}
                  {editMode && (
                    <View style={styles.roleSelectRow}>
                      <TouchableOpacity
                        style={[
                          styles.roleOption,
                          roleLabel === "관리자" && styles.roleOptionActive,
                        ]}
                        onPress={() =>
                          setForm((prev) =>
                            prev ? { ...prev, role: "관리자" } : prev
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.roleOptionText,
                            roleLabel === "관리자" &&
                              styles.roleOptionTextActive,
                          ]}
                        >
                          관리자
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.roleOption,
                          roleLabel === "마스터" && styles.roleOptionActive,
                        ]}
                        onPress={() =>
                          setForm((prev) =>
                            prev ? { ...prev, role: "마스터" } : prev
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.roleOptionText,
                            roleLabel === "마스터" &&
                              styles.roleOptionTextActive,
                          ]}
                        >
                          마스터
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* 기본정보 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>기본정보</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>e-mail</Text>
                  {editMode ? (
                    <TextInput
                      ref={emailRef}
                      style={[styles.infoInput, styles.infoInputBox]}
                      value={form.email}
                      onChangeText={(t) => handleTextChange("email", t)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={editMode}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{form.email}</Text>
                  )}
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>포스트</Text>
                  {editMode ? (
                    <TextInput
                      ref={postRef}
                      style={[styles.infoInput, styles.infoInputBox]}
                      value={form.post ?? ""}
                      onChangeText={(t) => handleTextChange("post", t)}
                      editable={editMode}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {form.post ?? "미지정"}
                    </Text>
                  )}
                </View>
              </View>

              {/* 계정활동 (읽기 전용) */}
              <View style={[styles.section, styles.activitySection]}>
                <Text style={styles.sectionTitle}>계정활동</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>등록일</Text>
                  <Text style={styles.infoValue}>
                    {form.createdAt ?? "-"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>최근 로그인</Text>
                  <Text style={styles.infoValue}>
                    {form.lastLoginAt ?? "-"}
                  </Text>
                </View>
              </View>

              {/* 메모 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>메모</Text>
                <TextInput
                  ref={memoRef}
                  style={styles.memoInput}
                  placeholder="메모를 입력하세요"
                  placeholderTextColor="#9CA3AF"
                  value={form.memo ?? ""}
                  onChangeText={(t) => handleTextChange("memo", t)}
                  multiline
                  textAlignVertical="top"
                  editable={editMode}
                  returnKeyType="done"
                  blurOnSubmit
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                />
              </View>
            </>
          )}

          {/* 하단 버튼 */}
          <View style={styles.buttonRow}>
            {editMode ? (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleConfirm}
                >
                  <Text style={styles.saveText}>저장</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.editText}>수정</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleClose}
                >
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdminDetailModal;

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
    paddingVertical: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    marginBottom: 4,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    marginLeft: 4,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B30E29",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  roleSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
  },
  roleOption: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F9FAFB",
  },
  roleOptionActive: {
    backgroundColor: "#E5EDFF",
    borderColor: "#2563EB",
  },
  roleOptionText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  roleOptionTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  section: {
    marginTop: 10,
  },
  activitySection: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
  },
  infoInput: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#111827",
  },
  infoInputBox: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 110,
    maxWidth: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  memoInput: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 80,
    fontSize: 13,
    color: "#111827",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    columnGap: 8,
  },
  confirmButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  editButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#2563EB",
  },
  saveText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
