import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerBackTitleVisible: false,  // ← 뒤로가기 텍스트 제거
        headerBackVisible: false,       // ← 기본 back 버튼 숨김

        // 커스텀 back 버튼 지정
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 10 }}
          >
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="users/index" options={{ title: "사용자 관리" }} />
      <Stack.Screen name="inquiries/index" options={{ title: "문의사항 관리" }} />
      <Stack.Screen name="sales/index" options={{ title: "매출 관리" }} />
      <Stack.Screen name="admins/index" options={{ title: "관리자 관리" }} />
    </Stack>
  );
}
