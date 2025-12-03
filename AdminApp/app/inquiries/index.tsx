import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InquiryStatus = "답변대기" | "답변완료";

type Inquiry = {
  id: string;
  status: InquiryStatus;
  date: string;
  title: string;
  content: string;
};

const INQUIRIES: Inquiry[] = [
  {
    id: "1",
    status: "답변대기",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
  },
  {
    id: "2",
    status: "답변대기",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
  },
  {
    id: "3",
    status: "답변대기",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
  },
  {
    id: "4",
    status: "답변대기",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
  },
  {
    id: "5",
    status: "답변완료",
    date: "2025.01.15",
    title: "예매 관련 문의사항",
    content: "예매 취소는 어떻게 하나요?",
  },
];

export default function InquiriesScreen() {
  const renderItem = ({ item, index }: { item: Inquiry; index: number }) => {
    const isAnswered = item.status === "답변완료";

    return (
      <View style={styles.card}>
        {/* 위 한 줄 : 상태 배지 + 날짜 */}
        <View style={styles.cardTopRow}>
          <View
            style={[
              styles.statusBadge,
              isAnswered ? styles.statusBadgeDone : styles.statusBadgePending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isAnswered ? styles.statusTextDone : styles.statusTextPending,
              ]}
            >
              {item.status}
            </Text>
          </View>

          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* 제목 + 내용 프리뷰 */}
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.contentText}>{item.content}</Text>

        {/* 아래 오른쪽 버튼 영역 */}
        <View style={styles.actionRow}>
          <View style={{ flex: 1 }} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.answerButton}>
              <Text style={styles.answerButtonText}>답변</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>
                {index === INQUIRIES.length - 1 ? "확인" : "삭제"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={INQUIRIES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  statusBadgePending: {
    backgroundColor: "#F973161A",
  },
  statusBadgeDone: {
    backgroundColor: "#22C55E1A", 
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextPending: {
    color: "#EA580C", 
  },
  statusTextDone: {
    color: "#16A34A",
  },

  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },

  titleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  contentText: {
    fontSize: 13,
    color: "#6B7280",
  },

  actionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  answerButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#5182ecff",
    backgroundColor: "#d9e5ffff",
  },
  answerButtonText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },

  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F97373",
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },
});
