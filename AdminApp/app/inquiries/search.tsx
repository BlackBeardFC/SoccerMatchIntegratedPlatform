import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  "전체",
  "예매",
  "결제",
  "환불",
  "계정",
  "기술지원",
  "기타문의",
] as const;
export type CategoryType = (typeof CATEGORIES)[number];

const STATUS_OPTIONS = ["전체", "답변대기", "답변완료"] as const;
export type StatusFilterType = (typeof STATUS_OPTIONS)[number];

type Props = {
  search: string;
  onChangeSearch: (text: string) => void;

  selectedCategory: CategoryType;
  onChangeCategory: (cat: CategoryType) => void;

  statusFilter: StatusFilterType;
  onChangeStatusFilter: (status: StatusFilterType) => void;
};

export default function InquirySearchBar({
  search,
  onChangeSearch,
  selectedCategory,
  onChangeCategory,
  statusFilter,
  onChangeStatusFilter,
}: Props) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <View>
      {/* 🔍 검색 */}
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
            onChangeText={onChangeSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* 🔽 카테고리 + 상태 선택 (가로 정렬) */}
      <View style={styles.rowWrapper}>
        {/* 📂 카테고리 */}
        <View style={styles.filterBox}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => {
              setCategoryOpen((prev) => !prev);
              setStatusOpen(false);
            }}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategory === "전체" ? "카테고리 선택" : selectedCategory}
            </Text>
            <Ionicons
              name={categoryOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#2563EB"
            />
          </TouchableOpacity>

          {categoryOpen && (
            <View style={styles.categoryList}>
              {CATEGORIES.map((cat) => {
                const selected = cat === selectedCategory;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      selected && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      onChangeCategory(cat);
                      setCategoryOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        selected && styles.categoryItemTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* 🟩 상태 선택 */}
        <View style={styles.filterBox}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => {
              setStatusOpen((prev) => !prev);
              setCategoryOpen(false);
            }}
          >
            <Text style={styles.categoryButtonText}>
              {statusFilter === "전체" ? "상태 선택" : statusFilter}
            </Text>
            <Ionicons
              name={statusOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#2563EB"
            />
          </TouchableOpacity>

          {statusOpen && (
            <View style={styles.categoryList}>
              {STATUS_OPTIONS.map((status) => {
                const selected = status === statusFilter;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.categoryItem,
                      selected && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      onChangeStatusFilter(status);
                      setStatusOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        selected && styles.categoryItemTextSelected,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🔍 검색 스타일
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

  // 🔽 필터 가로 정렬
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  // 각 필터 박스 (드롭다운 오버레이 기준점)
  filterBox: {
    flex: 1,
    marginHorizontal: 4,
    position: "relative",   // ⬅️ 이걸 기준으로 드롭다운 절대 위치
  },

  // 공통 버튼 UI
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    justifyContent: "space-between",
  },
  categoryButtonText: {
    fontSize: 13,
    color: "#4B5563",
  },

  // 오버레이 드롭다운
  categoryList: {
    position: "absolute",
    top: 44,                 // 버튼 아래로 살짝 띄워서
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 20,              // 리스트 위에 겹치도록
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
});
