import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import UserDetailModal, { UserDetail } from "../users/userDetail";
import UserSearchHeader, {
  SortType,
  StatusFilterType,
} from "./search";

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

  // 정렬/상태 드롭다운
  const [selectedSort, setSelectedSort] =
    useState<SortType>("기본 정렬");
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilterType>("전체");

  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const parseDate = (value: string) => {
    const normalized = value.replace(/\./g, "-");
    return new Date(normalized);
  };

  // 검색 + 상태 필터 + 정렬
  const filteredUsers = useMemo(() => {
    const keyword = search.trim();
    let list = [...users];

    // 1) 검색 (이름 기준)
    if (keyword.length > 0) {
      list = list.filter((u) =>
        u.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 2) 상태 필터
    if (selectedStatus !== "전체") {
      list = list.filter((u) => u.status === selectedStatus);
    }

    // 3) 정렬
    switch (selectedSort) {
      case "최신 등록순":
        list.sort(
          (a, b) =>
            parseDate(b.joinedAt).getTime() -
            parseDate(a.joinedAt).getTime()
        );
        break;
      case "오래된 순":
        list.sort(
          (a, b) =>
            parseDate(a.joinedAt).getTime() -
            parseDate(b.joinedAt).getTime()
        );
        break;
      case "최근 구매순":
        list.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "기본 정렬":
      default:
      // 아무것도 안 하면 기존 순서 유지
    }

    return list;
  }, [users, search, selectedStatus, selectedSort]);

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setSelectedUser(null);
  };

  const handleUserStatusChange = (updatedUser: UserDetail) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    setSelectedUser((prev) =>
      prev && prev.id === updatedUser.id ? updatedUser : prev
    );
  };

  const handleSubmitSearch = () => {
    console.log("검색 실행:", search);
    // 나중에 서버 검색 붙이면 여기서 API 호출
  };

  const statusBadgeStyle = (status: string) => {
  switch (status) {
    case "활성":
      return { backgroundColor: "#DCFCE7" };
    case "비활성":
      return { backgroundColor: "#FEF3C7" };
    case "강제탈퇴":
      return { backgroundColor: "#FEE2E2" };
    default:
      return {};
  }
};

const statusTextStyle = (status: string) => {
  switch (status) {
    case "활성":
      return { color: "#16A34A" };
    case "비활성":
      return { color: "#D97706" };
    case "강제탈퇴":
      return { color: "#DC2626" };
    default:
      return {};
  }
};


  const renderUserItem = ({ item }: { item: User }) => (
  <View style={styles.userCard}>
    <View style={styles.userLeft}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color="#3B82F6" />
      </View>

      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={styles.userName}>{item.name}</Text>

          {/* ✅ 상태 뱃지 */}
          <View style={[styles.statusBadge, statusBadgeStyle(item.status)]}>
            <Text style={[styles.statusText, statusTextStyle(item.status)]}>
              {item.status}
            </Text>
          </View>
        </View>

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
        {/* 검색 + 드롭다운 헤더 */}
        <View style={styles.headerLayer}>
        <UserSearchHeader
          search={search}
          onChangeSearch={setSearch}
          onSubmitSearch={handleSubmitSearch}
          selectedSort={selectedSort}
          onChangeSort={setSelectedSort}
          selectedStatus={selectedStatus}
          onChangeStatus={setSelectedStatus}
        />
        </View>

        {/* 사용자 리스트 */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>

      {/* 상세보기 모달 */}
      <UserDetailModal
        visible={detailVisible}
        user={selectedUser}
        onClose={closeDetail}
        onChangeStatus={handleUserStatusChange}
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
  headerLayer: {
    zIndex: 9999,
    elevation: 9999,  
  },
  listLayer: {
    zIndex: 0,
    elevation: 0,
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
  statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 999,
},

statusText: {
  fontSize: 11,
  fontWeight: "600",
},

statusActive: {
  backgroundColor: "#DCFCE7", // 초록
},

statusInactive: {
  backgroundColor: "#FEF3C7", // 회색
},

statusBanned: {
  backgroundColor: "#FEE2E2", // 빨강
},

});
