// import { View, Text, StyleSheet } from "react-native";
// import GlobalStyles from "../../constants/GlobalStyles";

// export default function rank() {
//   return (
//     <View style={styles.container}>
//       <Text>순위</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
// });

import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import Colors from "../../constants/Colors";

const rows = [
  { rank: 1,  club: "검은수염", gp: 28, pts: 72, w: 23, d: 3,  l: 2,  gf: 68, ga: 18, gd: 50 },
  { rank: 2,  club: "라쿤",     gp: 28, pts: 65, w: 20, d: 5,  l: 3,  gf: 58, ga: 22, gd: 36 },
  { rank: 3,  club: "스네이크", gp: 28, pts: 58, w: 18, d: 4,  l: 6,  gf: 52, ga: 28, gd: 24 },
  { rank: 4,  club: "엘리펀트", gp: 28, pts: 54, w: 16, d: 6,  l: 6,  gf: 48, ga: 32, gd: 16 },
  { rank: 5,  club: "부엉이",   gp: 28, pts: 48, w: 14, d: 6,  l: 8,  gf: 42, ga: 35, gd: 7  },
  { rank: 6,  club: "흰수염",   gp: 28, pts: 45, w: 13, d: 6,  l: 9,  gf: 38, ga: 38, gd: 0  },
  { rank: 7,  club: "개미",     gp: 28, pts: 42, w: 12, d: 6,  l: 10, gf: 35, ga: 42, gd: -7 },
  { rank: 8,  club: "까마귀",   gp: 28, pts: 38, w: 11, d: 5,  l: 12, gf: 32, ga: 45, gd: -13},
  { rank: 9,  club: "현무",     gp: 28, pts: 32, w: 9,  d: 5,  l: 14, gf: 28, ga: 48, gd: -20},
  { rank:10,  club: "참새",     gp: 28, pts: 28, w: 8,  d: 4,  l: 16, gf: 25, ga: 52, gd: -27},
  { rank:11,  club: "문어",     gp: 28, pts: 22, w: 6,  d: 4,  l: 18, gf: 22, ga: 58, gd: -36},
  { rank:12,  club: "두꺼비",   gp: 28, pts: 18, w: 5,  d: 3,  l: 20, gf: 18, ga: 62, gd: -44},
];

// 화면 폭 기반 내부 가용폭 계산 (iPhone 14 390pt 기준 OK)
const screenW = Dimensions.get("window").width;
const P_CONTAINER = 8;
const P_ROW = 10;
const innerW = screenW - (P_CONTAINER * 2 + P_ROW * 2);

// ── 고정/개별 폭 상수 (원하는 칼럼만 조정하면 나머지는 그대로)
const COL_RANK = 25;
const COL_GP   = 33; // 경기
const COL_PTS  = 33; // 승점

// ✅ 개별 조정 가능
const COL_W    = 28; // 승
const COL_D    = 28; // 무
const COL_L    = 28; // 패
const COL_GF   = 28; // 득
const COL_GA   = 28; // 실

const COL_GD   = 48; // 득실차

// 구단명 칼럼 왼쪽 오프셋(px)
const COL_CLUB_LEFT_PAD = 14; // 원하는 만큼 조절 (예: 10~18)

// 고정폭 합
const FIXED_SUM =
  COL_RANK + COL_GP + COL_PTS +
  COL_W + COL_D + COL_L + COL_GF + COL_GA +
  COL_GD;

// 남는 폭 = 구단명
const COL_CLUB = Math.max(80, innerW - FIXED_SUM);

const Header = () => (
  <View style={[styles.headerPill, { paddingHorizontal: P_ROW }]}>
    <Text style={[styles.headerText, { width: COL_RANK }]}>순위</Text>
    <Text style={[styles.headerText, { width: COL_CLUB, textAlign: "left", paddingLeft: 15 }]}>구단명</Text>

    <Text style={[styles.headerText, { width: COL_GP }]}>경기</Text>
    <Text style={[styles.headerText, { width: COL_PTS }]}>승점</Text>
    <Text style={[styles.headerText, { width: COL_W }]}>승</Text>
    <Text style={[styles.headerText, { width: COL_D }]}>무</Text>
    <Text style={[styles.headerText, { width: COL_L }]}>패</Text>
    <Text style={[styles.headerText, { width: COL_GF }]}>득</Text>
    <Text style={[styles.headerText, { width: COL_GA }]}>실</Text>
    <Text style={[styles.headerText, { width: COL_GD }]}>득실차</Text>
  </View>
);

const gdColor = (gd: number) => (gd > 0 ? "#22c55e" : gd < 0 ? "#ef4444" : "#9ca3af");

function rankBadgeTint(rank: number) {
  if (rank === 1) return { backgroundColor: "#0ea5e9" };
  if (rank === 2) return { backgroundColor: "#60a5fa" };
  if (rank === 3) return { backgroundColor: "#38bdf8" };
  if (rank === 4) return { backgroundColor: "#34d399" };
  return { backgroundColor: "#374151" };
}

export default function Rank() {
  return (
    <View style={[styles.container, { paddingHorizontal: P_CONTAINER }]}>
      <FlatList
        data={rows}
        keyExtractor={(it) => String(it.rank)}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View style={[styles.row, { paddingHorizontal: P_ROW }]}>
            <View style={{ width: COL_RANK, alignItems: "center" }}>
              <View style={[styles.rankBadge, rankBadgeTint(item.rank)]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
            </View>

            {/* <Text style={[styles.cellClub, { width: COL_CLUB }]} numberOfLines={1}>
              {item.club}
            </Text> */}

            <Text
              style={[
                styles.cellClub,
                { width: COL_CLUB, paddingLeft: COL_CLUB_LEFT_PAD }
              ]}
              numberOfLines={1}
            >
              {item.club}
            </Text>


            <Text style={[styles.cell, { width: COL_GP }]}>{item.gp}</Text>
            <Text style={[styles.cellPts, { width: COL_PTS }]}>{item.pts}</Text>
            <Text style={[styles.cell, { width: COL_W }]}>{item.w}</Text>
            <Text style={[styles.cell, { width: COL_D }]}>{item.d}</Text>
            <Text style={[styles.cell, { width: COL_L }]}>{item.l}</Text>
            <Text style={[styles.cell, { width: COL_GF }]}>{item.gf}</Text>
            <Text style={[styles.cell, { width: COL_GA }]}>{item.ga}</Text>
            <Text style={[styles.cellGd, { width: COL_GD, color: gdColor(item.gd) }]}>
              {item.gd > 0 ? `+${item.gd}` : item.gd}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 12 },
  headerPill: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { color: "#cbd5e1", fontSize: 12, fontWeight: "700", textAlign: "center" },

  row: {
    backgroundColor:  "#898585ff",
    borderRadius: 18,
    paddingVertical: 7,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  cell: { color: "#111827", fontSize: 14, textAlign: "center" },
  cellPts: { color: "#2563eb", fontSize: 14, fontWeight: "700", textAlign: "center" },
  cellClub: { color: "#111827", fontSize: 15, fontWeight: "600", paddingLeft: 8 },

  rankBadge: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rankText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  cellGd: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
