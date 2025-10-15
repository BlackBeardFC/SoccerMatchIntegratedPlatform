// 구단페이지

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const clubs = [
  { id: 1, name: "검은수염", stadium: "검은수염 스타디움 (부천)" },
  { id: 2, name: "라쿤", stadium: "라쿤 아레나 (김천)" },
  { id: 3, name: "스네이크", stadium: "스네이크 파크 (대전)" },
  { id: 4, name: "엘리펀트", stadium: "엘리펀트 스타디움 (포항)" },
  { id: 5, name: "부엉이", stadium: "부엉이 필드 (서울)" },
  { id: 6, name: "흰수염", stadium: "흰수염 돔 (인천)" },
  { id: 7, name: "개미", stadium: "개미 스타디움 (광주)" },
  { id: 8, name: "까마귀", stadium: "까마귀 파크 (안양)" },
  { id: 9, name: "현무", stadium: "현무 아레나 (울산)" },
  { id: 10, name: "참새", stadium: "참새 스타디움 (수원)" },
  { id: 11, name: "문어", stadium: "문어돔 (제주)" },
  { id: 12, name: "두꺼비", stadium: "두꺼비 스타디움 (대구)" },
];

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 80) / numColumns; // 여백 포함 정사각형 크기

export default function Club() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push('/club/[id]')} // ✅ 클릭 시 상세 페이지 이동 예정
          >
            <Text style={styles.clubName}>{item.name}</Text>
            <Text style={styles.stadium}>{item.stadium}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    width: cardSize,
    height: cardSize, // ✅ 정사각형
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  clubName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  stadium: {
    fontSize: 12,
    color: "#cccccc",
    textAlign: "center",
    paddingHorizontal: 5,
  },
});