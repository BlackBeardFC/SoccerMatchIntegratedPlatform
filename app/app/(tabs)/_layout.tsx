// 하단 네비게이션 바

import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/Colors";


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true, // ✅ 상단 헤더 표시
        headerTitleAlign: "center", // 제목 가운데 정렬
        headerStyle: { backgroundColor: "#0000" }, // 헤더 배경
        headerTintColor: "#fff", // 헤더 글자색
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#111111", // 검정 배경
          borderTopWidth: 0.5,
          height: 90,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "rank":
              return <Ionicons name="trophy-outline" size={22} color={color} />;
            case "club":
              return <MaterialCommunityIcons name="shield-half-full" size={22} color={color} />
            case "index":
              return <Ionicons name="home-outline" size={22} color={color} />;
            case "reserve":
              return <Ionicons name="ticket-outline" size={22} color={color} />;
            case "mypage":
              return <Ionicons name="person-circle-outline" size={23} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="rank" options={{ title: "순위" }} />
      <Tabs.Screen name="club" options={{ title: "구단" }} />
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="reserve" options={{ title: "예매" }} />
      <Tabs.Screen name="mypage" options={{ title: "마이페이지" }} />
    </Tabs>
  );
}
