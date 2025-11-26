import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

type OrderStatus = "CONFIRMED" | "CANCELLED" | "REFUNDED";

type Order = {
  id: string;
  matchTitle: string;
  stadium: string;
  matchDateTime: string; // "2025-11-20T19:00:00+09:00" 형식 추천
  seatInfo: string;
  price: number;
  status: OrderStatus;
};

const mockOrders: Order[] = [
  {
    id: "1",
    matchTitle: "검은수염 vs 라쿤",
    stadium: "검은수염 스타디움",
    matchDateTime: "2025-11-25T19:00:00+09:00", // 예정
    seatInfo: "1층 A구역 12열 7번",
    price: 25000,
    status: "CONFIRMED",
  },
  {
    id: "2",
    matchTitle: "스네이크 vs 부엉이",
    stadium: "스네이크 파크",
    matchDateTime: "2025-11-10T18:00:00+09:00", // 지난
    seatInfo: "2층 B구역 5열 3번",
    price: 22000,
    status: "CONFIRMED",
  },
  {
    id: "3",
    matchTitle: "흰수염 vs 까마귀",
    stadium: "흰수염 돔",
    matchDateTime: "2025-11-30T17:00:00+09:00", // 예정
    seatInfo: "1층 C구역 3열 9번",
    price: 28000,
    status: "CONFIRMED",
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const now = new Date();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingOrders = useMemo(
    () => mockOrders.filter((o) => new Date(o.matchDateTime) >= now),
    [now]
  );

  const pastOrders = useMemo(
    () => mockOrders.filter((o) => new Date(o.matchDateTime) < now),
    [now]
  );

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, "0");
    return `${month}월 ${day}일 ${hour}:${minute}`;
  };
  
  const handleDetail = (order: Order) => {
    router.push({
      pathname: "/mypage-pages/order-detail",
      params: { id: order.id },
    });
  };

  const currentList = activeTab === "upcoming" ? upcomingOrders : pastOrders;
  const isUpcomingTab = activeTab === "upcoming";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "예매 내역",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 6 }}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 탭 버튼 (예정된 경기 / 지난 경기) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              isUpcomingTab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("upcoming")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                isUpcomingTab && styles.tabTextActive,
              ]}
            >
              예정된 경기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              !isUpcomingTab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("past")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                !isUpcomingTab && styles.tabTextActive,
              ]}
            >
              지난 경기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 탭의 리스트 */}
        <View style={styles.listSection}>
          {currentList.length === 0 ? (
            <Text style={styles.emptyText}>
              {isUpcomingTab
                ? "예정된 예매 내역이 없습니다."
                : "지난 예매 내역이 없습니다."}
            </Text>
          ) : (
            currentList.map((order) => (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.matchTitle}>{order.matchTitle}</Text>
                  <Text
                    style={
                      isUpcomingTab ? styles.badgeUpcoming : styles.badgePast
                    }
                  >
                    {isUpcomingTab ? "예정" : "종료"}
                  </Text>
                </View>

                <Text style={styles.matchInfo}>
                  {formatDateTime(order.matchDateTime)} · {order.stadium}
                </Text>
                <Text style={styles.matchInfo}>{order.seatInfo}</Text>
                <Text style={styles.priceText}>
                  {order.price.toLocaleString()}원
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={() => handleDetail(order)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.outlineButtonText}>예매 상세</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 탭 영역
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  listSection: {
    marginBottom: 24,
  },
  emptyText: {
    color: "#777",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  matchTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  matchInfo: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  priceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  badgeUpcoming: {
    backgroundColor: Colors.primary,
    color: "#fff",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgePast: {
    backgroundColor: "#555",
    color: "#fff",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "flex-end",
    gap: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  outlineButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
