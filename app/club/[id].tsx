// import React, { useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   useWindowDimensions,
// } from "react-native";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import { CLUBS, type Club } from "../../data/clubs";

// const H_PAD = 16;

// const formationImages: Record<string, any> = {
//   blackbeard: require("../../assets/formations/blackbeard.png"),
//   raccoon: require("../../assets/formations/raccoon.png"),
//   snake: require("../../assets/formations/snake.png"),
//   elephant: require("../../assets/formations/elephant.png"),
//   owl: require("../../assets/formations/owl.png"),
//   whitebeard: require("../../assets/formations/whitebeard.png"),
//   ant: require("../../assets/formations/ant.png"),
//   crow: require("../../assets/formations/crow.png"),
//   hyeonmu: require("../../assets/formations/hyeonmu.png"),
//   sparrow: require("../../assets/formations/sparrow.png"),
//   octopus: require("../../assets/formations/octopus.png"),
//   toad: require("../../assets/formations/toad.png"),
// };

// export default function ClubDetailPage() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const nav = useNavigation();
//   const { width: screenWidth } = useWindowDimensions();

//   // CLUBS가 객체(Map)라고 가정 (네 탭 코드와 동일)
//   const club: Club | undefined = useMemo(() => {
//     if (!id) return undefined;
//     return (CLUBS as any)[id] as Club | undefined;
//   }, [id]);

//   useEffect(() => {
//     if (club) {
//       nav.setOptions?.({
//         headerShown: true,
//         headerTitle: club.name,
//         headerTitleAlign: "center",
//         headerTintColor: "#fff",
//         headerStyle: {
//           backgroundColor: "#000",
//           shadowColor: "transparent",
//           elevation: 0,
//           borderBottomWidth: 0,
//         },
//         headerShadowVisible: false,
//       });
//     }
//   }, [club]);

//   if (!club) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.err}>클럽을 찾을 수 없습니다: {String(id)}</Text>
//       </View>
//     );
//   }

//   const formationSrc = formationImages[club.id];

//   const contentWidth = screenWidth - H_PAD * 2;

//   let formationHeight = 160; // fallback
//   if (formationSrc) {
//     const { width: iw, height: ih } = Image.resolveAssetSource(formationSrc);
//     if (iw && ih) {
//       formationHeight = Math.round((contentWidth * ih) / iw);
//     }
//   }

//   return (
//     <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
//       {/* 헤더 카드 */}
//       <View style={styles.headerCard}>
//         <Text style={styles.title}>{club.name}</Text>
//         {club.stadium ? <Text style={styles.dim}>{club.stadium}</Text> : null}
//         {club.formation ? (
//           <Text style={styles.dim}>포메이션: {club.formation}</Text>
//         ) : null}
//       </View>

//       {/* 포메이션 (카드 없이 이미지 단독, 헤더 카드와 동일 가로폭) */}
//       <Text style={styles.sectionTitle}>베스트 포메이션</Text>
//       {formationSrc ? (
//         <View
//           style={{
//             width: contentWidth,
//             alignSelf: "center",
//             marginBottom: 16,
//           }}
//         >
//           <Image
//             source={formationSrc}
//             resizeMode="contain" // 위/아래/좌/우 모두 보존 (안 잘림)
//             style={{ width: "100%", height: formationHeight, borderRadius: 12 }}
//           />
//         </View>
//       ) : (
//         <View
//           style={{
//             width: contentWidth,
//             height: 160,
//             alignSelf: "center",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: 16,
//           }}
//         >
//           <Text style={styles.dim}>포메이션 이미지가 없습니다.</Text>
//         </View>
//       )}

//       {/* (추가 섹션은 이후에 이어서 붙이면 됨) */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#000000" },
//   content: { padding: H_PAD, paddingBottom: 40 },

//   headerCard: {
//     backgroundColor: "#111",
//     borderRadius: 14,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#1f1f1f",
//     marginBottom: 14,
//   },
//   title: { color: "#fff", fontSize: 18, fontWeight: "900" },
//   dim: { color: "#B5B5B8", marginTop: 6 },

//   sectionTitle: {
//     color: "#b30e29", // 프로젝트 메인 컬러
//     fontSize: 13,
//     fontWeight: "800",
//     marginBottom: 8,
//     paddingHorizontal: 2,
//   },

//   center: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   err: { color: "#fff" },
// });


import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useNavigation, Link } from "expo-router";
import { CLUBS, type Club } from "../../data/clubs";
import { Ionicons } from "@expo/vector-icons";

const H_PAD = 16;

const formationImages: Record<string, any> = {
  blackbeard: require("../../assets/formations/blackbeard.png"),
  raccoon: require("../../assets/formations/raccoon.png"),
  snake: require("../../assets/formations/snake.png"),
  elephant: require("../../assets/formations/elephant.png"),
  owl: require("../../assets/formations/owl.png"),
  whitebeard: require("../../assets/formations/whitebeard.png"),
  ant: require("../../assets/formations/ant.png"),
  crow: require("../../assets/formations/crow.png"),
  hyeonmu: require("../../assets/formations/hyeonmu.png"),
  sparrow: require("../../assets/formations/sparrow.png"),
  octopus: require("../../assets/formations/octopus.png"),
  toad: require("../../assets/formations/toad.png"),
};

export default function ClubDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const nav = useNavigation();
  const { width: screenWidth } = useWindowDimensions();

  // CLUBS가 객체(Map)라고 가정
  const club: Club | undefined = useMemo(() => {
    if (!id) return undefined;
    return (CLUBS as any)[id] as Club | undefined;
  }, [id]);

  useEffect(() => {
    if (club) {
      nav.setOptions?.({
        headerShown: true,
        headerTitle: club.name,
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#000",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerShadowVisible: false,
      });
    }
  }, [club]);

  if (!club) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>클럽을 찾을 수 없습니다: {String(id)}</Text>
      </View>
    );
  }

  const formationSrc = formationImages[(club as any).id];
  const contentWidth = screenWidth - H_PAD * 2;

  // 포메이션 이미지 비율 유지
  let formationHeight = 160;
  if (formationSrc) {
    const { width: iw, height: ih } = Image.resolveAssetSource(formationSrc);
    if (iw && ih) {
      formationHeight = Math.round((contentWidth * ih) / iw);
    }
  }

  // --------- 새 섹션용 데이터 (옵셔널 안전 처리) ----------
  const rank: number | undefined = (club as any).rank;
  const recentMatches:
    | { date: string; opponent: string; homeAway: "H" | "A"; score?: string; result?: "W" | "D" | "L" }[]
    | undefined = (club as any).recentMatches;

  const upcomingMatches:
    | { id: string; date: string; opponent: string; stadium?: string }[]
    | undefined = (club as any).upcomingMatches;
  // -------------------------------------------------------

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* 1) 구단명 (헤더 카드) */}
      {/* <View style={styles.headerCard}>
        <Text style={styles.title}>{club.name}</Text>
        {(club as any).stadium ? <Text style={styles.dim}>{(club as any).stadium}</Text> : null}
        {(club as any).formation ? (
          <Text style={styles.dim}>포메이션: {(club as any).formation}</Text>
        ) : null}
      </View> */}

          <View style={styles.headerCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="shield-half-outline" size={20} color={club.kit.jersey} />
          <Text style={styles.clubTitle}>
            {club.name} <Text style={styles.clubRegion}>({club.region})</Text>
          </Text>
        </View>
        <Text style={styles.leagueText}>{club.stadium}</Text>
      </View>

      {/* 2) 현재 순위 */}
      <Text style={styles.sectionTitle}>현재 순위</Text>
      <View style={styles.rankCard}>
        {typeof rank === "number" ? (
          <Text style={styles.rankText}>
            리그 {rank}위
          </Text>
        ) : (
          <Text style={styles.dim}>데이터 준비중</Text>
        )}
      </View>

      {/* 3) 최근 경기 스코어 */}
      <Text style={styles.sectionTitle}>최근 경기 성적</Text>
      <View style={styles.recentWrap}>
        {recentMatches?.length ? (
          recentMatches.slice(0, 5).map((m, idx) => {
            const badge =
              m.result === "W" ? styles.badgeW : m.result === "D" ? styles.badgeD : m.result === "L" ? styles.badgeL : styles.badgeN;
            return (
              <View key={`${m.date}_${idx}`} style={styles.recentItem}>
                <View style={[styles.badge, badge]}>
                  <Text style={styles.badgeText}>{m.result ?? "?"}</Text>
                </View>
                <Text style={styles.recentText} numberOfLines={1}>
                  {m.date} · {m.homeAway === "H" ? "홈" : "원정"} vs {m.opponent}
                  {m.score ? ` · ${m.score}` : ""}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.dim}>데이터 준비중</Text>
        )}
      </View>

      {/* 4) 베스트 포메이션 */}
      <Text style={styles.sectionTitle}>포메이션</Text>
      {formationSrc ? (
        <View style={{ width: contentWidth, alignSelf: "center", marginBottom: 16 }}>
          <Image
            source={formationSrc}
            resizeMode="contain"
            style={{ width: "100%", height: formationHeight, borderRadius: 12 }}
          />
        </View>
      ) : (
        <View style={styles.formationFallback}>
          <Text style={styles.dim}>포메이션 이미지가 없습니다.</Text>
        </View>
      )}

      {/* 5) 경기 일정 (예매 연결) */}
      <Text style={styles.sectionTitle}>경기 일정</Text>
      <View style={styles.scheduleWrap}>
        {upcomingMatches?.length ? (
          upcomingMatches.map((m) => (
            <View key={m.id} style={styles.matchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.matchDate}>{m.date}</Text>
                <Text style={styles.matchTitle} numberOfLines={1}>
                  vs {m.opponent}
                </Text>
                {m.stadium ? <Text style={styles.matchMeta}>{m.stadium}</Text> : null}
              </View>

              <Link href={`/reserve`} asChild>
                <Pressable style={styles.buyBtn}>
                  <Text style={styles.buyBtnText}>예매하기</Text>
                </Pressable>
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.dim}>예정된 경기가 없습니다.</Text>
        )}
      </View>

      {/* (추가 섹션은 이후에 이어서 붙이면 됨) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000000" },
  content: { padding: H_PAD, paddingBottom: 40 },

  headerCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    marginBottom: 14,
  },
  clubTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  dim: { color: "#B5B5B8", marginTop: 6 },

  clubRegion: {
  color: "#B5B5B8",
  fontSize: 13,
  marginTop: 4,
},

leagueText: {
  color: "#B5B5B8",
  fontSize: 12,
  marginTop: 3,
  marginLeft: 31
},

  sectionTitle: {
    color: "#b30e29",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  // 현재 순위
  rankCard: {
    backgroundColor: "#0f0f10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  rankText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  // 최근 경기
  recentWrap: {
    backgroundColor: "#0f0f10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 12,
    marginBottom: 16,
  },
  recentItem: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  recentText: { color: "#fff", fontSize: 13, flex: 1 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeW: { backgroundColor: "#0f2c0f", borderColor: "#1f4d1f" },
  badgeD: { backgroundColor: "#202020", borderColor: "#3a3a3a" },
  badgeL: { backgroundColor: "#2c0f0f", borderColor: "#4d1f1f" },
  badgeN: { backgroundColor: "#1a1a1a", borderColor: "#303030" },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },

  // 포메이션
  formationFallback: {
    width: "100%",
    height: 160,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  // 일정 + 예매
  scheduleWrap: {
    backgroundColor: "#0f0f10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 8,
    marginBottom: 16,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    backgroundColor: "#111",
    marginBottom: 8,
    gap: 12,
  },
  matchDate: { color: "#B5B5B8", fontSize: 12, marginBottom: 2 },
  matchTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  matchMeta: { color: "#B5B5B8", fontSize: 12, marginTop: 2 },

  buyBtn: {
    backgroundColor: "#b30e29",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  buyBtnText: { color: "#fff", fontWeight: "900" },

  center: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  err: { color: "#fff" },
});