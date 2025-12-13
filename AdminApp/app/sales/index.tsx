// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import ExcelJS from "exceljs";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import { Buffer } from "buffer";

// type SaleItem = {
//   id: string;
//   paidAt: string;
//   orderNo: string;
//   userName: string;
//   matchName: string;
//   amount: number;
//   settlementAmount: number;
//   paymentStatus: "PAID" | "CANCELED"; // 환불 제거
//   settlementStatus: "PENDING" | "DONE" | "HOLD";
// };

// const MOCK_SALES: SaleItem[] = [
//   {
//     id: "1",
//     paidAt: "2025-09-15 14:21",
//     orderNo: "ORD-20250915-001",
//     userName: "홍길동",
//     matchName: "검은수염 FC vs 라쿤 FC",
//     amount: 60000,
//     settlementAmount: 54000,
//     paymentStatus: "PAID",
//     settlementStatus: "PENDING",
//   },
//   {
//     id: "2",
//     paidAt: "2025-09-15 15:02",
//     orderNo: "ORD-20250915-002",
//     userName: "김철수",
//     matchName: "뱀 FC vs 부엉이 FC",
//     amount: 80000,
//     settlementAmount: 72000,
//     paymentStatus: "CANCELED",
//     settlementStatus: "HOLD",
//   },
//   {
//     id: "3",
//     paidAt: "2025-09-16 11:05",
//     orderNo: "ORD-20250916-003",
//     userName: "이영희",
//     matchName: "검은수염 FC vs 부엉이 FC",
//     amount: 90000,
//     settlementAmount: 81000,
//     paymentStatus: "PAID",
//     settlementStatus: "DONE",
//   },
// ];

// const PRIMARY = "#2563EB";
// const PRIMARY_LIGHT = "#E5EDFF";
// const BG = "#F3F4F6";
// const BORDER = "#E5E7EB";
// const TEXT_DARK = "#111827";

// const TABS = [
//   { key: "ALL", label: "전체" },
//   { key: "DONE", label: "정산 완료" },
//   { key: "CANCELED", label: "취소" },
// ] as const;

// // -------- 엑셀 다운로드 함수 --------
// async function downloadExcelFile(data: SaleItem[]) {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("매출 내역");

//     sheet.columns = [
//       { header: "주문번호", key: "orderNo", width: 20 },
//       { header: "결제자", key: "userName", width: 12 },
//       { header: "경기명", key: "matchName", width: 28 },
//       { header: "결제금액", key: "amount", width: 14 },
//       { header: "정산금액", key: "settlementAmount", width: 14 },
//       { header: "결제상태", key: "paymentStatus", width: 12 },
//       { header: "정산상태", key: "settlementStatus", width: 12 },
//       { header: "결제시간", key: "paidAt", width: 20 },
//     ];

//     // 헤더 스타일
//     sheet.getRow(1).eachCell((cell) => {
//       cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FF2563EB" },
//       };
//       cell.alignment = { vertical: "middle", horizontal: "center" };
//     });

//     // 데이터 행
//     data.forEach((item) => {
//       sheet.addRow({
//         orderNo: item.orderNo,
//         userName: item.userName,
//         matchName: item.matchName,
//         amount: item.amount,
//         settlementAmount: item.settlementAmount,
//         paymentStatus: item.paymentStatus === "PAID" ? "결제완료" : "취소",
//         settlementStatus:
//           item.settlementStatus === "DONE"
//             ? "정산완료"
//             : item.settlementStatus === "HOLD"
//             ? "보류"
//             : "정산대기",
//         paidAt: item.paidAt,
//       });
//     });

//     // 숫자 포맷
//     sheet.getColumn("amount").numFmt = "#,##0";
//     sheet.getColumn("settlementAmount").numFmt = "#,##0";

//     const fileUri = FileSystem.cacheDirectory + "sales_export.xlsx";
//     const buffer = await workbook.xlsx.writeBuffer();

//     await FileSystem.writeAsStringAsync(
//       fileUri,
//       Buffer.from(buffer as ArrayBuffer).toString("base64"),
//       { encoding: FileSystem.EncodingType.Base64 }
//     );

//     await Sharing.shareAsync(fileUri);
//   } catch (error) {
//     console.error("엑셀 다운로드 오류:", error);
//     Alert.alert("오류", "엑셀 다운로드 중 오류가 발생했습니다.");
//   }
// }

// // -------- 화면 컴포넌트 --------
// export default function SalesScreen() {
//   const [sales, setSales] = useState<SaleItem[]>(MOCK_SALES);
//   const [activeTab, setActiveTab] =
//     useState<(typeof TABS)[number]["key"]>("ALL");

//   const [search, setSearch] = useState("");

//   const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(
//     null
//   );
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [tempDate, setTempDate] = useState(new Date());

//   const [selectedIds, setSelectedIds] = useState<string[]>([]);

//   const toggleSelect = (id: string, selectable: boolean) => {
//     if (!selectable) return;
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSettleSelected = () => {
//     if (selectedIds.length === 0) {
//       Alert.alert("알림", "정산 처리할 항목을 선택해주세요.");
//       return;
//     }

//     setSales((prev) =>
//       prev.map((item) =>
//         selectedIds.includes(item.id)
//           ? { ...item, settlementStatus: "DONE" }
//           : item
//       )
//     );

//     setSelectedIds([]);
//     Alert.alert("완료", "선택 항목 정산 처리가 완료되었습니다.");
//   };

//   const filteredData = sales.filter((item) => {
//     if (activeTab === "DONE" && item.settlementStatus !== "DONE") return false;
//     if (activeTab === "CANCELED" && item.paymentStatus !== "CANCELED")
//       return false;

//     if (search.length > 0) {
//       const key = `${item.orderNo}${item.userName}${item.matchName}`;
//       return key.toLowerCase().includes(search.toLowerCase());
//     }

//     return true;
//   });

//   const totalAmount = filteredData.reduce((a, c) => a + c.amount, 0);
//   const totalSettlement = filteredData.reduce(
//     (a, c) => a + c.settlementAmount,
//     0
//   );

//   const renderSaleItem = ({ item }: { item: SaleItem }) => {
//     const isSelectable =
//       item.paymentStatus === "PAID" && item.settlementStatus !== "DONE";
//     const isSelected = selectedIds.includes(item.id);

//     return (
//       <View style={styles.row}>
//         {/* 체크박스 */}
//         <TouchableOpacity
//           onPress={() => toggleSelect(item.id, isSelectable)}
//           disabled={!isSelectable}
//           style={styles.checkboxWrapper}
//         >
//           <View
//             style={[
//               styles.checkboxBase,
//               !isSelectable && styles.checkboxDisabled,
//               isSelected && styles.checkboxChecked,
//             ]}
//           >
//             {isSelected && <Text style={styles.checkboxMark}>✓</Text>}
//           </View>
//         </TouchableOpacity>

//         {/* 메인 정보 */}
//         <View style={styles.rowMain}>
//           <Text style={styles.rowMatch}>{item.matchName}</Text>
//           <Text style={styles.rowSub}>
//             {item.paidAt} · {item.orderNo}
//           </Text>
//         </View>

//         {/* 오른쪽 */}
//         <View style={styles.rowRight}>
//           <Text style={styles.rowAmount}>
//             {item.amount.toLocaleString("ko-KR")}원
//           </Text>
//           <View style={styles.rowBadges}>
//             <Text style={[styles.badge, styles.badgePayment]}>
//               {item.paymentStatus === "PAID" ? "결제완료" : "취소"}
//             </Text>
//             {item.settlementStatus === "DONE" && (
//               <Text style={[styles.badge, styles.badgeSettleDone]}>
//                 정산완료
//               </Text>
//             )}
//             {item.settlementStatus === "HOLD" && (
//               <Text style={[styles.badge, styles.badgeSettleHold]}>보류</Text>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* 필터 카드 */}
//         <View style={styles.filterCard}>
//           <View style={styles.filterRow}>
//             <View style={styles.filterField}>
//               <Text style={styles.filterLabel}>시작일</Text>
//               <TouchableOpacity
//                 style={styles.filterInput}
//                 onPress={() => {
//                   setPickerTarget("start");
//                   setTempDate(startDate ?? new Date());
//                 }}
//               >
//                 <Text style={styles.filterInputText}>
//                   {startDate ? startDate.toISOString().slice(0, 10) : "시작일"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.filterField}>
//               <Text style={styles.filterLabel}>종료일</Text>
//               <TouchableOpacity
//                 style={styles.filterInput}
//                 onPress={() => {
//                   setPickerTarget("end");
//                   setTempDate(endDate ?? new Date());
//                 }}
//               >
//                 <Text style={styles.filterInputText}>
//                   {endDate ? endDate.toISOString().slice(0, 10) : "종료일"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.searchRow}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="주문번호 / 이름 / 경기명 검색"
//               placeholderTextColor="#9CA3AF"
//               value={search}
//               onChangeText={setSearch}
//             />
//             <TouchableOpacity style={styles.searchButton}>
//               <Text style={styles.searchButtonText}>검색</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* 요약 */}
//         <View style={styles.summaryRow}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryLabel}>총 매출액</Text>
//             <Text style={styles.summaryValue}>
//               {totalAmount.toLocaleString("ko-KR")}원
//             </Text>
//           </View>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryLabel}>정산 예정 금액</Text>
//             <Text style={styles.summaryValue}>
//               {totalSettlement.toLocaleString("ko-KR")}원
//             </Text>
//           </View>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryLabel}>총 건수</Text>
//             <Text style={styles.summaryValue}>{filteredData.length}건</Text>
//           </View>
//         </View>

//         {/* 탭 */}
//         <View style={styles.tabRow}>
//           {TABS.map((tab) => {
//             const isActive = activeTab === tab.key;
//             return (
//               <TouchableOpacity
//                 key={tab.key}
//                 onPress={() => setActiveTab(tab.key)}
//                 style={[styles.tabChip, isActive && styles.tabChipActive]}
//               >
//                 <Text
//                   style={[styles.tabText, isActive && styles.tabTextActive]}
//                 >
//                   {tab.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* 액션 버튼 */}
//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={styles.actionPrimary}
//             onPress={handleSettleSelected}
//           >
//             <Text style={styles.actionPrimaryText}>선택 항목 정산 처리</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionOutline}
//             onPress={() => downloadExcelFile(sales)} // 전체 데이터 기준
//           >
//             <Text style={styles.actionOutlineText}>엑셀 다운로드</Text>
//           </TouchableOpacity>
//         </View>

//         {/* 리스트 */}
//         <View style={styles.listCard}>
//           <FlatList
//             data={filteredData}
//             keyExtractor={(item) => item.id}
//             renderItem={renderSaleItem}
//             ItemSeparatorComponent={() => (
//               <View style={styles.rowDivider} />
//             )}
//           />
//         </View>

//         {/* 날짜 Picker Wheel */}
//         {pickerTarget && (
//           <View style={styles.datePickerContainer}>
//             <View style={styles.selectionOverlay} />

//             <DateTimePicker
//               mode="date"
//               display="spinner"
//               value={tempDate}
//               textColor="#111827"
//               style={styles.datePicker}
//               onChange={(_, d) => d && setTempDate(d)}
//             />

//             <TouchableOpacity
//               style={styles.datePickerConfirm}
//               onPress={() => {
//                 if (pickerTarget === "start") setStartDate(tempDate);
//                 if (pickerTarget === "end") setEndDate(tempDate);
//                 setPickerTarget(null);
//               }}
//             >
//               <Text style={styles.datePickerConfirmText}>확인</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---------- 스타일 ---------- */

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: BG },
//   container: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },

//   filterCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 12,
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     elevation: 1,
//   },
//   filterRow: { flexDirection: "row", columnGap: 10, marginBottom: 10 },
//   filterField: { flex: 1 },
//   filterLabel: { fontSize: 11, color: "#6B7280", marginBottom: 4 },
//   filterInput: {
//     borderWidth: 1,
//     borderColor: BORDER,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   filterInputText: { color: TEXT_DARK, fontSize: 13 },

//   searchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     columnGap: 8,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: BORDER,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 13,
//   },
//   searchButton: {
//     backgroundColor: PRIMARY,
//     paddingHorizontal: 14,
//     paddingVertical: 9,
//     borderRadius: 10,
//   },
//   searchButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },

//   summaryRow: { flexDirection: "row", columnGap: 8, marginBottom: 10 },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
//   summaryLabel: { fontSize: 11, color: "#6B7280" },
//   summaryValue: { fontSize: 14, fontWeight: "700", color: PRIMARY },

//   tabRow: { flexDirection: "row", columnGap: 8, marginBottom: 8 },
//   tabChip: {
//     backgroundColor: "#fff",
//     borderColor: "#D1D5DB",
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   tabChipActive: { backgroundColor: PRIMARY_LIGHT, borderColor: PRIMARY },
//   tabText: { fontSize: 12, color: "#4B5563" },
//   tabTextActive: { color: PRIMARY, fontWeight: "600" },

//   actionRow: { flexDirection: "row", columnGap: 8, marginBottom: 8 },
//   actionPrimary: {
//     flex: 1,
//     backgroundColor: PRIMARY,
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   actionPrimaryText: { color: "#fff", fontWeight: "600", fontSize: 13 },
//   actionOutline: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//   },
//   actionOutlineText: { color: "#374151", fontSize: 13 },

//   listCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     padding: 10,
//     elevation: 1,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//   },

//   checkboxWrapper: { marginRight: 8 },
//   checkboxBase: {
//     width: 18,
//     height: 18,
//     borderRadius: 3,
//     borderWidth: 1,
//     borderColor: "#9CA3AF",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   checkboxChecked: {
//     backgroundColor: PRIMARY,
//     borderColor: PRIMARY,
//   },
//   checkboxDisabled: { opacity: 0.4 },
//   checkboxMark: { color: "#fff", fontWeight: "700", fontSize: 13 },

//   rowMain: { flex: 1, paddingRight: 10 },
//   rowMatch: { fontSize: 13, fontWeight: "600", color: TEXT_DARK },
//   rowSub: { fontSize: 11, color: "#6B7280", marginTop: 2 },
//   rowRight: { alignItems: "flex-end" },
//   rowAmount: { fontSize: 13, fontWeight: "700", color: PRIMARY },
//   rowBadges: { flexDirection: "row", columnGap: 4, marginTop: 4 },

//   badge: {
//     fontSize: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 999,
//   },
//   badgePayment: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
//   badgeSettleDone: { backgroundColor: "#DCFCE7", color: "#166534" },
//   badgeSettleHold: { backgroundColor: "#FEE2E2", color: "#B91C1C" },

//   rowDivider: { height: 1, backgroundColor: BORDER },

//   datePickerContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     alignItems: "center",
//   },
//   selectionOverlay: {
//     position: "absolute",
//     top: "50%",
//     transform: [{ translateY: -20 }],
//     height: 40,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(37, 99, 235, 0.12)",
//     pointerEvents: "none",
//   },
//   datePicker: {
//     width: "100%",
//     transform: [{ translateX: 10 }],
//   },
//   datePickerConfirm: {
//     width: "100%",
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: BORDER,
//     alignItems: "center",
//   },
//   datePickerConfirmText: { fontSize: 14, fontWeight: "600", color: PRIMARY },
// });
