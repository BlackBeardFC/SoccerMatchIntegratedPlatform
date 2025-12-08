import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AuthModal from "./auth";
import NewAdmin, { NewAdminFormValues } from "./newAdmin";
import AdminDetail, { AdminDetailData } from "./adminDetail";
import Delete from "./delete";

let deleteLock = false;

type AdminUser = {
  id: string;
  name: string;
  email: string;
  post?: string;
  role?: "관리자" | "마스터";
  createdAt?: string;
  lastLoginAt?: string;
  memo?: string;
};

const INITIAL_ADMIN_LIST: AdminUser[] = [
  { id: "1", name: "관리자 1", email: "manager1@example.com", role: "관리자", createdAt: "2025-01-01" },
  { id: "2", name: "관리자 2", email: "manager2@example.com", role: "마스터", createdAt: "2025-01-02" },
  { id: "3", name: "관리자 3", email: "manager3@example.com", role: "관리자", createdAt: "2025-01-03" },
];

// 한 줄 관리자 카드
type AdminRowProps = {
  admin: AdminUser;
  onPressDetail: () => void;
  onPressDelete: () => void;
};

const AdminRow: React.FC<AdminRowProps> = ({
  admin,
  onPressDetail,
  onPressDelete,
}) => {
  return (
    <View style={styles.adminCard}>
      <View style={styles.leftArea}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            <Ionicons name="person-outline" size={26} color="#16A34A" />
          </Text>
        </View>
        <View>
          <Text style={styles.adminName}>{admin.name}</Text>
          <Text style={styles.adminEmail}>{admin.email}</Text>
        </View>
      </View>

      <View style={styles.rightButtons}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onPressDelete}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={onPressDetail}
        >
          <Text style={styles.detailButtonText}>상세</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdminsScreen: React.FC = () => {
  const router = useRouter();

  // 비밀번호 인증
  const [authVisible, setAuthVisible] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // 관리자 목록
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMIN_LIST);

  // 상세보기
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailTarget, setDetailTarget] = useState<AdminUser | null>(null);

  // 새 관리자 등록
  const [registerVisible, setRegisterVisible] = useState(false);

  // 삭제 모달
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const openDeleteConfirm = (admin: AdminUser) => {
    setDeleteTarget(admin);
    setDeleteConfirmVisible(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmVisible(false);
    setDeleteTarget(null);
  };

  const confirmDelete = () => {
    if (deleteLock) return;
    deleteLock = true;

    if (deleteTarget) {
      setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    }

    closeDeleteConfirm();

    setTimeout(() => {
      deleteLock = false;
    }, 0);
  };

  // 새 관리자 등록 완료
  const handleRegisterSubmit = (values: NewAdminFormValues) => {
    const newAdmin: AdminUser = {
      id: String(Date.now()), // 간단한 유니크 id
      name: values.name || "새 관리자",
      email: values.email || "email@example.com",
      post: values.post,
      role: values.role,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLoginAt: "-",
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setRegisterVisible(false);
  };

  // 상세 모달로 넘길 데이터
  const detailData: AdminDetailData | null = detailTarget
    ? {
        id: detailTarget.id,
        name: detailTarget.name,
        email: detailTarget.email,
        post: detailTarget.post,
        role: detailTarget.role,
        createdAt: detailTarget.createdAt,
        lastLoginAt: detailTarget.lastLoginAt,
        memo: detailTarget.memo,
      }
    : null;

  // FlatList 렌더
  const renderAdminItem = ({ item }: { item: AdminUser }) => (
    <AdminRow
      admin={item}
      onPressDetail={() => {
        setDetailTarget(item);
        setDetailVisible(true);
      }}
      onPressDelete={() => openDeleteConfirm(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {authorized ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => setRegisterVisible(true)}
          >
            <Text style={styles.registerButtonText}>관리자 등록</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>등록된 관리자</Text>

          <FlatList
            data={admins}
            keyExtractor={(item) => item.id}
            renderItem={renderAdminItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.lockedBackground} />
      )}

      {/* 🔐 비밀번호 모달 */}
      <AuthModal
        visible={authVisible}
        onSuccess={() => {
          setAuthorized(true);
          setAuthVisible(false);
        }}
        onCancel={() => {
          setAuthVisible(false);
          router.back();
        }}
      />

      {/* 👤 새 관리자 등록 모달 */}
      <NewAdmin
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        onSubmit={handleRegisterSubmit}
      />

      {/* 🔎 관리자 상세보기 모달 */}
      <AdminDetail
        visible={detailVisible}
        admin={detailData}
        onClose={() => setDetailVisible(false)}
        onSave={(updated) => {
          if (!updated.id) return;
          setAdmins((prev) => prev.map((a) => a.id === updated.id ? { ...a, ...updated } : a )
          );
        }}
      />

      {/* 🗑 삭제 확인 모달 */}
      <Delete
        visible={deleteConfirmVisible}
        targetName={deleteTarget?.name}
        onCancel={closeDeleteConfirm}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
};

export default AdminsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  lockedBackground: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  registerButton: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },

  // 관리자 카드
  adminCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  leftArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16A34A",
  },
  adminName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  adminEmail: {
    fontSize: 12,
    color: "#6B7280",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 12,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#E5EDFF",
    marginLeft: 8, // 삭제/상세 사이 간격
  },
  detailButtonText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
});
