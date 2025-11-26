import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function tabsindex() {

  const recommended = [
    { id: 1, title: "검은수염 vs 라쿤", date: "10월 12일 19:00", stadium: "검은수염 스타디움" },
    { id: 2, title: "스네이크 vs 부엉이", date: "10월 13일 18:00", stadium: "스네이크 파크" },
    { id: 3, title: "흰수염 vs 까마귀", date: "10월 14일 17:00", stadium: "흰수염 돔" },
  ];

  const popular = [
    { id: 1, title: "현무 vs 참새", date: "10월 15일 20:00", stadium: "현무 아레나" },
    { id: 2, title: "문어 vs 두꺼비", date: "10월 16일 19:30", stadium: "문어 돔" },
  ];

  const menus = [
    { id: 1, icon: "ticket-outline", label: "예매 내역" },
    { id: 2, icon: "trophy-outline", label: "순위" },
    { id: 3, icon: "football-outline", label: "구단" },
    { id: 4, icon: "heart-outline", label: "응원 구단" },
    { id: 5, icon: "chatbubble-ellipses-outline", label: "문의" },
    { id: 6, icon: "person-outline", label: "마이페이지" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>검은수염 FC 팬님,</Text>
          <Text style={styles.subText}>오늘은 이런 경기가 있어요 ⚡</Text>
        </View>
      </View>

      <View><Text style={styles.sectionTitle}>추천 경기</Text></View>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
          <TouchableOpacity style={styles.recommendCard} activeOpacity={0.8}>
            <Text style={styles.matchTitle}>{item.title}</Text>
            <Text style={styles.matchDate}>{item.date}</Text>
            <Text style={styles.matchStadium}>{item.stadium}</Text>
            <TouchableOpacity style={styles.ticketButton}>
              <Text style={styles.ticketText}>예매하러 Go!</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          </View>
        )}
      />

      <View><Text style={styles.sectionTitle}>오늘의 인기 경기</Text></View>
      {popular.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.popularCard}
          activeOpacity={0.8}
          onPress={() => alert(`${item.title} 상세 페이지 이동 예정!`)}
        >
          <View>
            <Text style={styles.popularTitle}>{item.title}</Text>
            <Text style={styles.popularInfo}>
              {item.date} | {item.stadium}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      ))}

      <View><Text style={styles.sectionTitle}>메뉴 바로 가기</Text></View>
      <View style={styles.menuGrid}>
        {menus.map((m) => (
          <TouchableOpacity key={m.id} style={styles.menuButton} activeOpacity={0.7}>
            <Ionicons name={m.icon as any} size={28} color="#fff" />
            <Text style={styles.menuLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
    notificationButton: {
    marginTop: -10,  
    padding: 6,             
    borderRadius: 8,  
  },
  greeting: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subText: { color: "#aaa", fontSize: 14 },

  sectionTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 12,
  },

  recommendCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 240,
  },
  matchTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  matchDate: { color: "#ccc", fontSize: 13 },
  matchStadium: { color: "#aaa", fontSize: 12, marginBottom: 10 },
  ticketButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 6,
  },
  ticketText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  popularCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  popularTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  popularInfo: { color: "#aaa", fontSize: 12, marginTop: 4 },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 30,
  },
  menuButton: {
    width: "30%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  menuLabel: { color: "#fff", fontSize: 13, marginTop: 6, fontWeight: "500" },
});
