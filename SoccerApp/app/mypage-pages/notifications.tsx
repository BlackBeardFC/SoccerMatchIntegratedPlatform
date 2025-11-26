import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type NotificationType = "BOOKING" | "RECOMMENDATION" | "EVENT";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // "2025-11-20T19:00:00+09:00"
  read?: boolean;
};

// 🔹 나중에 DB 연동 전에 임시로 사용할 목업 데이터
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "BOOKING",
    title: "예매가 완료되었습니다",
    message: "검은수염 vs 라쿤 경기 예매가 완료되었어요. 마이페이지 > 구매 내역에서 확인하세요.",
    createdAt: "2025-11-20T19:15:00+09:00",
  },
  {
    id: "2",
    type: "RECOMMENDATION",
    title: "오늘의 추천 경기 🔥",
    message: "현무 vs 참새 경기, 응원 구단 기반 추천 경기로 선정되었어요.",
    createdAt: "2025-11-19T10:00:00+09:00",
  },
  {
    id: "3",
    type: "EVENT",
    title: "참여형 응원 이벤트",
    message: "검은수염 FC 응원 미션에 참여하고 한정 굿즈를 받아보세요!",
    createdAt: "2025-11-18T15:30:00+09:00",
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const hasNotifications = notifications.length > 0;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, "0");
    return `${month}월 ${day}일 ${hour}:${minute}`;
  };

  const getIconName = (type: NotificationType) => {
    switch (type) {
      case "BOOKING":
        return "ticket-outline";
      case "RECOMMENDATION":
        return "football-outline";
      case "EVENT":
        return "megaphone-outline";
      default:
        return "notifications-outline";
    }
  };

  const handleDeleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert(
      "알림 전체 삭제",
      "모든 알림을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "알림",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 6 }}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () =>
            hasNotifications ? (
              <TouchableOpacity
                onPress={handleClearAll}
                style={{ paddingHorizontal: 10 }}
              >
                <Text style={{ color: "#fff", fontSize: 13}}>전체 삭제</Text>
              </TouchableOpacity>
            ) : null,
        }}
      />

      {hasNotifications ? (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((n) => (
            <View key={n.id} style={styles.card}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={getIconName(n.type) as any}
                  size={22}
                  color="#fff"
                />
              </View>

              <View style={styles.contentWrapper}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.message} numberOfLines={2}>
                  {n.message}
                </Text>
                <Text style={styles.time}>{formatTime(n.createdAt)}</Text>
              </View>

              {/* 개별 삭제 버튼 */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteOne(n.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        // 알림이 없을 때
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 도착한 알림이 없습니다.📭</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    paddingBottom: 100,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 32,
    alignItems: "center",
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  message: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 4,
  },
  time: {
    color: "#777",
    fontSize: 11,
  },
  deleteButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
