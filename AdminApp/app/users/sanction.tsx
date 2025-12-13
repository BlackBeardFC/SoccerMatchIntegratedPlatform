import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { UserDetail } from "./userDetail";

type SanctionStatus = UserDetail["status"];

type Props = {
  currentStatus: SanctionStatus;
  onClose: () => void;
  onApply: (status: SanctionStatus) => void;
};

const SanctionModal: React.FC<Props> = ({
  currentStatus,
  onClose,
  onApply,
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<SanctionStatus>(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleApply = () => {
    onApply(selectedStatus);
  };

  const isSelected = (status: SanctionStatus) =>
    selectedStatus === status;

  return (
    <View>
      <Text style={styles.description}>
        사용자의 계정 상태를 변경할 수 있습니다.
        {"\n"}상태 변경 시 서비스 이용 권한이 달라질 수 있습니다.
      </Text>

      {/* 상태 선택 */}
      <View style={styles.optionGroup}>
        <StatusOption
          label="활성"
          description="서비스를 정상적으로 이용할 수 있습니다."
          active={isSelected("활성")}
          type="활성"
          onSelect={setSelectedStatus}
        />
        <StatusOption
          label="비활성"
          description="로그인/이용은 제한되지만, 데이터는 유지됩니다."
          active={isSelected("비활성")}
          type="비활성"
          onSelect={setSelectedStatus}
        />
        <StatusOption
          label="강제탈퇴"
          description="강력한 제재 상태입니다. 신중히 선택하세요."
          active={isSelected("강제탈퇴")}
          type="강제탈퇴"
          onSelect={setSelectedStatus}
        />
      </View>

      {/* 버튼 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleApply}>
          <Text style={styles.primaryText}>적용</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type StatusOptionProps = {
  label: string;
  description: string;
  active: boolean;
  type: SanctionStatus;
  onSelect: (status: SanctionStatus) => void;
};

const StatusOption: React.FC<StatusOptionProps> = ({
  label,
  description,
  active,
  type,
  onSelect,
}) => {
  // ✅ 상태별 색상 매핑
  const getVariantColors = () => {
    switch (type) {
      case "활성":
        return {
          bg: "#F9FAFB",
          border: "#16A34A",
          label: "#166534",
          radioOuter: "#16A34A",
          radioInner: "#16A34A",
        };
      case "비활성":
        return {
          bg: "#F9FAFB",
          border: "#D97706",
          label: "#92400E",
          radioOuter: "#D97706",
          radioInner: "#D97706",
        };
      case "강제탈퇴":
        return {
          bg: "#F9FAFB",
          border: "#DC2626",
          label: "#991B1B",
          radioOuter: "#DC2626",
          radioInner: "#DC2626",
        };
      default:
        return {
          bg: "#EFF6FF",
          border: "#2563EB",
          label: "#1D4ED8",
          radioOuter: "#2563EB",
          radioInner: "#2563EB",
        };
    }
  };

  const variant = getVariantColors();

  return (
    <TouchableOpacity
      style={[
        styles.optionItem,
        active && {
          borderColor: variant.border,
          backgroundColor: variant.bg,
        },
      ]}
      onPress={() => onSelect(type)}
    >
      <View style={styles.optionTextWrapper}>
        <Text
          style={[
            styles.optionLabel,
            active && { color: variant.label },
          ]}
        >
          {label}
        </Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <View
        style={[
          styles.radioOuter,
          active && { borderColor: variant.radioOuter },
        ]}
      >
        {active && (
          <View
            style={[
              styles.radioInner,
              { backgroundColor: variant.radioInner },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SanctionModal;

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 14,
    lineHeight: 18,
  },
  optionGroup: {
    marginBottom: 14,
    rowGap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionTextWrapper: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 11,
    color: "#6B7280",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 4,
    columnGap: 10,
    justifyContent: "flex-end",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
