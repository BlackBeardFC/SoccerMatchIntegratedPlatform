import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

type OrderStatus = "CONFIRMED" | "CANCELLED" | "REFUNDED";

type Order = {
  id: string;
  matchTitle: string;
  stadium: string;
  matchDateTime: string;
  seatInfo: string;
  price: number;
  status: OrderStatus;
  // 나중에 DB 붙이면 이런 필드도 생길 수 있음
  reservationNumber?: string;
  paymentMethod?: string;
  reservedAt?: string;
};

const mockOrders: Order[] = [
  {
    id: "1",
    matchTitle: "검은수염 vs 라쿤",
    stadium: "검은수염 스타디움",
    matchDateTime: "2025-11-25T19:00:00+09:00",
    seatInfo: "1층 A구역 12열 7번",
    price: 25000,
    status: "CONFIRMED",
    reservationNumber: "BB20251125-0001",
    paymentMethod: "신용카드",
    reservedAt: "2025-11-01T21:15:00+09:00",
  },
  {
    id: "2",
    matchTitle: "스네이크 vs 부엉이",
    stadium: "스네이크 파크",
    matchDateTime: "2025-11-10T18:00:00+09:00",
    seatInfo: "2층 B구역 5열 3번",
    price: 22000,
    status: "CONFIRMED",
    reservationNumber: "BB20251110-0003",
    paymentMethod: "카카오페이",
    reservedAt: "2025-10-28T14:32:00+09:00",
  },
  {
    id: "3",
    matchTitle: "흰수염 vs 까마귀",
    stadium: "흰수염 돔",
    matchDateTime: "2025-11-30T17:00:00+09:00",
    seatInfo: "1층 C구역 3열 9번",
    price: 28000,
    status: "CONFIRMED",
    reservationNumber: "BB20251130-0010",
    paymentMethod: "네이버페이",
    reservedAt: "2025-11-05T19:05:00+09:00",
  },
];

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, "0");
  return `${month}월 ${day}일 ${hour}:${minute}`;
}

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const order = useMemo(
    () => mockOrders.find((o) => o.id === id),
    [id]
  );

  if (!order) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "예매 상세",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#000" },
            headerTintColor: "#fff",
            headerShadowVisible: false,
            headerLeft: () => (
              <View style={{ paddingLeft: 6 }}>
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color="#fff"
                  onPress={() => router.back()}
                />
              </View>
            ),
          }}
        />
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#fff" }}>예매 정보를 찾을 수 없습니다.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "예매 상세",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ paddingLeft: 6 }}>
              <Ionicons
                name="chevron-back"
                size={22}
                color="#fff"
                onPress={() => router.back()}
              />
            </View>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 경기 기본 정보 카드 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>경기 정보</Text>
          <Text style={styles.matchTitle}>{order.matchTitle}</Text>
          <Text style={styles.textRow}>
            {formatDateTime(order.matchDateTime)} · {order.stadium}
          </Text>
          <Text style={styles.textRow}>좌석: {order.seatInfo}</Text>
          <View style={styles.statusBadgeContainer}>
            <Text
              style={[
                styles.statusBadge,
                order.status === "CONFIRMED" && styles.statusConfirmed,
                order.status === "CANCELLED" && styles.statusCancelled,
                order.status === "REFUNDED" && styles.statusRefunded,
              ]}
            >
              {order.status === "CONFIRMED"
                ? "예매 완료"
                : order.status === "CANCELLED"
                ? "취소"
                : "환불 완료"}
            </Text>
          </View>
        </View>

        {/* 예매/결제 정보 카드 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>예매 정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>예매 번호</Text>
            <Text style={styles.infoValue}>
              {order.reservationNumber ?? "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>예매 일시</Text>
            <Text style={styles.infoValue}>
              {formatDateTime(order.reservedAt)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 수단</Text>
            <Text style={styles.infoValue}>
              {order.paymentMethod ?? "신용/체크카드"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 금액</Text>
            <Text style={styles.infoValue}>
              {order.price.toLocaleString()}원
            </Text>
          </View>
        </View>

        {/* 이용 안내 카드 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>입장 안내</Text>
          <Text style={styles.guideText}>
            · 경기 시작 30분 전까지 입장을 완료해주세요.
          </Text>
          <Text style={styles.guideText}>
            · 티켓 확인은 입장 게이트에서 진행되며, 신분증을 요청할 수 있습니다.
          </Text>
          <Text style={styles.guideText}>
            · 입장 후에는 지정 좌석 이외의 자리로 이동이 제한될 수 있습니다.
          </Text>
        </View>

        {/* 문의 안내 */}
        <View style={[styles.card, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>문의</Text>
          <Text style={styles.guideText}>
            예매 변경 또는 기타 문의 사항이 있을 경우,  
            마이페이지 &gt; 문의사항 메뉴를 통해 문의를 남겨주세요.
          </Text>
        </View>
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
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  matchTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  textRow: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 2,
  },
  statusBadgeContainer: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  statusBadge: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    color: "#fff",
  },
  statusConfirmed: {
    backgroundColor: Colors.primary,
  },
  statusCancelled: {
    backgroundColor: "#555",
  },
  statusRefunded: {
    backgroundColor: "#2f80ed",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  infoLabel: {
    color: "#aaa",
    fontSize: 13,
  },
  infoValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  guideText: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
