//(마이페이지) 내 정보

import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 정보</Text>
      <Text style={styles.text}>회원 이름, 이메일, 응원 구단 등의 정보를 표시합니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 12 },
  text: { color: "#ccc", fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
});
