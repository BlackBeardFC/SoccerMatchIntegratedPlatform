import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InquirySearchBar, { CategoryType, StatusFilterType } from "./search";
import AnswerModal from "./answer";
import DeleteConfirmModal from "./delete";

type InquiryStatus = "답변대기" | "답변완료";

type Inquiry = {
  id: string;
  status: InquiryStatus;
  date: string;
  title: string;
  content: string;
};

const INITIAL_INQUIRIES: Inquiry[] = [
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("전체");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("전체");

  // 🔹 문의 목록을 state로 관리
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);

  // 🔹 답변 모달 상태
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // 삭제용 모달 상태
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  // 🔍 실제 필터링 로직은 나중에 여기서 구현
  const filteredInquiries = inquiries;

  const handleOpenAnswerModal = (item: Inquiry) => {
    setSelectedInquiry(item);
    setAnswerModalVisible(true);
  };

  const handleSubmitAnswer = (answerText: string) => {
    if (!selectedInquiry) return;

    console.log("➡️ 서버로 보낼 답변:", {
      inquiryId: selectedInquiry.id,
      answer: answerText,
    });

    // 일단 프론트에서만 상태를 '답변완료'로 바꿔줌
    setInquiries((prev) =>
      prev.map((q) =>
        q.id === selectedInquiry.id ? { ...q, status: "답변완료" } : q
      )
    );

    setAnswerModalVisible(false);
    setSelectedInquiry(null);
  };

  const renderItem = ({ item, index }: { item: Inquiry; index: number }) => {
    const isAnswered = item.status === "답변완료";

    return (
      <View style={styles.card}>
        <View style={styles.cardMainRow}>
          {/* 왼쪽 텍스트 영역 */}
          <View style={styles.cardTextArea}>
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

            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
          </View>

          {/* 오른쪽 버튼 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.deleteButton}
            onPress={() => handleAskDelete(item)} >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.answerButton}
              onPress={() => handleOpenAnswerModal(item)}  // 🔹 여기서 모달 오픈
            >
              <Text style={styles.answerButtonText}>답변</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleAskDelete = (item: Inquiry) => {
  setDeleteTarget(item);
  setDeleteModalVisible(true);
};

const handleConfirmDelete = () => {
  if (!deleteTarget) return;

  setInquiries((prev) => prev.filter((q) => q.id !== deleteTarget.id));

  // 만약 답변 모달이 그 문의를 보고 있었다면 닫기
  if (selectedInquiry && selectedInquiry.id === deleteTarget.id) {
    setSelectedInquiry(null);
    setAnswerModalVisible(false);
  }

  setDeleteModalVisible(false);
  setDeleteTarget(null);
};

const handleCancelDelete = () => {
  setDeleteModalVisible(false);
  setDeleteTarget(null);
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔍 검색 / 카테고리 컴포넌트 */}
        <InquirySearchBar
          search={search}
          onChangeSearch={setSearch}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
          statusFilter={statusFilter}
          onChangeStatusFilter={setStatusFilter}
        />

        {/* 문의 리스트 */}
        <FlatList
          data={filteredInquiries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* 🔹 답변 작성 모달 */}
        <AnswerModal
          visible={answerModalVisible}
          onClose={() => {
            setAnswerModalVisible(false);
            setSelectedInquiry(null);
          }}
          inquiryTitle={selectedInquiry?.title ?? ""}
          inquiryContent={selectedInquiry?.content ?? ""}
          onSubmit={handleSubmitAnswer}
        />

        <DeleteConfirmModal
          visible={deleteModalVisible}
          title="문의 삭제"
          message={
            deleteTarget
              ? `"${deleteTarget.title}" 문의를 삭제하시겠습니까?`
              : "이 문의를 삭제하시겠습니까?"
          }
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
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

  // 카드 스타일
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  cardMainRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  cardTextArea: {
    flex: 1,
    paddingRight: 8,
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

  // 버튼
  actionButtons: {
    flexDirection: "row",     // ⬅ 좌우 배치
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 8,             // 버튼 간 간격
    marginTop: 5,
  },
  answerButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
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
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },
});
