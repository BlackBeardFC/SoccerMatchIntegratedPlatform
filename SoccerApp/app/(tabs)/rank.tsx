import { View, Text, StyleSheet, FlatList, Dimensions, Platform } from "react-native";
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";


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

const screenW = Dimensions.get("window").width;
const P_CONTAINER = 8;
const P_ROW = 10;
const innerW = screenW - (P_CONTAINER * 2 + P_ROW * 2);

const COL_RANK = 25;
const COL_GP   = 33;
const COL_PTS  = 33;

const COL_W    = 28;
const COL_D    = 28;
const COL_L    = 28;
const COL_GF   = 28;
const COL_GA   = 28;

const COL_GD   = 48;

const COL_CLUB_LEFT_PAD = 14; 

const FIXED_SUM =
  COL_RANK + COL_GP + COL_PTS +
  COL_W + COL_D + COL_L + COL_GF + COL_GA +
  COL_GD;

const COL_CLUB = Math.max(80, innerW - FIXED_SUM);

const HEADER_H = 42;

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

const gdColor = (gd: number) => (gd > 0 ? "#22c55e" : gd < 0 ? "#4488efff" : "#9ca3af");

function rankBadgeTint(rank: number) {
  if (rank === 1) return { backgroundColor: "#b30e29" };
  if (rank === 2) return { backgroundColor: "#cc4d54" };
  if (rank === 3) return { backgroundColor: "#e26d73" };
  if (rank === 4) return { backgroundColor: "#f5999e" };
  return { backgroundColor: "#374151" };
}

export default function tabsRank() {
  return (
     <View style={[styles.container, { paddingHorizontal: P_CONTAINER }]}>
      <View style={styles.stickyWrap}>
        <Header />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(it) => String(it.rank)}
        renderItem={({ item }) => (
          <View style={[styles.row, { paddingHorizontal: P_ROW }]}>
            <View style={{ width: COL_RANK, alignItems: "center" }}>
              <View style={[styles.rankBadge, rankBadgeTint(item.rank)]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
            </View>

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
  container: { flex: 1, backgroundColor: "#000", paddingTop: 12 },

  stickyWrap: {
    position: "static",
    top: 12,
    left: P_CONTAINER,
    right: P_CONTAINER,
    zIndex: 10,
    ...(Platform.OS === "android" ? { elevation: 5 } : { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }),
  },

  headerPill: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 9,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { color: "#b5b5b8", fontSize: 12, fontWeight: "700", textAlign: "center" },

  row: {
    backgroundColor: "#0e0d0dff",
    borderRadius: 18,
    paddingVertical: 6,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  cellClub: { color: "#e4e3e3ff", fontSize: 15, fontWeight: "600", paddingLeft: 8 },

  cell: { color: "#b5b5b8", fontSize: 14, textAlign: "center", fontWeight: "500" },

  cellPts: { color: "#b30e29", fontSize: 14, fontWeight: "800", textAlign: "center" },

  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  rankText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  
  cellGd: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
