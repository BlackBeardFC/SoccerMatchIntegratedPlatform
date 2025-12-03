import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type MenuKey = "users" | "inquiries" | "stats" | "admins";

type MenuItem = {
  key: MenuKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function AdminDashboardScreen() {
  const router = useRouter();

  const menus: MenuItem[] = [
    {
      key: "users",
      label: "사용자 관리",
      icon: "person-outline",
    },
    {
      key: "inquiries",
      label: "문의사항 관리",
      icon: "help-circle-outline",
    },
    {
      key: "stats",
      label: "통계 관리",
      icon: "stats-chart-outline",
    },
    {
      key: "admins",
      label: "관리자 관리",
      icon: "person-outline",
    },
  ];

  const handlePress = (key: MenuKey) => {
    switch (key) {
      case "users":
        router.push("/users");
        break;
      case "inquiries":
        router.push("/inquiries");
        break;
      case "stats":
        router.push("/stats");
        break;
      case "admins":
        router.push("/admins");
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>관리자 대시보드</Text>
          <Text style={styles.subtitle}>시스템 관리 메뉴를 선택하세요</Text>
        </View>

        <View style={styles.grid}>
          {menus.map((menu) => (
            <TouchableOpacity
              key={menu.key}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handlePress(menu.key)}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={menu.icon} size={26} />
              </View>
              <Text style={styles.cardLabel}>{menu.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  card: {
    width: "48%",
    aspectRatio: 1.25,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#E0EDFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#111827",
  },
});
