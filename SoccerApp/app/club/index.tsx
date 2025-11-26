import { Stack } from "expo-router";
import { router } from "expo-router";

export default function ClubList() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "구단",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
        }}
      />
      onPress={() => router.push("../data/clubs/index")}
    </>
  );
}

