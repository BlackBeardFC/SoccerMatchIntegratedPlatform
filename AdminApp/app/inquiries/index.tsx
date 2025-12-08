import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

// 🔹 문의 카테고리
const CATEGORIES = [
  "전체",
  "예매",
  "결제",
  "환불",
  "계정",
  "기술지원",
  "기타문의",
] as const;
type CategoryType = (typeof CATEGORIES)[number];

export default function InquiriesScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("전체");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // 지금은 실제 필터링 없이 UI만
  const filteredInquiries = INQUIRIES;

  const renderItem = ({ item, index }: { item: Inquiry; index: number }) => {
  const isAnswered = item.status === "답변완료";

  return (
    <View style={styles.card}>
      {/* ⬇️ 카드 전체를 좌우로 나눈다 */}
      <View style={styles.cardMainRow}>
        {/* 왼쪽: 상태/날짜/제목/내용 */}
        <View style={styles.cardTextArea}>
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
        </View>

        {/* 오른쪽: 버튼 세로 배치 */}
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

  const toggleCategory = () => setCategoryOpen((prev) => !prev);

  const handleSelectCategory = (cat: CategoryType) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔍 검색 + 버튼 */}
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
              placeholder="문의 제목이나 내용으로 검색"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>

        {/* 📂 카테고리 드롭다운 버튼 */}
        <View style={styles.categoryWrapper}>
          <TouchableOpacity
            style={styles.categoryButton}
            activeOpacity={0.8}
            onPress={toggleCategory}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategory === "전체"
                ? "카테고리 선택 "
                : selectedCategory}
            </Text>
            <Ionicons
              name={categoryOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#2563EB"
            />
          </TouchableOpacity>

          {/* 드롭다운 목록 */}
          {categoryOpen && (
            <View style={styles.categoryList}>
              {CATEGORIES.map((cat) => {
                const isSelected = cat === selectedCategory;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.categoryItemSelected,
                    ]}
                    onPress={() => handleSelectCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        isSelected && styles.categoryItemTextSelected,
                      ]}
                    >
                      {cat === "전체" ? "전체 카테고리" : cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* 문의 리스트 */}
        <FlatList
          data={filteredInquiries}
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

  // 🔍 검색
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#2563EB",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // 📂 카테고리 드롭다운
  categoryWrapper: {
    marginBottom: 15,
    alignItems: "flex-end",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButtonText: {
    fontSize: 13,
    color: "#4B5563",
  },
  categoryList: {
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  categoryItemText: {
    fontSize: 13,
    color: "#4B5563",
  },
  categoryItemTextSelected: {
    color: "#2563EB",
    fontWeight: "600",
  },

  // 카드
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
  cardMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionButtons: {
    flexDirection: "column",  
    alignItems: "flex-end", 
    justifyContent: "flex-start",
    rowGap: 6,  
    marginTop: 5, 
  },  

  answerButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
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
    borderColor: "#F97373",
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },
});
