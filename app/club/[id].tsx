// app/club/[id].tsx
// import { View, Text, StyleSheet } from "react-native";
// import { Stack, useLocalSearchParams } from "expo-router";

// export default function ClubDetail() {
//   const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();

//   return (
//     <View style={styles.container}>
//       {/* 헤더 타이틀 동적 설정 */}
//       <Stack.Screen options={{ title: name ? String(name) : "구단 상세" }} /> */

//       <Text style={styles.title}>{name ?? `구단 #${id}`}</Text>
//       {/* TODO: 구단 정보 섹션들 추가 */}
//       <Text style={styles.sub}>경기장, 로고, 일정 등 상세정보 영역</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", padding: 16 },
//   title: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
//   sub: { color: "#aaa", fontSize: 14 },
// });


// app/club/[id].tsx
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ClubDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>구단 상세</Text>
      <Text style={styles.body}>id: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  body: { color: "#fff" },
});
