import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constants/Colors";

export default function BookingScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>경기 예매</Text>
      <Text style={styles.subText}>선택한 경기 ID: {matchId}</Text>

      {/* TODO: 여기 나중에 좌석 선택 / 가격 / 구단 로고 등 넣기 */}
      <View style={styles.box}>
        <Text style={styles.boxText}>여기에 좌석·가격·경기 상세 정보 들어갈 예정</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 24,
  },
  box: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
  },
  boxText: {
    color: "#ccc",
    fontSize: 13,
  },
  backButton: {
    marginTop: 30,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});