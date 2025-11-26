import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../constants/Colors";


export default function tabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#000",
          shadowColor: "transparent",
          elevation: 0,                
          borderBottomWidth: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#111111",
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
      <Tabs.Screen
        name="rank"
        options={{ title: "순위",
        headerShown: true,
        headerStyle: { backgroundColor: "#000" },
        headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="club"
        options={{ title: "구단",
        headerShown: true,
        headerStyle: { backgroundColor: "#000" },
        headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{ title: "홈",
        headerShown: true, 
        headerStyle: { backgroundColor: "#000" },
        headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="reserve"
        options={{ title: "예매",
        headerShown: true, 
        headerStyle: { backgroundColor: "#000" },
        headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{ title: "마이페이지",
        headerShown: true,
        headerStyle: { backgroundColor: "#000" },
        headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}
