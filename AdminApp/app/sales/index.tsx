import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

// ----------------------
// 타입 정의
// ----------------------
type PaymentStatus = "PAID" | "CANCELED";
type SettlementStatus = "PENDING" | "DONE" | "HOLD";

type SaleItem = {
  id: string;
  paidAt: string; // "YYYY-MM-DD HH:mm"
  orderNo: string;
  userName: string;
  matchName: string;
  amount: number;
  settlementAmount: number;
  paymentStatus: PaymentStatus;
  settlementStatus: SettlementStatus;
};

type ViewMode = "MATCH" | "DATE";

type CalendarDate = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

type DateStats = {
  date: string; // "YYYY-MM-DD"
  totalPaid: number;
  totalCanceled: number;
  count: number;
};

type MatchStats = {
  key: string; // matchName (여기서는 matchName 기준으로 집계)
  latestPaidAt: string; // 집계된 결제 중 가장 최신 시간(임시로 경기일시 느낌)
  totalPaid: number;
  totalCanceled: number;
  paidCount: number;
  canceledCount: number;
  totalCount: number;
};

type MatchSort = "최신" | "매출높은순";

// ----------------------
// 임시 매출 데이터 (나중에 API로 대체)
// ----------------------
const MOCK_SALES: SaleItem[] = [
  {
    id: "1",
    paidAt: "2025-12-01 14:21",
    orderNo: "ORD-20251201-001",
    userName: "홍길동",
    matchName: "검은수염 FC vs 라쿤 FC",
    amount: 150000,
    settlementAmount: 150000,
    paymentStatus: "PAID",
    settlementStatus: "DONE",
  },
  {
    id: "2",
    paidAt: "2025-12-06 11:03",
    orderNo: "ORD-20251206-001",
    userName: "김철수",
    matchName: "올빼미 FC vs 코끼리 FC",
    amount: 80000,
    settlementAmount: 80000,
    paymentStatus: "PAID",
    settlementStatus: "DONE",
  },
  {
    id: "3",
    paidAt: "2025-12-06 13:40",
    orderNo: "ORD-20251206-002",
    userName: "이영희",
    matchName: "올빼미 FC vs 코끼리 FC",
    amount: 70000,
    settlementAmount: 70000,
    paymentStatus: "PAID",
    settlementStatus: "DONE",
  },
  {
    id: "4",
    paidAt: "2025-12-02 13:10",
    orderNo: "ORD-20251202-001",
    userName: "박영수",
    matchName: "라쿤 FC vs 올빼미 FC",
    amount: 110000,
    settlementAmount: 110000,
    paymentStatus: "PAID",
    settlementStatus: "DONE",
  },
  {
    id: "5",
    paidAt: "2025-12-01 15:10",
    orderNo: "ORD-20251201-003",
    userName: "최민수",
    matchName: "검은수염 FC vs 라쿤 FC",
    amount: 40000,
    settlementAmount: 40000,
    paymentStatus: "CANCELED",
    settlementStatus: "PENDING",
  },
];

const SalesScreen = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("MATCH");

  // ----------------------
  // DATE 모드(달력) 상태
  // ----------------------
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateDetailVisible, setDateDetailVisible] = useState(false);

  // ----------------------
  // MATCH 모드(경기별) 상태
  // ----------------------
  const [matchQuery, setMatchQuery] = useState("");
  const [matchSort, setMatchSort] = useState<MatchSort>("최신");
  const [includeCanceled, setIncludeCanceled] = useState(true);

  const [selectedMatch, setSelectedMatch] = useState<MatchStats | null>(null);
  const [matchDetailVisible, setMatchDetailVisible] = useState(false);

  // ----------------------
  // 공통 유틸
  // ----------------------
  const formatCurrency = (value: number) =>
    value.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

  const totalAmount = useMemo(
    () => MOCK_SALES.reduce((sum, s) => sum + s.settlementAmount, 0),
    []
  );

  // ----------------------
  // DATE: 날짜별 집계
  // ----------------------
  const salesByDate: Record<string, DateStats> = useMemo(() => {
    const map: Record<string, DateStats> = {};
    MOCK_SALES.forEach((sale) => {
      const key = sale.paidAt.split(" ")[0]; // YYYY-MM-DD
      if (!map[key]) {
        map[key] = { date: key, totalPaid: 0, totalCanceled: 0, count: 0 };
      }
      if (sale.paymentStatus === "PAID") map[key].totalPaid += sale.settlementAmount;
      if (sale.paymentStatus === "CANCELED") map[key].totalCanceled += sale.settlementAmount;
      map[key].count += 1;
    });
    return map;
  }, []);

  const markedDates = useMemo(() => {
    const result: Record<string, any> = {};
    Object.keys(salesByDate).forEach((date) => {
      const isSelected = selectedDate === date;
      result[date] = {
        marked: true,
        dotColor: "#2563eb",
        selected: isSelected,
        selectedColor: isSelected ? "#2563eb" : "#e5f0ff",
        selectedTextColor: isSelected ? "#ffffff" : "#111827",
      };
    });

    if (selectedDate && !result[selectedDate]) {
      result[selectedDate] = {
        selected: true,
        selectedColor: "#2563eb",
        selectedTextColor: "#ffffff",
      };
    }
    return result;
  }, [salesByDate, selectedDate]);

  const onDayPress = (day: CalendarDate) => {
    setSelectedDate(day.dateString);
    setDateDetailVisible(true);
  };

  const dateDetail = selectedDate ? salesByDate[selectedDate] : undefined;
  const dateNetSales =
    (dateDetail?.totalPaid || 0) - (dateDetail?.totalCanceled || 0);
  const formattedSelectedDate = selectedDate ? selectedDate.replace(/-/g, ".") : "-";

  // ----------------------
  // MATCH: 경기별 집계(카드 리스트)
  // ----------------------
  const matchStatsList: MatchStats[] = useMemo(() => {
    const map: Record<string, MatchStats> = {};

    for (const sale of MOCK_SALES) {
      const key = sale.matchName;

      if (!map[key]) {
        map[key] = {
          key,
          latestPaidAt: sale.paidAt,
          totalPaid: 0,
          totalCanceled: 0,
          paidCount: 0,
          canceledCount: 0,
          totalCount: 0,
        };
      }

      // 최신 결제 시간 업데이트
      if (sale.paidAt > map[key].latestPaidAt) {
        map[key].latestPaidAt = sale.paidAt;
      }

      if (sale.paymentStatus === "PAID") {
        map[key].totalPaid += sale.settlementAmount;
        map[key].paidCount += 1;
      } else {
        map[key].totalCanceled += sale.settlementAmount;
        map[key].canceledCount += 1;
      }
      map[key].totalCount += 1;
    }

    let list = Object.values(map);

    // 검색
    const q = matchQuery.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((m) => m.key.toLowerCase().includes(q));
    }

    // 취소 포함 여부
    if (!includeCanceled) {
      list = list.map((m) => ({
        ...m,
        totalCanceled: 0,
        canceledCount: 0,
        totalCount: m.paidCount, // “표시용”으로만
      }));
    }

    // 정렬
    if (matchSort === "최신") {
      list.sort((a, b) => (a.latestPaidAt < b.latestPaidAt ? 1 : -1));
    } else {
      list.sort((a, b) => {
        const netA = aNet(a);
        const netB = aNet(b);
        return netB - netA;
      });
    }


    return list;

    function aNet(m: MatchStats) {
      return (m.totalPaid || 0) - (includeCanceled ? (m.totalCanceled || 0) : 0);
    }
  }, [matchQuery, matchSort, includeCanceled]);

  const openMatchDetail = (m: MatchStats) => {
    setSelectedMatch(m);
    setMatchDetailVisible(true);
  };

  const matchNetSales = selectedMatch
    ? selectedMatch.totalPaid - (includeCanceled ? selectedMatch.totalCanceled : 0)
    : 0;

  // ----------------------
  // 렌더
  // ----------------------
  const renderMatchItem = ({ item }: { item: MatchStats }) => {
    const net = item.totalPaid - (includeCanceled ? item.totalCanceled : 0);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.matchCard}
        onPress={() => openMatchDetail(item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.matchTitle} numberOfLines={1}>
            {item.key}
          </Text>
          <Text style={styles.matchSub}>
            최신 결제: {item.latestPaidAt.replace("-", ".").replace("-", ".")}
          </Text>

          <View style={styles.matchMetaRow}>
            <View style={[styles.pill, { backgroundColor: "#e5f0ff" }]}>
              <Text style={[styles.pillText, { color: "#2563eb" }]}>
                결제 {item.paidCount}건
              </Text>
            </View>

            {includeCanceled && (
              <View style={[styles.pill, { backgroundColor: "#fee2e2" }]}>
                <Text style={[styles.pillText, { color: "#ef4444" }]}>
                  취소 {item.canceledCount}건
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.matchMoney}>{formatCurrency(net)}원</Text>
          <Text style={styles.matchMoneySub}>
            총매출 {formatCurrency(item.totalPaid)}원
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* 1) 총 정산금액 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>총 정산금액</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}원</Text>
        </View>

        {/* 2) 매출 조회 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>매출 조회</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.toggleButton,
              viewMode === "MATCH" ? styles.toggleButtonActive : styles.toggleButtonInactive,
            ]}
            onPress={() => setViewMode("MATCH")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === "MATCH" ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive,
              ]}
            >
              경기별 매출 조회
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.toggleButton,
              viewMode === "DATE" ? styles.toggleButtonActive : styles.toggleButtonInactive,
              { marginTop: 8 },
            ]}
            onPress={() => setViewMode("DATE")}
          >
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === "DATE" ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive,
              ]}
            >
              날짜별 매출 조회
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3) 하단 영역 */}
        {viewMode === "DATE" ? (
          // DATE 모드: 달력
          <View style={[styles.card, styles.flexCard]}>
            <Text style={styles.cardLabel}>매출 달력</Text>
            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                todayTextColor: "#2563eb",
              }}
            />
          </View>
        ) : (
          // MATCH 모드: 경기별 리스트
          <View style={[styles.card, styles.flexCard]}>
            <Text style={styles.cardLabel}>경기별 매출</Text>

            {/* 검색 */}
            <View style={styles.matchSearchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="경기명/구단명으로 검색"
                  placeholderTextColor="#9CA3AF"
                  value={matchQuery}
                  onChangeText={setMatchQuery}
                  returnKeyType="search"
                />
              </View>
            </View>

            {/* 필터/정렬 */}
            <View style={styles.chipRow}>
              <TouchableOpacity
                onPress={() => setMatchSort((p) => (p === "최신" ? "매출높은순" : "최신"))}
                style={[styles.chip, { backgroundColor: "#e5f0ff" }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, { color: "#2563eb" }]}>
                  정렬: {matchSort === "최신" ? "최신 경기순" : "매출 높은순"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIncludeCanceled((p) => !p)}
                style={[styles.chip, { backgroundColor: includeCanceled ? "#fee2e2" : "#f3f4f6" }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, { color: includeCanceled ? "#ef4444" : "#111827" }]}>
                  취소 {includeCanceled ? "포함" : "제외"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 리스트 */}
            <FlatList
              data={matchStatsList}
              keyExtractor={(it) => it.key}
              renderItem={renderMatchItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 6 }}
            />
          </View>
        )}

        {/* DATE 상세 모달 (중앙) */}
        <Modal
          visible={dateDetailVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDateDetailVisible(false)}
        >
          <Pressable style={styles.centerOverlay} onPress={() => setDateDetailVisible(false)}>
            <Pressable style={styles.centerCard} onPress={() => {}}>
              <View style={styles.centerHeader}>
                <Text style={styles.centerTitle}>{formattedSelectedDate}</Text>
                <Pressable onPress={() => setDateDetailVisible(false)} hitSlop={10}>
                  <Text style={styles.centerClose}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.netBox}>
                <Text style={styles.netLabel}>순 매출</Text>
                <Text style={[styles.netValue, dateNetSales < 0 && { color: "#ef4444" }]}>
                  {formatCurrency(dateNetSales)}원
                </Text>
              </View>

              <View style={styles.grid}>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>총 매출</Text>
                  <Text style={styles.statValue}>{formatCurrency(dateDetail?.totalPaid || 0)}원</Text>
                  <View style={[styles.badge, { backgroundColor: "#e5f0ff" }]}>
                    <Text style={[styles.badgeText, { color: "#2563eb" }]}>PAID</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>취소 금액</Text>
                  <Text style={[styles.statValue, { color: "#ef4444" }]}>
                    {formatCurrency(dateDetail?.totalCanceled || 0)}원
                  </Text>
                  <View style={[styles.badge, { backgroundColor: "#fee2e2" }]}>
                    <Text style={[styles.badgeText, { color: "#ef4444" }]}>CANCELED</Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>총 건수</Text>
                  <Text style={styles.statValue}>{dateDetail?.count || 0}건</Text>
                  <View style={[styles.badge, { backgroundColor: "#f3f4f6" }]}>
                    <Text style={[styles.badgeText, { color: "#111827" }]}>COUNT</Text>
                  </View>
                </View>
              </View>

              <Pressable style={styles.okBtn} onPress={() => setDateDetailVisible(false)}>
                <Text style={styles.okBtnText}>확인</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* MATCH 상세 모달 (중앙) */}
        <Modal
          visible={matchDetailVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMatchDetailVisible(false)}
        >
          <Pressable style={styles.centerOverlay} onPress={() => setMatchDetailVisible(false)}>
            <Pressable style={styles.centerCard} onPress={() => {}}>
              <View style={styles.centerHeader}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.centerTitle} numberOfLines={1}>
                    {selectedMatch?.key || "-"}
                  </Text>
                  <Text style={styles.matchSubModal}>
                    최신 결제: {selectedMatch?.latestPaidAt || "-"}
                  </Text>
                </View>
                <Pressable onPress={() => setMatchDetailVisible(false)} hitSlop={10}>
                  <Text style={styles.centerClose}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.netBox}>
                <Text style={styles.netLabel}>순 매출</Text>
                <Text style={[styles.netValue, matchNetSales < 0 && { color: "#ef4444" }]}>
                  {formatCurrency(matchNetSales)}원
                </Text>
              </View>

              <View style={styles.grid}>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>총 매출</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(selectedMatch?.totalPaid || 0)}원
                  </Text>
                  <View style={[styles.badge, { backgroundColor: "#e5f0ff" }]}>
                    <Text style={[styles.badgeText, { color: "#2563eb" }]}>
                      결제 {selectedMatch?.paidCount || 0}건
                    </Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>취소 금액</Text>
                  <Text style={[styles.statValue, { color: "#ef4444" }]}>
                    {formatCurrency(includeCanceled ? (selectedMatch?.totalCanceled || 0) : 0)}원
                  </Text>
                  <View style={[styles.badge, { backgroundColor: "#fee2e2" }]}>
                    <Text style={[styles.badgeText, { color: "#ef4444" }]}>
                      취소 {includeCanceled ? (selectedMatch?.canceledCount || 0) : 0}건
                    </Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>총 건수</Text>
                  <Text style={styles.statValue}>
                    {includeCanceled ? (selectedMatch?.totalCount || 0) : (selectedMatch?.paidCount || 0)}건
                  </Text>
                  <View style={[styles.badge, { backgroundColor: "#f3f4f6" }]}>
                    <Text style={[styles.badgeText, { color: "#111827" }]}>COUNT</Text>
                  </View>
                </View>
              </View>

              <Pressable style={styles.okBtn} onPress={() => setMatchDetailVisible(false)}>
                <Text style={styles.okBtnText}>확인</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SalesScreen;

// ----------------------
// 스타일
// ----------------------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  flexCard: {
    flex: 1,
    paddingBottom: 12,
  },

  cardLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },

  totalAmount: {
    fontSize: 22,
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "700",
  },

  toggleButton: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 },
  toggleButtonActive: { backgroundColor: "#e5f0ff" },
  toggleButtonInactive: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5f0ff" },
  toggleButtonText: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  toggleButtonTextActive: { color: "#2563eb" },
  toggleButtonTextInactive: { color: "#6b7280" },

  // MATCH: 검색
  matchSearchRow: { marginBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0, color: "#111827" },

  // MATCH: 칩
  chipRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  chipText: { fontSize: 12, fontWeight: "800" },

  // MATCH: 카드
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  matchTitle: { fontSize: 15, fontWeight: "800", color: "#111827", marginBottom: 4 },
  matchSub: { fontSize: 12, color: "#6b7280", marginBottom: 10 },
  matchMetaRow: { flexDirection: "row", gap: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: "800" },
  matchMoney: { fontSize: 15, fontWeight: "900", color: "#2563eb" },
  matchMoneySub: { marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: "700" },

  // 중앙 팝업 공통
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  centerCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  centerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  centerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  centerClose: { fontSize: 18, color: "#9ca3af" },

  matchSubModal: { marginTop: 4, fontSize: 12, color: "#6b7280", fontWeight: "700" },

  netBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  netLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: "700" },
  netValue: { fontSize: 20, color: "#111827", fontWeight: "900" },

  grid: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statTitle: { fontSize: 12, color: "#6b7280", fontWeight: "700", marginBottom: 6 },
  statValue: { fontSize: 14, color: "#111827", fontWeight: "900", marginBottom: 10 },

  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: "900" },

  okBtn: {
    marginTop: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  okBtnText: { color: "#ffffff", fontSize: 14, fontWeight: "900" },
});
