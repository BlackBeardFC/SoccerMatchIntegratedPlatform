// app/admins/index.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type AdminUser = {
  id: string;
  name: string;
  email: string;
};

const ADMIN_LIST: AdminUser[] = [
  { id: "1", name: "관리자 1", email: "관리자 1 @example.com" },
  { id: "2", name: "관리자 2", email: "관리자 2 @example.com" },
  { id: "3", name: "관리자 3", email: "관리자 3 @example.com" },
];

export default function AdminsScreen() {
  const renderAdminItem = ({ item }: { item: AdminUser }) => (
    <View style={styles.adminCard}>
      <View style={styles.leftArea}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={20} color="#16A34A" />
        </View>
        <View>
          <Text style={styles.adminName}>{item.name}</Text>
          <Text style={styles.adminEmail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.rightButtons}>
        <TouchableOpacity
            style={styles.detailButton} >
            <Text style={styles.detailButtonText}>상세</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 관리자 등록 버튼 */}
        <TouchableOpacity style={styles.registerButton} activeOpacity={0.85}>
          <Text style={styles.registerButtonText}>관리자 등록</Text>
        </TouchableOpacity>

        {/* 섹션 타이틀 */}
        <Text style={styles.sectionTitle}>등록된 관리자</Text>

        {/* 관리자 리스트 */}
        <FlatList
          data={ADMIN_LIST}
          keyExtractor={(item) => item.id}
          renderItem={renderAdminItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // 전체 배경 연한 회색
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  // 상단 "관리자 등록" 버튼
  registerButton: {
    backgroundColor: "#2563EB", // 진한 파랑
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
    alignItems: "center",
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
    backgroundColor: "#DCFCE7", // 연한 초록
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    alignItems: "center",
    columnGap: 8,   
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#E5EDFF",
  },
  detailButtonText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
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
});