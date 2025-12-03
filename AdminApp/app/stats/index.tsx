// app/stats/index.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DailyStat = {
  date: string;
  amount: number;
};

const DAILY_STATS: DailyStat[] = [
  { date: "2025.09.15", amount: 150000 },
  { date: "2025.09.14", amount: 130000 },
  { date: "2025.09.13", amount: 110000 },
];

export default function StatsScreen() {
  const totalAmount = 1250000; // 총 정산금액 Mock

  const renderDailyItem = ({ item }: { item: DailyStat }) => (
    <View style={styles.dailyRow}>
      <Text style={styles.dailyDate}>{item.date}</Text>
      <Text style={styles.dailyAmount}>
        ₩ {item.amount.toLocaleString("ko-KR")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 총 정산금액 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>총 정산금액</Text>
          <Text style={styles.totalAmount}>
            {totalAmount.toLocaleString("ko-KR")}원
          </Text>
        </View>

        {/* 경기별 찾기 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>경기 별 찾기</Text>

          <TouchableOpacity style={styles.dateButton} activeOpacity={0.8}>
            <Text style={styles.dateButtonText}>날짜별 통계 보기</Text>
          </TouchableOpacity>
        </View>

        {/* 일별 현황 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitleCenter}>일별 현황</Text>

          <FlatList
            data={DAILY_STATS}
            keyExtractor={(item) => item.date}
            renderItem={renderDailyItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={styles.dailyDivider} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // 전체 배경
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  // 공통 카드
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  cardTitleCenter: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 10,
  },

  // 총 정산금액
  totalAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB", // 파란 텍스트
  },

  // 날짜별 통계 보기 버튼
  dateButton: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#E5EDFF", // 연한 파랑
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  // 일별 현황 리스트
  dailyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dailyDate: {
    fontSize: 13,
    color: "#4B5563",
  },
  dailyAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  dailyDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});
