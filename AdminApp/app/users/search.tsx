// app/users/search.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 정렬 옵션
export const SORT_OPTIONS = [
  "기본 정렬",
  "최신 등록순",
  "오래된 순",
  "최근 구매순",
] as const;
export type SortType = (typeof SORT_OPTIONS)[number];

// 상태(카테고리) 옵션
export const STATUS_OPTIONS = ["전체", "활성", "비활성", "강제탈퇴"] as const;
export type StatusFilterType = (typeof STATUS_OPTIONS)[number];

type Props = {
  search: string;
  onChangeSearch: (text: string) => void;
  onSubmitSearch: () => void;

  selectedSort: SortType;
  onChangeSort: (sort: SortType) => void;

  selectedStatus: StatusFilterType;
  onChangeStatus: (status: StatusFilterType) => void;
};

const UserSearchHeader: React.FC<Props> = ({
  search,
  onChangeSearch,
  onSubmitSearch,
  selectedSort,
  onChangeSort,
  selectedStatus,
  onChangeStatus,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const handleSelectSort = (value: SortType) => {
    onChangeSort(value);
    setSortOpen(false);
  };

  const handleSelectStatus = (value: StatusFilterType) => {
    onChangeStatus(value);
    setStatusOpen(false);
  };

  return (
    <View>
      {/* 검색 영역 */}
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
            placeholder="사용자 이름으로 검색"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={onChangeSearch}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={onSubmitSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리/정렬 드롭다운 (좌우 배치) */}
      <View style={styles.filterRow}>
        {/* 좌측: 상태 카테고리 */}
        <TouchableOpacity
          style={styles.filterSelect}
          activeOpacity={0.8}
          onPress={() => setStatusOpen(true)}
        >
          <Text style={styles.filterSelectText}>
            {selectedStatus || "카테고리 선택"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#2563EB" />
        </TouchableOpacity>

        {/* 우측: 정렬 */}
        <TouchableOpacity
          style={styles.filterSelect}
          activeOpacity={0.8}
          onPress={() => setSortOpen(true)}
        >
          <Text style={styles.filterSelectText}>
            {selectedSort || "기본 정렬"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* 상태 드롭다운 모달 */}
      <Modal
        visible={statusOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setStatusOpen(false)}
        >
          <View style={styles.dropdownCard}>
            {STATUS_OPTIONS.map((s) => {
              const selected = s === selectedStatus;
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.dropdownItem,
                    selected && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSelectStatus(s)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selected && styles.dropdownTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#2563EB"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 정렬 드롭다운 모달 */}
      <Modal
        visible={sortOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setSortOpen(false)}
        >
          <View style={styles.dropdownCard}>
            {SORT_OPTIONS.map((o) => {
              const selected = o === selectedSort;
              return (
                <TouchableOpacity
                  key={o}
                  style={[
                    styles.dropdownItem,
                    selected && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSelectSort(o)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selected && styles.dropdownTextSelected,
                    ]}
                  >
                    {o}
                  </Text>
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#2563EB"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserSearchHeader;

const styles = StyleSheet.create({
  // 검색 부분
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
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

  // 필터 행 (좌우 배치)
  filterRow: {
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 8,
  },
  filterSelect: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterSelectText: {
    fontSize: 13,
    color: "#4B5563",
  },

  // 드롭다운 모달
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  dropdownCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  dropdownItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  dropdownText: {
    fontSize: 14,
    color: "#4B5563",
  },
  dropdownTextSelected: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
