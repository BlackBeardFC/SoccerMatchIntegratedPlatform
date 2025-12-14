import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack } from "expo-router";

const PRIMARY = "#b30e29";

const BG = "#090909";
const CARD = "#1B1B1B";
const SURFACE = "#222222";
const BORDER = "#2A2A2A";
const TEXT = "#F5F5F5";
const SUB = "#A3A3A3";

type RankInfo = {
  rank: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  gf: number;
  ga: number;
  points: number;
};

type MatchItem = {
  id: string;
  date: string;
  time?: string;
  opponent: string;
  homeAway: "HOME" | "AWAY";
  stadium?: string;
  result?: "W" | "D" | "L";
  score?: string;
};

type PlayerStat = {
  id?: string | number;
  rank: number;
  name: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
  goals: number;
  assists: number;
  points: number;
  matches: number;
  starts: number;
  subs: number;
  minutes: number;

  shots: number;
  shotsOnTarget: number;
  pkGoals: number;
  passSuccess: number;
  keyPasses: number;
  tackles: number;
  interceptions: number;
  recoveries: number;
  clearances: number;
  fouls: number;
  yellows: number;
  reds: number;
  offsides: number;
};

function posLabel(pos: PlayerStat["position"]) {
  return pos ?? "-";
}

function getParamFirst(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

type ClubMock = {
  name: string;
  rankInfo: RankInfo;
  recent: MatchItem[];
  upcoming: MatchItem[];
  players: PlayerStat[];
};

function makeClubMock(args: {
  name: string;
  rank: number;
  points: number;
  played?: number;
  win?: number;
  draw?: number;
  lose?: number;
  gf?: number;
  ga?: number;
  recentOpponent?: string;
  upcomingOpponent?: string;
}): ClubMock {
  const played = args.played ?? 18;
  const win = args.win ?? Math.max(0, Math.min(played, Math.round(played * 0.55)));
  const draw = args.draw ?? Math.max(0, Math.min(played - win, 4));
  const lose = args.lose ?? Math.max(0, played - win - draw);

  const gf = args.gf ?? 25 + Math.max(0, 10 - args.rank);
  const ga = args.ga ?? 18 + Math.max(0, args.rank - 3);

  const recentOpponent = args.recentOpponent ?? "검은수염 FC";
  const upcomingOpponent = args.upcomingOpponent ?? "라쿤 FC";

  return {
    name: args.name,
    rankInfo: { rank: args.rank, played, win, draw, lose, gf, ga, points: args.points },
    recent: [
      { id: "r1", date: "2025-12-12", opponent: recentOpponent, homeAway: "HOME", result: "W", score: "2-1" },
      { id: "r2", date: "2025-12-08", opponent: "화이트비어드 FC", homeAway: "AWAY", result: "D", score: "1-1" },
    ],
    upcoming: [
      { id: "u1", date: "2025-12-18", time: "19:30", opponent: upcomingOpponent, homeAway: "AWAY", stadium: "블랙비어드 스타디움" },
    ],
    players: [
      {
        id: 1,
        rank: 1,
        name: "에이스",
        number: 9,
        position: "FW",
        goals: 10,
        assists: 3,
        points: 13,
        matches: 18,
        starts: 17,
        subs: 1,
        minutes: 1520,
        shots: 42,
        shotsOnTarget: 21,
        pkGoals: 1,
        passSuccess: 78,
        keyPasses: 11,
        tackles: 6,
        interceptions: 3,
        recoveries: 12,
        clearances: 1,
        fouls: 9,
        yellows: 1,
        reds: 0,
        offsides: 6,
      },
      {
        id: 2,
        rank: 2,
        name: "플레이메이커",
        number: 10,
        position: "MF",
        goals: 6,
        assists: 7,
        points: 13,
        matches: 18,
        starts: 16,
        subs: 2,
        minutes: 1410,
        shots: 25,
        shotsOnTarget: 11,
        pkGoals: 0,
        passSuccess: 84,
        keyPasses: 19,
        tackles: 22,
        interceptions: 14,
        recoveries: 31,
        clearances: 7,
        fouls: 10,
        yellows: 2,
        reds: 0,
        offsides: 1,
      },
    ],
  };
}

export default function ClubDetailScreen() {
  const params = useLocalSearchParams();
  const clubId = getParamFirst((params as any)?.id); // 예: "blackbeard", "raccoon" ...

  // ✅ 너 프로젝트 팀 id 12개 전부 등록
  const mockByClub = useMemo<Record<string, ClubMock>>(
    () => ({
      blackbeard: makeClubMock({ name: "검은수염 FC", rank: 3, points: 35, recentOpponent: "라쿤 FC", upcomingOpponent: "오울 FC" }),
      raccoon: makeClubMock({ name: "라쿤 FC", rank: 1, points: 40, recentOpponent: "스네이크 FC", upcomingOpponent: "검은수염 FC" }),
      snake: makeClubMock({ name: "스네이크 FC", rank: 4, points: 33, recentOpponent: "엘리펀트 FC", upcomingOpponent: "라쿤 FC" }),
      elephant: makeClubMock({ name: "엘리펀트 FC", rank: 6, points: 28, recentOpponent: "아울 FC", upcomingOpponent: "스네이크 FC" }),
      owl: makeClubMock({ name: "아울 FC", rank: 2, points: 38, recentOpponent: "검은수염 FC", upcomingOpponent: "현무 FC" }),
      whitebeard: makeClubMock({ name: "화이트비어드 FC", rank: 5, points: 30, recentOpponent: "크로우 FC", upcomingOpponent: "안트 FC" }),
      ant: makeClubMock({ name: "안트 FC", rank: 10, points: 21, recentOpponent: "스패로우 FC", upcomingOpponent: "화이트비어드 FC" }),
      crow: makeClubMock({ name: "크로우 FC", rank: 7, points: 26, recentOpponent: "옥토퍼스 FC", upcomingOpponent: "토드 FC" }),
      hyeonmu: makeClubMock({ name: "현무 FC", rank: 8, points: 25, recentOpponent: "토드 FC", upcomingOpponent: "아울 FC" }),
      sparrow: makeClubMock({ name: "스패로우 FC", rank: 9, points: 23, recentOpponent: "안트 FC", upcomingOpponent: "옥토퍼스 FC" }),
      octopus: makeClubMock({ name: "옥토퍼스 FC", rank: 11, points: 19, recentOpponent: "크로우 FC", upcomingOpponent: "스패로우 FC" }),
      toad: makeClubMock({ name: "토드 FC", rank: 12, points: 17, recentOpponent: "현무 FC", upcomingOpponent: "크로우 FC" }),
    }),
    []
  );

  // ✅ 키 매칭 (없으면 fallback)
  const data = clubId ? mockByClub[clubId] : undefined;

  // ✅ 헤더 제목: data 있으면 팀명, 없으면 fallback
  const clubName = data?.name ?? "구단 상세";

  const rankInfo = data?.rankInfo;
  const recentMatches = data?.recent ?? [];
  const upcomingMatches = data?.upcoming ?? [];
  const players = data?.players ?? [];

  return (
    <>
      {/* ✅ id 바뀔 때 헤더 확실히 갱신 */}
      <Stack.Screen
        key={clubId ?? "no-id"}
        options={{
          title: clubName,
          headerStyle: { backgroundColor: BG },
          headerTintColor: TEXT,
          headerShadowVisible: false,
        }}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        {!data ? (
          <View style={styles.notFound}>
            <Text style={styles.notFoundTitle}>클럽을 찾을 수 없습니다</Text>
            <Text style={styles.notFoundSub}>전달받은 id: {String(clubId)}</Text>
            <Text style={styles.notFoundSub}>mockByClub에 해당 id 키를 추가해야 합니다.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* 1) 현재 순위 */}
            <SectionCard title="현재 순위" right={<Badge text="리그" variant="neutral" />}>
              <View style={styles.rankWrap}>
                {/* 왼쪽 큰 등수 */}
                <View style={styles.rankLeft}>
                  <Text style={styles.rankBig}>#{rankInfo!.rank}</Text>
                  <Text style={styles.rankPointLabel}>승점</Text>
                  <Text style={styles.rankPointValue}>{rankInfo!.points}</Text>

                  <View style={styles.rankMiniRow}>
                    <Text style={styles.rankMiniText}>득실</Text>
                    <Text style={styles.rankMiniValue}>{rankInfo!.gf - rankInfo!.ga}</Text>
                  </View>
                </View>

                {/* 오른쪽 표 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.rankScroll}>
                  <View style={styles.rankTable}>
                    <View style={[styles.rankRow, styles.rankHeaderRow]}>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>경기</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>승</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>무</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>패</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>득점</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>실점</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>득실</Text>
                      <Text style={[styles.rankCell, styles.rankHeaderText]}>승점</Text>
                    </View>

                    <View style={styles.rankRow}>
                      <Text style={styles.rankCell}>{rankInfo!.played}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.win}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.draw}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.lose}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.gf}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.ga}</Text>
                      <Text style={styles.rankCell}>{rankInfo!.gf - rankInfo!.ga}</Text>
                      <Text style={[styles.rankCell, { color: PRIMARY }]}>{rankInfo!.points}</Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </SectionCard>

            {/* 2) 최근 경기 성적 */}
            <SectionCard title="최근 경기 성적" right={<FormPills items={recentMatches.map((m) => m.result ?? "D")} />}>
              {recentMatches.map((m) => (
                <MatchRow key={m.id} mode="recent" item={m} />
              ))}
            </SectionCard>

            {/* 3) 선수 정보 */}
            <SectionCard title="선수 정보" right={<Badge text={`${players.length}명`} variant="neutral" />}>
              <View style={styles.playersCard}>
                <View style={styles.playersTopRow}>
                  <Text style={styles.playersHint}>대표 선수 스탯</Text>
                  <View style={styles.playersCountPill}>
                    <Text style={styles.playersCountText}>{players.length}명</Text>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
                  <View>
                    <View style={[styles.statsRow, styles.statsHeaderRow]}>
                      <Text style={[styles.statsCell, styles.statsCellRank, styles.statsHeaderText]}>순위</Text>
                      <Text style={[styles.statsCell, styles.statsCellName, styles.statsHeaderText]}>선수</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>득점</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>도움</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>공격포인트</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>경기</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>선발</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>교체</Text>
                      <Text style={[styles.statsCell, styles.statsHeaderText]}>출전(분)</Text>
                    </View>

                    {players.map((p, idx) => (
                      <View key={`${clubId}_${p.id ?? "noid"}_${idx}`} style={styles.statsRow}>
                        <Text style={[styles.statsCell, styles.statsCellRank]}>{p.rank}</Text>
                        <View style={[styles.statsCell, styles.statsCellName, styles.statsNameCell]}>
                          <Text style={styles.playerNameText} numberOfLines={1}>
                            {p.name}
                          </Text>
                          <Text style={styles.playerSubText} numberOfLines={1}>
                            No. {p.number} · {posLabel(p.position)}
                          </Text>
                        </View>
                        <Text style={styles.statsCell}>{p.goals}</Text>
                        <Text style={styles.statsCell}>{p.assists}</Text>
                        <Text style={styles.statsCell}>{p.points}</Text>
                        <Text style={styles.statsCell}>{p.matches}</Text>
                        <Text style={styles.statsCell}>{p.starts}</Text>
                        <Text style={styles.statsCell}>{p.subs}</Text>
                        <Text style={styles.statsCell}>{p.minutes}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </SectionCard>

            {/* 4) 예정 경기 */}
            <SectionCard title="예정 경기" right={<Badge text={`${upcomingMatches.length}경기`} variant="neutral" />}>
              {upcomingMatches.map((m) => (
                <MatchRow key={m.id} mode="upcoming" item={m} />
              ))}
            </SectionCard>

            <View style={{ height: 24 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

/** ---------- UI Pieces ---------- */

function SectionCard({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardRight}>{right}</View>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function Badge({ text, variant }: { text: string; variant: "primary" | "neutral" }) {
  const bg = variant === "primary" ? "rgba(179,14,41,0.18)" : "#262626";
  const fg = variant === "primary" ? PRIMARY : TEXT;
  const bd = variant === "primary" ? "rgba(179,14,41,0.35)" : BORDER;

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{text}</Text>
    </View>
  );
}

function FormPills({ items }: { items: Array<"W" | "D" | "L"> }) {
  return (
    <View style={styles.pillsRow}>
      {items.slice(0, 5).map((x, idx) => {
        const { bg, fg, bd } =
          x === "W"
            ? { bg: "#1b2f22", fg: "#34d399", bd: "#264a34" }
            : x === "D"
            ? { bg: "#182338", fg: "#60a5fa", bd: "#22314b" }
            : { bg: "#301a1a", fg: "#f87171", bd: "#4a2626" };

        return (
          <View key={`${x}-${idx}`} style={[styles.pill, { backgroundColor: bg, borderColor: bd }]}>
            <Text style={[styles.pillText, { color: fg }]}>{x}</Text>
          </View>
        );
      })}
    </View>
  );
}

function MatchRow({ mode, item }: { mode: "recent" | "upcoming"; item: MatchItem }) {
  const ha = item.homeAway === "HOME" ? "홈" : "원정";
  const leftTop = mode === "recent" ? item.date : `${item.date} · ${item.time ?? "-"}`;
  const rightTop = mode === "recent" ? (item.score ?? "-") : ha;

  const resultLabel =
    mode === "recent"
      ? item.result === "W"
        ? "승"
        : item.result === "D"
        ? "무"
        : "패"
      : "예정";

  const resultStyle =
    mode === "recent"
      ? item.result === "W"
        ? styles.resultWin
        : item.result === "D"
        ? styles.resultDraw
        : styles.resultLose
      : styles.resultUpcoming;

  const subText =
    mode === "recent"
      ? `${ha} · vs ${item.opponent}`
      : `vs ${item.opponent}${item.stadium ? ` · ${item.stadium}` : ""}`;

  return (
    <View style={styles.matchRow}>
      <View style={styles.matchLeft}>
        <Text style={styles.matchDate}>{leftTop}</Text>
        <Text style={styles.matchSub}>{subText}</Text>
      </View>

      <View style={styles.matchRight}>
        <Text style={styles.matchScore}>{rightTop}</Text>
        <View style={[styles.resultChip, resultStyle]}>
          <Text style={styles.resultChipText}>{resultLabel}</Text>
        </View>
      </View>
    </View>
  );
}

/** ---------- styles ---------- */

const RANK_COLS = 8;
const RANK_CELL_W = 56;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: TEXT },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardBody: { gap: 10 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "800" },

  pillsRow: { flexDirection: "row", gap: 6 },
  pill: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontSize: 12, fontWeight: "900" },

  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  matchLeft: { flex: 1, paddingRight: 10 },
  matchDate: { fontSize: 12, color: SUB, fontWeight: "700" },
  matchSub: { marginTop: 4, fontSize: 14, color: TEXT, fontWeight: "800" },
  matchRight: { alignItems: "flex-end", gap: 6 },
  matchScore: { fontSize: 14, color: TEXT, fontWeight: "900" },

  resultChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  resultChipText: { fontSize: 12, fontWeight: "900", color: "#fff" },
  resultWin: { backgroundColor: "#059669" },
  resultDraw: { backgroundColor: "#2563eb" },
  resultLose: { backgroundColor: "#dc2626" },
  resultUpcoming: { backgroundColor: "#111827" },

  rankWrap: { flexDirection: "row", gap: 12 },
  rankLeft: {
    width: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBig: { fontSize: 26, fontWeight: "900", color: TEXT },
  rankPointLabel: { marginTop: 6, fontSize: 12, fontWeight: "800", color: SUB },
  rankPointValue: { marginTop: 2, fontSize: 20, fontWeight: "900", color: PRIMARY },
  rankMiniRow: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  rankMiniText: { fontSize: 12, fontWeight: "800", color: SUB },
  rankMiniValue: { fontSize: 12, fontWeight: "900", color: TEXT },

  rankScroll: { paddingRight: 6 },
  rankTable: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    backgroundColor: SURFACE,
    minWidth: RANK_COLS * RANK_CELL_W,
  },
  rankRow: { flexDirection: "row", alignItems: "stretch" },
  rankHeaderRow: { backgroundColor: "#262626" },
  rankCell: {
    width: RANK_CELL_W,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: TEXT,
  },
  rankHeaderText: { color: TEXT, fontWeight: "900" },

  playersCard: { borderRadius: 16, borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE, padding: 12 },
  playersTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  playersHint: { fontSize: 12, fontWeight: "800", color: SUB },
  playersCountPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: BORDER, backgroundColor: "#262626" },
  playersCountText: { fontSize: 12, fontWeight: "900", color: TEXT },

  statsScroll: { paddingRight: 10 },
  statsRow: { flexDirection: "row", alignItems: "stretch" },
  statsHeaderRow: { backgroundColor: "#262626", borderWidth: 1, borderColor: BORDER, borderRadius: 12, overflow: "hidden" },
  statsCell: {
    width: 72,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    fontSize: 12,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
  },
  statsCellRank: { width: 58 },
  statsCellName: { width: 160, textAlign: "left" },
  statsHeaderText: { color: TEXT, fontWeight: "900" },
  statsNameCell: { justifyContent: "center" },
  playerNameText: { fontSize: 13, fontWeight: "900", color: TEXT },
  playerSubText: { marginTop: 2, fontSize: 11, fontWeight: "800", color: SUB },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  notFoundTitle: { color: TEXT, fontSize: 16, fontWeight: "900" },
  notFoundSub: { color: SUB, fontSize: 12, fontWeight: "700", textAlign: "center" },
});
