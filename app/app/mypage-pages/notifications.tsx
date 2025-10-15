// app/mypage-pages/notifications.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function NotificationsPage() {
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
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>아직 도착한 알림이 없습니다 📭</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});
