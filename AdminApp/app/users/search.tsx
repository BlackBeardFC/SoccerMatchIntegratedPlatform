import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
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

type Anchor = { x: number; y: number; w: number; h: number };

export default function UserSearchHeader({
  search,
  onChangeSearch,
  onSubmitSearch,
  selectedSort,
  onChangeSort,
  selectedStatus,
  onChangeStatus,
}: Props) {
  const statusBtnRef = useRef<View>(null);
  const sortBtnRef = useRef<View>(null);

  const [open, setOpen] = useState<null | "status" | "sort">(null);
  const [anchor, setAnchor] = useState<Anchor>({ x: 0, y: 0, w: 0, h: 0 });

  const statusLabel = useMemo(() => {
    if (!selectedStatus || selectedStatus === "전체") return "카테고리 선택";
    return selectedStatus;
  }, [selectedStatus]);

  const sortLabel = useMemo(() => {
    if (!selectedSort) return "기본 정렬";
    return selectedSort;
  }, [selectedSort]);

  const close = () => setOpen(null);

  const openStatus = () => {
    statusBtnRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen("status");
    });
  };

  const openSort = () => {
    sortBtnRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen("sort");
    });
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

      {/* 필터 (좌우 배치) */}
      <View style={styles.filterRow}>
        {/* 상태 */}
        <TouchableOpacity
          ref={statusBtnRef}
          style={styles.filterSelect}
          activeOpacity={0.85}
          onPress={() => {
            if (open === "status") close();
            else openStatus();
          }}
        >
          <Text style={styles.filterSelectText}>{statusLabel}</Text>
          <Ionicons
            name={open === "status" ? "chevron-up" : "chevron-down"}
            size={18}
            color="#2563EB"
          />
        </TouchableOpacity>

        {/* 정렬 */}
        <TouchableOpacity
          ref={sortBtnRef}
          style={styles.filterSelect}
          activeOpacity={0.85}
          onPress={() => {
            if (open === "sort") close();
            else openSort();
          }}
        >
          <Text style={styles.filterSelectText}>{sortLabel}</Text>
          <Ionicons
            name={open === "sort" ? "chevron-up" : "chevron-down"}
            size={18}
            color="#2563EB"
          />
        </TouchableOpacity>
      </View>

      {/* ✅ 드롭다운: FlatList 영향 안 받게 Modal로 띄움 (버튼 아래에 위치) */}
      <Modal
        visible={open !== null}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.modalBackdrop} onPress={close} />

        <View
          style={[
            styles.dropdownCard,
            {
              left: anchor.x,
              top: anchor.y + anchor.h + 8,
              width: anchor.w,
            },
          ]}
        >
          {(open === "status" ? STATUS_OPTIONS : SORT_OPTIONS).map((opt) => {
            const selected =
              open === "status"
                ? opt === selectedStatus
                : opt === selectedSort;

            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.dropdownItem,
                  selected && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  if (open === "status") onChangeStatus(opt as StatusFilterType);
                  else onChangeSort(opt as SortType);
                  close();
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selected && styles.dropdownTextSelected,
                  ]}
                >
                  {opt}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={16} color="#2563EB" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}

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
    color: "#111827",
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
    paddingVertical: 8,
  },
  filterSelectText: {
    fontSize: 13,
    color: "$485563",
    fontWeight: "400",
  },

  // Modal backdrop
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  // ✅ 버튼 아래에 뜨는 카드
  dropdownCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
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
