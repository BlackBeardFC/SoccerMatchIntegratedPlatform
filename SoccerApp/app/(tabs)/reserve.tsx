// import React, { useMemo, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   Platform,
//   TextInput,
//   Pressable,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Colors from "../../constants/Colors";
// import { useLocalSearchParams } from "expo-router";

// const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
// const addMonths = (date: Date, num: number) => {
//   const d = new Date(date);
//   d.setMonth(d.getMonth() + num);
//   return d;
// };
// const sameYMD = (a: Date, b: Date) =>
//   a.getFullYear() === b.getFullYear() &&
//   a.getMonth() === b.getMonth() &&
//   a.getDate() === b.getDate();

// type Match = {
//   id: number;
//   date: string;
//   home: string;
//   away: string;
//   stadium: string;
//   time: string;
//   price: string;
// };
// const formatCurrency = (n: number) => n.toLocaleString("ko-KR") + "원";

// export default function ReserveScreen() {
//   const params = useLocalSearchParams<{
//     matchId?: string;
//     date?: string; // "2025-11-14" 같은 형식으로 받을 때
//   }>();
//   const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
//   const [showPicker, setShowPicker] = useState(false);

//   const [ticketOpen, setTicketOpen] = useState(false);
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [seatGrade, setSeatGrade] = useState<"S" | "A" | "B" | null>(null);
//   const [qty, setQty] = useState(1);
//   const [promo, setPromo] = useState("");
//   const [discountApplied, setDiscountApplied] = useState<null | { code: string; amount: number }>(null);
//   const [payMethod, setPayMethod] = useState<"card" | "easy" | null>(null);
//   const [agree, setAgree] = useState(false);

//   const PRICE_MAP = { S: 30000, A: 23000, B: 18000 } as const;

//   const minDate = startOfDay(new Date());
//   const maxDate = addMonths(minDate, 3);

//   const matches: Match[] = [
//     { id: 1, date: "2025-10-15", home: "검은수염", away: "라쿤", stadium: "검은수염 스타디움", time: "19:00", price: "25,000원" },
//     { id: 2, date: "2025-11-20", home: "스네이크", away: "엘리펀트", stadium: "엘리펀트 스타디움", time: "18:00", price: "22,000원" },
//     { id: 3, date: "2025-11-18", home: "부엉이", away: "흰수염", stadium: "흰수염 돔", time: "17:30", price: "20,000원" },
//     { id: 4, date: "2025-11-24", home: "현무", away: "참새", stadium: "현무 아레나", time: "15:00", price: "19,000원" },
//     { id: 5, date: "2025-11-30", home: "문어", away: "두꺼비", stadium: "문어 돔", time: "14:00", price: "23,000원" },
//   ];

//   useEffect(() => {
//     // 1) matchId가 넘어온 경우: 그 경기 찾아서 날짜 맞추고 모달까지 띄우기
//     if (params.matchId) {
//       const id = Number(params.matchId);
//       const m = matches.find((mm) => mm.id === id);
//       if (m) {
//         const d = new Date(m.date + "T00:00:00");
//         setSelectedDate(startOfDay(d)); // 날짜 세팅
//         openTicket(m);                  // 모달 자동 오픈 (원치 않으면 이 줄 빼도 됨)
//       }
//       return;
//     }

//     // 2) date만 넘어온 경우: 그 날짜만 세팅
//     if (params.date) {
//       const d = new Date(String(params.date) + "T00:00:00");
//       if (!isNaN(d.getTime())) {
//         setSelectedDate(startOfDay(d));
//       }
//     }
//   }, [params.matchId, params.date]);

//   const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
//   const filteredMatches = useMemo(
//     () => matches.filter((m) => sameYMD(new Date(m.date + "T00:00:00"), selectedDate)),
//     [matches, selectedDate]
//   );

//   const onChangeDate = (_: any, date?: Date) => {
//     if (Platform.OS === "android") setShowPicker(false);
//     if (date && date >= minDate && date <= maxDate) setSelectedDate(startOfDay(date));
//   };

//   const openTicket = (m: Match) => {
//     setActiveMatch(m);
//     setSeatGrade(null);
//     setQty(1);
//     setPromo("");
//     setDiscountApplied(null);
//     setPayMethod(null);
//     setAgree(false);
//     setTicketOpen(true);
//   };

//   const subtotal = seatGrade ? PRICE_MAP[seatGrade] * qty : 0;
//   const discount = discountApplied?.amount ?? 0;
//   const total = Math.max(0, subtotal - discount);

//   const applyPromo = () => {
//     if (!seatGrade) return;
//     const base = PRICE_MAP[seatGrade] * qty;
//     if (promo.trim().toUpperCase() === "GOAL10") setDiscountApplied({ code: "GOAL10", amount: Math.floor(base * 0.1) });
//     else if (promo.trim().toUpperCase() === "RED5") setDiscountApplied({ code: "RED5", amount: Math.floor(base * 0.05) });
//     else setDiscountApplied(null);
//   };

//   const confirmPay = () => {
//     if (!activeMatch || !seatGrade || !payMethod || !agree) return;
//     console.log("결제 요청", {
//       matchId: activeMatch.id,
//       seatGrade,
//       qty,
//       promo: discountApplied?.code ?? null,
//       payMethod,
//       total,
//     });
//     setTicketOpen(false);
//   };

//   return (
//     <View style={styles.container}>

//       <View style={styles.header} />

//       <TouchableOpacity
//         style={styles.dateSection}
//         activeOpacity={0.8}
//         onPress={() => setShowPicker(true)}
//         hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//         accessibilityRole="button"
//         accessibilityLabel="날짜 선택"
//       >
//         <View style={styles.dateRow}>
//           <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
//           <Text style={styles.dateText}>{formattedDate}</Text>
//           <Ionicons name="chevron-down" size={16} color="#aaa" />
//         </View>
//         <Text style={styles.hintText}>날짜를 선택하면 해당 경기가 표시됩니다</Text>
//       </TouchableOpacity>

//       <Text style={styles.sectionTitle}>전체 경기</Text>
//       {filteredMatches.length > 0 ? (
//         <FlatList
//           data={filteredMatches}
//           keyExtractor={(item) => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 30 }}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <View style={styles.teamsRow}>
//                 <Text style={[styles.teamName, { textAlign: "left" }]}>{item.home}</Text>
//                 <Text style={styles.vs}>VS</Text>
//                 <Text style={[styles.teamName, { textAlign: "right" }]}>{item.away}</Text>
//               </View>
//               <Text style={styles.stadium}>
//                 {item.stadium} | {item.time}
//               </Text>
//               <TouchableOpacity style={styles.reserveBtn} onPress={() => openTicket(item)}>
//                 <Text style={styles.reserveText}>예매하기</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       ) : (
//         <Text style={styles.emptyText}>이 날짜에는 경기가 없습니다.</Text>
//       )}

//       {showPicker && (
//         <Modal transparent animationType="fade">
//           <View style={styles.modalBackdrop}>
//             <View style={styles.modalBox}>
//               <DateTimePicker
//                 value={selectedDate}
//                 mode="date"
//                 display={Platform.OS === "android" ? "calendar" : "inline"}
//                 onChange={onChangeDate}
//                 minimumDate={minDate}
//                 maximumDate={maxDate}
//                 themeVariant="dark"
//               />
//               <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPicker(false)}>
//                 <Text style={styles.modalCloseText}>닫기</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       <Modal visible={ticketOpen} transparent animationType="fade" onRequestClose={() => setTicketOpen(false)}>
//         <View style={styles.dialogBackdrop}>
//           <View style={styles.dialog}>

//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>티켓 예매</Text>
//               <TouchableOpacity onPress={() => setTicketOpen(false)} accessibilityRole="button" accessibilityLabel="팝업 닫기">
//                 <Ionicons name="close" size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 6 }}>
//               {activeMatch && (
//                 <View style={styles.summaryBox}>
//                   <Text style={styles.summaryTeams}>
//                     {activeMatch.home} vs {activeMatch.away}
//                   </Text>
//                   <Text style={styles.summaryInfo}>
//                     {activeMatch.stadium} | {activeMatch.time}
//                   </Text>
//                 </View>
//               )}

//               <Text style={styles.fieldLabel}>좌석 등급</Text>
//               <View style={styles.gradeRow}>
//                 {(["S", "A", "B"] as const).map((g) => {
//                   const on = seatGrade === g;
//                   const price = PRICE_MAP[g];
//                   return (
//                     <TouchableOpacity key={g} style={[styles.gradeBtn, on && styles.gradeOn]} onPress={() => setSeatGrade(g)}>
//                       <Text style={[styles.gradeText, on && styles.gradeTextOn]}>{g}석</Text>
//                       <Text style={[styles.gradePrice, on && styles.gradeTextOn]}>{formatCurrency(price)}</Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>

//               <Text style={[styles.fieldLabel, { marginTop: 12 }]}>수량</Text>
//               <View style={styles.qtyRow}>
//                 <TouchableOpacity
//                   style={[styles.qtyBtn, qty <= 1 && { opacity: 0.4 }]}
//                   onPress={() => qty > 1 && setQty(qty - 1)}
//                   accessibilityRole="button"
//                   accessibilityLabel="수량 감소"
//                 >
//                   <Ionicons name="remove" size={18} color="#fff" />
//                 </TouchableOpacity>
//                 <Text style={styles.qtyValue}>{qty}</Text>
//                 <TouchableOpacity
//                   style={[styles.qtyBtn, qty >= 6 && { opacity: 0.4 }]}
//                   onPress={() => qty < 6 && setQty(qty + 1)}
//                   accessibilityRole="button"
//                   accessibilityLabel="수량 증가"
//                 >
//                   <Ionicons name="add" size={18} color="#fff" />
//                 </TouchableOpacity>
//               </View>

//               <Text style={[styles.fieldLabel, { marginTop: 12 }]}>결제 수단</Text>
//               <View style={styles.payRow}>
//                 <Pressable style={styles.payChip} onPress={() => setPayMethod("card")}>
//                   <Ionicons name={payMethod === "card" ? "radio-button-on" : "radio-button-off"} size={18} color="#fff" />
//                   <Text style={styles.payText}>카드 결제</Text>
//                 </Pressable>
//                 <Pressable style={styles.payChip} onPress={() => setPayMethod("easy")}>
//                   <Ionicons name={payMethod === "easy" ? "radio-button-on" : "radio-button-off"} size={18} color="#fff" />
//                   <Text style={styles.payText}>간편결제</Text>
//                 </Pressable>
//               </View>

//               <Pressable style={styles.agreeRow} onPress={() => setAgree((v) => !v)}>
//                 <Ionicons name={agree ? "checkbox" : "square-outline"} size={18} color="#fff" />
//                 <Text style={styles.agreeText}>예매 규정 및 취소수수료 안내에 동의합니다</Text>
//               </Pressable>

//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>총 결제금액</Text>
//                 <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
//               </View>

//               <TouchableOpacity
//                 style={[styles.payBtn, (!seatGrade || !payMethod || !agree || total <= 0) && { opacity: 0.4 }]}
//                 disabled={!seatGrade || !payMethod || !agree || total <= 0}
//                 onPress={confirmPay}
//               >
//                 <Text style={styles.payBtnText}>결제하기</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 18, paddingTop: 40 },
//   header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

//   dateSection: { backgroundColor: "#121212", borderRadius: 12, paddingVertical: 22, marginBottom: 18, paddingHorizontal: 18 },
//   dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
//   dateText: { color: "#f5f5f5", fontSize: 17, fontWeight: "700" },
//   hintText: { color: "#9ca3af", fontSize: 12, textAlign: "center", marginTop: 6 },

//   sectionTitle: { color: Colors.primary, fontSize: 15, fontWeight: "700", marginBottom: 10 },
//   card: { backgroundColor: "#1A1A1A", borderRadius: 18, paddingVertical: 22, paddingHorizontal: 20, alignItems: "center", marginBottom: 16 },
//   teamsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
//   teamName: { color: "#fff", fontSize: 17, fontWeight: "700", width: "40%" },
//   vs: { color: Colors.primary, fontSize: 15, fontWeight: "700", textAlign: "center", width: "20%" },
//   stadium: { color: "#ccc", fontSize: 13, marginBottom: 10 },
//   reserveBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 30 },
//   reserveText: { color: "#fff", fontWeight: "700", fontSize: 14 },
//   emptyText: { color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 30 },

//   modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
//   modalBox: { backgroundColor: "#1A1A1A", borderRadius: 16, padding: 16, width: "90%" },
//   modalCloseBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 8, marginTop: 10, alignItems: "center" },
//   modalCloseText: { color: "#fff", fontWeight: "600" },

//   dialogBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dialog: {
//     backgroundColor: "#121212",
//     borderRadius: 16,
//     padding: 16,
//     width: "92%",
//     maxWidth: 480,
//     maxHeight: "88%",
//   },

//   sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
//   sheetTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   summaryBox: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 12, marginBottom: 12 },
//   summaryTeams: { color: "#fff", fontSize: 15, fontWeight: "800" },
//   summaryInfo: { color: "#cfcfcf", fontSize: 12, marginTop: 4 },

//   fieldLabel: { color: "#b5b5b5", fontSize: 12, marginBottom: 8 },
//   gradeRow: { flexDirection: "row", gap: 8 },
//   gradeBtn: { flex: 1, backgroundColor: "#1E1E1E", borderRadius: 12, padding: 12, alignItems: "center" },
//   gradeOn: { backgroundColor: Colors.primary },
//   gradeText: { color: "#fff", fontWeight: "700", marginBottom: 4 },
//   gradeTextOn: { color: "#fff" },
//   gradePrice: { color: "#cfcfcf", fontSize: 12 },

//   qtyRow: { flexDirection: "row", alignItems: "center", gap: 18 },
//   qtyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#1E1E1E", alignItems: "center", justifyContent: "center" },
//   qtyValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   promoRow: { flexDirection: "row", gap: 8 },
//   promoInput: { flex: 1, backgroundColor: "#1E1E1E", borderRadius: 10, paddingHorizontal: 12, color: "#fff", height: 40 },
//   promoBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
//   promoBtnText: { color: "#fff", fontWeight: "800" },
//   promoApplied: { color: "#22c55e", fontSize: 12, marginTop: 6 },

//   payRow: { flexDirection: "row", gap: 14, marginTop: 4 },
//   payChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#1E1E1E", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
//   payText: { color: "#fff", fontSize: 12 },

//   agreeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
//   agreeText: { color: "#cfcfcf", fontSize: 12 },

//   totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
//   totalLabel: { color: "#cfcfcf", fontSize: 13 },
//   totalValue: { color: "#fff", fontSize: 18, fontWeight: "900" },

//   payBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 12 },
//   payBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
// });


import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../constants/Colors";
import { useLocalSearchParams } from "expo-router";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addMonths = (date: Date, num: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + num);
  return d;
};
const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

type Match = {
  id: number;
  date: string;
  home: string;
  away: string;
  stadium: string;
  time: string;
  price: string;
};

const formatCurrency = (n: number) => n.toLocaleString("ko-KR") + "원";

export default function ReserveScreen() {
  const params = useLocalSearchParams<{
    matchId?: string;
    date?: string; // "2025-11-14" 같은 형식으로 받을 때
  }>();

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [showPicker, setShowPicker] = useState(false);

  const [ticketOpen, setTicketOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [seatGrade, setSeatGrade] = useState<"S" | "A" | "B" | null>(null);
  const [qty, setQty] = useState(1);
  const [promo, setPromo] = useState("");
  const [discountApplied, setDiscountApplied] = useState<null | { code: string; amount: number }>(null);
  const [payMethod, setPayMethod] = useState<"card" | "easy" | null>(null);
  const [agree, setAgree] = useState(false);

  const PRICE_MAP = { S: 30000, A: 23000, B: 18000 } as const;

  const minDate = startOfDay(new Date());
  const maxDate = addMonths(minDate, 3);

  const matches: Match[] = [
    { id: 1, date: "2025-10-15", home: "검은수염", away: "라쿤", stadium: "검은수염 스타디움", time: "19:00", price: "25,000원" },
    { id: 2, date: "2025-11-20", home: "스네이크", away: "엘리펀트", stadium: "엘리펀트 스타디움", time: "18:00", price: "22,000원" },
    { id: 3, date: "2025-11-18", home: "부엉이", away: "흰수염", stadium: "흰수염 돔", time: "17:30", price: "20,000원" },
    { id: 4, date: "2025-11-24", home: "현무", away: "참새", stadium: "현무 아레나", time: "15:00", price: "19,000원" },
    { id: 5, date: "2025-11-30", home: "문어", away: "두꺼비", stadium: "문어 돔", time: "14:00", price: "23,000원" },
  ];

  // 🔹 openTicket을 useEffect보다 위에 두기 (호출 전에 정의되어 있어야 함)
  const openTicket = (m: Match) => {
    setActiveMatch(m);
    setSeatGrade(null);
    setQty(1);
    setPromo("");
    setDiscountApplied(null);
    setPayMethod(null);
    setAgree(false);
    setTicketOpen(true);
  };

  useEffect(() => {
    // 1) matchId가 넘어온 경우: 그 경기 찾아서 날짜 맞추고 모달까지 띄우기
    if (params.matchId) {
      const id = Number(params.matchId);
      const m = matches.find((mm) => mm.id === id);
      if (m) {
        const d = new Date(m.date + "T00:00:00");
        setSelectedDate(startOfDay(d)); // 날짜 세팅
        openTicket(m);                  // 모달 자동 오픈
      }
      return;
    }

    // 2) date만 넘어온 경우: 그 날짜만 세팅
    if (params.date) {
      const d = new Date(String(params.date) + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setSelectedDate(startOfDay(d));
      }
    }
  }, [params.matchId, params.date]);

  const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
  const filteredMatches = useMemo(
    () => matches.filter((m) => sameYMD(new Date(m.date + "T00:00:00"), selectedDate)),
    [matches, selectedDate]
  );

  const onChangeDate = (_: any, date?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (date && date >= minDate && date <= maxDate) setSelectedDate(startOfDay(date));
  };

  const subtotal = seatGrade ? PRICE_MAP[seatGrade] * qty : 0;
  const discount = discountApplied?.amount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const applyPromo = () => {
    if (!seatGrade) return;
    const base = PRICE_MAP[seatGrade] * qty;
    if (promo.trim().toUpperCase() === "GOAL10") setDiscountApplied({ code: "GOAL10", amount: Math.floor(base * 0.1) });
    else if (promo.trim().toUpperCase() === "RED5") setDiscountApplied({ code: "RED5", amount: Math.floor(base * 0.05) });
    else setDiscountApplied(null);
  };

  const confirmPay = () => {
    if (!activeMatch || !seatGrade || !payMethod || !agree) return;
    console.log("결제 요청", {
      matchId: activeMatch.id,
      seatGrade,
      qty,
      promo: discountApplied?.code ?? null,
      payMethod,
      total,
    });
    setTicketOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <TouchableOpacity
        style={styles.dateSection}
        activeOpacity={0.8}
        onPress={() => setShowPicker(true)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="날짜 선택"
      >
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Ionicons name="chevron-down" size={16} color="#aaa" />
        </View>
        <Text style={styles.hintText}>날짜를 선택하면 해당 경기가 표시됩니다</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>전체 경기</Text>
      {filteredMatches.length > 0 ? (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.teamsRow}>
                <Text style={[styles.teamName, { textAlign: "left" }]}>{item.home}</Text>
                <Text style={styles.vs}>VS</Text>
                <Text style={[styles.teamName, { textAlign: "right" }]}>{item.away}</Text>
              </View>
              <Text style={styles.stadium}>
                {item.stadium} | {item.time}
              </Text>
              <TouchableOpacity style={styles.reserveBtn} onPress={() => openTicket(item)}>
                <Text style={styles.reserveText}>예매하기</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>이 날짜에는 경기가 없습니다.</Text>
      )}

      {showPicker && (
        <Modal transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "android" ? "calendar" : "inline"}
                onChange={onChangeDate}
                minimumDate={minDate}
                maximumDate={maxDate}
                themeVariant="dark"
              />
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPicker(false)}>
                <Text style={styles.modalCloseText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={ticketOpen} transparent animationType="fade" onRequestClose={() => setTicketOpen(false)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>티켓 예매</Text>
              <TouchableOpacity onPress={() => setTicketOpen(false)} accessibilityRole="button" accessibilityLabel="팝업 닫기">
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 6 }}>
              {activeMatch && (
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryTeams}>
                    {activeMatch.home} vs {activeMatch.away}
                  </Text>
                  <Text style={styles.summaryInfo}>
                    {activeMatch.stadium} | {activeMatch.time}
                  </Text>
                </View>
              )}

              <Text style={styles.fieldLabel}>좌석 등급</Text>
              <View style={styles.gradeRow}>
                {(["S", "A", "B"] as const).map((g) => {
                  const on = seatGrade === g;
                  const price = PRICE_MAP[g];
                  return (
                    <TouchableOpacity key={g} style={[styles.gradeBtn, on && styles.gradeOn]} onPress={() => setSeatGrade(g)}>
                      <Text style={[styles.gradeText, on && styles.gradeTextOn]}>{g}석</Text>
                      <Text style={[styles.gradePrice, on && styles.gradeTextOn]}>{formatCurrency(price)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>수량</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={[styles.qtyBtn, qty <= 1 && { opacity: 0.4 }]}
                  onPress={() => qty > 1 && setQty(qty - 1)}
                  accessibilityRole="button"
                  accessibilityLabel="수량 감소"
                >
                  <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{qty}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, qty >= 6 && { opacity: 0.4 }]}
                  onPress={() => qty < 6 && setQty(qty + 1)}
                  accessibilityRole="button"
                  accessibilityLabel="수량 증가"
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>결제 수단</Text>
              <View style={styles.payRow}>
                <Pressable style={styles.payChip} onPress={() => setPayMethod("card")}>
                  <Ionicons name={payMethod === "card" ? "radio-button-on" : "radio-button-off"} size={18} color="#fff" />
                  <Text style={styles.payText}>카드 결제</Text>
                </Pressable>
                <Pressable style={styles.payChip} onPress={() => setPayMethod("easy")}>
                  <Ionicons name={payMethod === "easy" ? "radio-button-on" : "radio-button-off"} size={18} color="#fff" />
                  <Text style={styles.payText}>간편결제</Text>
                </Pressable>
              </View>

              <Pressable style={styles.agreeRow} onPress={() => setAgree((v) => !v)}>
                <Ionicons name={agree ? "checkbox" : "square-outline"} size={18} color="#fff" />
                <Text style={styles.agreeText}>예매 규정 및 취소수수료 안내에 동의합니다</Text>
              </Pressable>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>총 결제금액</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>

              <TouchableOpacity
                style={[styles.payBtn, (!seatGrade || !payMethod || !agree || total <= 0) && { opacity: 0.4 }]}
                disabled={!seatGrade || !payMethod || !agree || total <= 0}
                onPress={confirmPay}
              >
                <Text style={styles.payBtnText}>결제하기</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 18, paddingTop: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  dateSection: { backgroundColor: "#121212", borderRadius: 12, paddingVertical: 22, marginBottom: 18, paddingHorizontal: 18 },
  dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  dateText: { color: "#f5f5f5", fontSize: 17, fontWeight: "700" },
  hintText: { color: "#9ca3af", fontSize: 12, textAlign: "center", marginTop: 6 },

  sectionTitle: { color: Colors.primary, fontSize: 15, fontWeight: "700", marginBottom: 10 },
  card: { backgroundColor: "#1A1A1A", borderRadius: 18, paddingVertical: 22, paddingHorizontal: 20, alignItems: "center", marginBottom: 16 },
  teamsRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  teamName: { color: "#fff", fontSize: 17, fontWeight: "700", width: "40%" },
  vs: { color: Colors.primary, fontSize: 15, fontWeight: "700", textAlign: "center", width: "20%" },
  stadium: { color: "#ccc", fontSize: 13, marginBottom: 10 },
  reserveBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 30 },
  reserveText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyText: { color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 30 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#1A1A1A", borderRadius: 16, padding: 16, width: "90%" },
  modalCloseBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 8, marginTop: 10, alignItems: "center" },
  modalCloseText: { color: "#fff", fontWeight: "600" },

  dialogBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 16,
    width: "92%",
    maxWidth: 480,
    maxHeight: "88%",
  },

  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sheetTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

  summaryBox: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 12, marginBottom: 12 },
  summaryTeams: { color: "#fff", fontSize: 15, fontWeight: "800" },
  summaryInfo: { color: "#cfcfcf", fontSize: 12, marginTop: 4 },

  fieldLabel: { color: "#b5b5b5", fontSize: 12, marginBottom: 8 },
  gradeRow: { flexDirection: "row", gap: 8 },
  gradeBtn: { flex: 1, backgroundColor: "#1E1E1E", borderRadius: 12, padding: 12, alignItems: "center" },
  gradeOn: { backgroundColor: Colors.primary },
  gradeText: { color: "#fff", fontWeight: "700", marginBottom: 4 },
  gradeTextOn: { color: "#fff" },
  gradePrice: { color: "#cfcfcf", fontSize: 12 },

  qtyRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  qtyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#1E1E1E", alignItems: "center", justifyContent: "center" },
  qtyValue: { color: "#fff", fontSize: 16, fontWeight: "800" },

  promoRow: { flexDirection: "row", gap: 8 },
  promoInput: { flex: 1, backgroundColor: "#1E1E1E", borderRadius: 10, paddingHorizontal: 12, color: "#fff", height: 40 },
  promoBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  promoBtnText: { color: "#fff", fontWeight: "800" },
  promoApplied: { color: "#22c55e", fontSize: 12, marginTop: 6 },

  payRow: { flexDirection: "row", gap: 14, marginTop: 4 },
  payChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#1E1E1E", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  payText: { color: "#fff", fontSize: 12 },

  agreeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  agreeText: { color: "#cfcfcf", fontSize: 12 },

  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  totalLabel: { color: "#cfcfcf", fontSize: 13 },
  totalValue: { color: "#fff", fontSize: 18, fontWeight: "900" },

  payBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 12 },
  payBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
});
