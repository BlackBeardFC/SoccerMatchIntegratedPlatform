import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import UserDetailModal, { UserDetail } from "../users/userDetail";

const FILTERS = ["최신 등록순", "오래된 순", "최근 구매순"] as const;
type FilterType = (typeof FILTERS)[number];

type User = UserDetail;

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "사용자1",
    email: "user1@example.com",
    phone: "010-1234-5678",
    joinedAt: "2024.01.10",
    lastLogin: "2024.01.15 14:30",
    totalOrders: 5,
    totalAmount: 150000,
    status: "활성",
  },
  {
    id: "2",
    name: "사용자2",
    email: "user2@example.com",
    phone: "010-2222-3333",
    joinedAt: "2024.01.11",
    lastLogin: "2024.01.15 12:10",
    totalOrders: 3,
    totalAmount: 90000,
    status: "활성",
  },
  {
    id: "3",
    name: "사용자3",
    email: "user3@example.com",
    phone: "010-3333-4444",
    joinedAt: "2024.01.12",
    lastLogin: "2024.01.14 18:00",
    totalOrders: 1,
    totalAmount: 30000,
    status: "활성",
  },
  {
    id: "4",
    name: "사용자4",
    email: "user4@example.com",
    phone: "010-4444-5555",
    joinedAt: "2024.01.13",
    lastLogin: "2024.01.14 10:20",
    totalOrders: 2,
    totalAmount: 60000,
    status: "비활성",
  },
];

export default function UsersScreen() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("최신 등록순");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const filteredUsers = MOCK_USERS; // TODO: 검색/필터 로직 나중에

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedUser(null);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userLeft}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={22} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => openDetail(item)}
      >
        <Text style={styles.detailButtonText}>상세</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 검색 영역 */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 6 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="사용자 이름으로 검색"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>

        {/* 필터 버튼들 */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const selected = f === selectedFilter;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextSelected,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 사용자 리스트 */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 상세보기 모달 컴포넌트 */}
      <UserDetailModal
        visible={detailVisible}
        user={selectedUser}
        onClose={closeDetail}
        onEdit={(user) => {
          // TODO: 나중에 수정 화면으로 이동/상태 관리
          console.log("edit user", user.id);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  searchButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipSelected: {
    backgroundColor: "#2563EB1A",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  filterChipText: {
    fontSize: 12,
    color: "#4B5563",
  },
  filterChipTextSelected: {
    color: "#2563EB",
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#E0EDFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#6B7280",
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
});
