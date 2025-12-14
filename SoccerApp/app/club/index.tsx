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

type PlayerStat = {
  id: string;
  name: string;
  team?: string;
  photo?: any; // require(...) or { uri: "..." }
  goals?: number;
  assists?: number;
  shots?: number;
  shotsOnTarget?: number;
  chances?: number;
  yellow?: number;
  minutes?: number;
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
  }, [club, nav]);

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
    if (iw && ih) formationHeight = Math.round((contentWidth * ih) / iw);
  }

  // ---------- 데이터 ----------
  const rank: number | undefined = (club as any).rank;

  const recentMatches:
    | {
        date: string;
        opponent: string;
        homeAway: "H" | "A";
        score?: string;
        result?: "W" | "D" | "L";
      }[]
    | undefined = (club as any).recentMatches;

  const upcomingMatches:
    | { id: string; date: string; opponent: string; stadium?: string }[]
    | undefined = (club as any).upcomingMatches;

  const players: PlayerStat[] | undefined = (club as any).players;

  const safeNum = (n: any) => (typeof n === "number" ? n : 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Ionicons name="shield-half-outline" size={20} color={club.kit.jersey} />
          <Text style={styles.clubTitle} numberOfLines={1}>
            {club.name} <Text style={styles.clubRegion}>({club.region})</Text>
          </Text>
        </View>
        <Text style={styles.leagueText} numberOfLines={1}>
          {club.stadium}
        </Text>
      </View>

      {/* 현재 순위 (등수 크게) */}
      <Text style={styles.sectionTitle}>현재 순위</Text>
      <View style={styles.rankHero}>
        {typeof rank === "number" ? (
          <>
            <View style={styles.rankLeft}>
              <Text style={styles.rankLabel}>리그 순위</Text>
              <View style={styles.rankBigRow}>
                <Text style={styles.rankBig}>{rank}</Text>
                <Text style={styles.rankSuffix}>위</Text>
              </View>
            </View>

            <View style={styles.rankRight}>
              <Text style={styles.rankHint}>현재 상태</Text>
              <Text style={styles.rankHintStrong}>상위권 진입 도전</Text>
              <Text style={styles.rankHintSub} numberOfLines={2}>
                최근 경기 성적/선수 스탯을 기반으로 자동 업데이트 예정
              </Text>

              {/* 미니 칩 (시각적 포인트) */}
              <View style={styles.rankChips}>
                <View style={styles.rankChip}>
                  <Ionicons name="stats-chart-outline" size={14} color="#fff" />
                  <Text style={styles.rankChipText}>전력분석</Text>
                </View>
                <View style={styles.rankChip}>
                  <Ionicons name="trophy-outline" size={14} color="#fff" />
                  <Text style={styles.rankChipText}>목표</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.dim}>데이터 준비중</Text>
        )}
      </View>

      {/* 선수 정보 (사진처럼 표/리스트) */}
      <Text style={styles.sectionTitle}>선수 정보</Text>
      <View style={styles.tableCard}>
        {players?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 840 }}>
              {/* 헤더 */}
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.th, { width: 260 }]}>선수</Text>
                <Text style={[styles.th, styles.thCenter, { width: 70 }]}>득점</Text>
                <Text style={[styles.th, styles.thCenter, { width: 70 }]}>도움</Text>
                <Text style={[styles.th, styles.thCenter, { width: 80 }]}>슈팅</Text>
                <Text style={[styles.th, styles.thCenter, { width: 90 }]}>유효</Text>
                <Text style={[styles.th, styles.thCenter, { width: 90 }]}>찬스</Text>
                <Text style={[styles.th, styles.thCenter, { width: 70 }]}>경고</Text>
                <Text style={[styles.th, styles.thCenter, { width: 110 }]}>출전(분)</Text>
              </View>

              {/* 바디 */}
              {players.map((p, idx) => (
                <View
                  key={p.id ?? `${p.name}_${idx}`}
                  style={[
                    styles.tableRow,
                    idx === players.length - 1 ? { borderBottomWidth: 0 } : null,
                  ]}
                >
                  <View style={[styles.playerCell, { width: 260 }]}>
                    {/* ✅ 파일 require 안 씀: photo 없으면 안전한 fallback */}
                    {p.photo ? (
                      <Image source={p.photo} style={styles.playerAvatar} />
                    ) : (
                      <View style={styles.playerAvatarFallback}>
                        <Text style={styles.playerAvatarInitial}>
                          {(p.name?.[0] ?? "?").toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.playerName} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={styles.playerTeam} numberOfLines={1}>
                        {p.team ?? club.name}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.td, styles.tdCenter, { width: 70 }]}>{safeNum(p.goals)}</Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 70 }]}>{safeNum(p.assists)}</Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 80 }]}>{safeNum(p.shots)}</Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 90 }]}>
                    {safeNum(p.shotsOnTarget)}
                  </Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 90 }]}>{safeNum(p.chances)}</Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 70 }]}>{safeNum(p.yellow)}</Text>
                  <Text style={[styles.td, styles.tdCenter, { width: 110 }]}>{safeNum(p.minutes)}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.dim}>데이터 준비중</Text>
        )}
      </View>

      {/* 최근 경기 성적 (카드형 디자인) */}
      <Text style={styles.sectionTitle}>최근 경기 성적</Text>
      <View style={styles.recentCard}>
        {recentMatches?.length ? (
          recentMatches.slice(0, 5).map((m, idx) => {
            const pill =
              m.result === "W"
                ? styles.pillW
                : m.result === "D"
                ? styles.pillD
                : m.result === "L"
                ? styles.pillL
                : styles.pillN;

            return (
              <View key={`${m.date}_${idx}`} style={styles.recentRow}>
                <View style={[styles.resultPill, pill]}>
                  <Text style={styles.resultPillText}>{m.result ?? "?"}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.recentMain} numberOfLines={1}>
                    {m.homeAway === "H" ? "홈" : "원정"} vs {m.opponent}
                  </Text>
                  <Text style={styles.recentSub} numberOfLines={1}>
                    {m.date}
                  </Text>
                </View>

                <View style={styles.scoreBox}>
                  <Text style={styles.scoreText}>{m.score ?? "-"}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.dim}>데이터 준비중</Text>
        )}
      </View>

      {/* 포메이션 */}
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

      {/* 다음 경기 예매 (강조 카드) */}
      <Text style={styles.sectionTitle}>다음 경기 예매</Text>
      <View style={styles.nextWrap}>
        {upcomingMatches?.length ? (
          upcomingMatches.slice(0, 3).map((m) => (
            <View key={m.id} style={styles.nextCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nextDate} numberOfLines={1}>
                  {m.date}
                </Text>
                <Text style={styles.nextTitle} numberOfLines={1}>
                  {club.name} vs {m.opponent}
                </Text>
                {m.stadium ? (
                  <Text style={styles.nextMeta} numberOfLines={1}>
                    {m.stadium}
                  </Text>
                ) : null}

                <View style={styles.nextChips}>
                  <View style={styles.chip}>
                    <Ionicons name="ticket-outline" size={14} color="#fff" />
                    <Text style={styles.chipText}>좌석 선택</Text>
                  </View>
                  <View style={styles.chip}>
                    <Ionicons name="card-outline" size={14} color="#fff" />
                    <Text style={styles.chipText}>결제</Text>
                  </View>
                  <View style={styles.chipGhost}>
                    <Ionicons name="time-outline" size={14} color="#fff" />
                    <Text style={styles.chipText}>빠른 예매</Text>
                  </View>
                </View>
              </View>

              <Link href={`/reserve`} asChild>
                <Pressable style={styles.buyBtnBig}>
                  <Text style={styles.buyBtnText}>예매하기</Text>
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </Pressable>
              </Link>
            </View>
          ))
        ) : (
          <Text style={styles.dim}>예정된 경기가 없습니다.</Text>
        )}
      </View>
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
  headerTopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  clubTitle: { color: "#fff", fontSize: 18, fontWeight: "900", flexShrink: 1 },
  clubRegion: { color: "#B5B5B8", fontSize: 13, fontWeight: "700" },
  leagueText: { color: "#B5B5B8", fontSize: 12, marginTop: 3, marginLeft: 31 },
  dim: { color: "#B5B5B8" },

  sectionTitle: {
    color: "#b30e29",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  /* 순위 HERO */
  rankHero: {
    backgroundColor: "#0f0f10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  rankLeft: {
    width: 132,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rankLabel: { color: "#B5B5B8", fontSize: 12, marginBottom: 6, fontWeight: "800" },
  rankBigRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  rankBig: { color: "#fff", fontSize: 46, fontWeight: "900", lineHeight: 46 },
  rankSuffix: { color: "#fff", fontSize: 16, fontWeight: "900", marginBottom: 4 },

  rankRight: { flex: 1, justifyContent: "center" },
  rankHint: { color: "#B5B5B8", fontSize: 12, fontWeight: "800" },
  rankHintStrong: { color: "#fff", fontSize: 16, fontWeight: "900", marginTop: 4 },
  rankHintSub: { color: "#B5B5B8", fontSize: 12, marginTop: 6, lineHeight: 16 },
  rankChips: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  rankChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#b30e29",
  },
  rankChipText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  /* 선수 표 */
  tableCard: {
    backgroundColor: "#0f0f10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 8,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  tableHeaderRow: {
    backgroundColor: "#111",
    borderRadius: 10,
    borderBottomWidth: 0,
    marginBottom: 6,
  },
  th: { color: "#B5B5B8", fontSize: 12, fontWeight: "900" },
  thCenter: { textAlign: "center" },
  td: { color: "#fff", fontSize: 13, fontWeight: "800" },
  tdCenter: { textAlign: "center" },

  playerCell: { flexDirection: "row", alignItems: "center", gap: 10 },
  playerAvatar: { width: 34, height: 34, borderRadius: 999, backgroundColor: "#222" },
  playerAvatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  playerAvatarInitial: { color: "#B5B5B8", fontSize: 14, fontWeight: "900" },
  playerName: { color: "#fff", fontSize: 13, fontWeight: "900" },
  playerTeam: { color: "#B5B5B8", fontSize: 11, marginTop: 2, fontWeight: "700" },

  /* 최근 경기 */
  recentCard: {
    backgroundColor: "#0f0f10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 10,
    marginBottom: 16,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    marginBottom: 10,
  },
  resultPill: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pillW: { backgroundColor: "#0f2c0f", borderColor: "#1f4d1f" },
  pillD: { backgroundColor: "#202020", borderColor: "#3a3a3a" },
  pillL: { backgroundColor: "#2c0f0f", borderColor: "#4d1f1f" },
  pillN: { backgroundColor: "#1a1a1a", borderColor: "#303030" },
  resultPillText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  recentMain: { color: "#fff", fontSize: 14, fontWeight: "900" },
  recentSub: { color: "#B5B5B8", fontSize: 12, marginTop: 3, fontWeight: "700" },

  scoreBox: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#0f0f10",
    borderWidth: 1,
    borderColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  /* 포메이션 */
  formationFallback: {
    width: "100%",
    height: 160,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  /* 다음 경기 */
  nextWrap: {
    backgroundColor: "#0f0f10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    padding: 10,
    marginBottom: 16,
  },
  nextCard: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    backgroundColor: "#111",
    marginBottom: 10,
  },
  nextDate: { color: "#B5B5B8", fontSize: 12, fontWeight: "700" },
  nextTitle: { color: "#fff", fontSize: 15, fontWeight: "900", marginTop: 4 },
  nextMeta: { color: "#B5B5B8", fontSize: 12, marginTop: 4, fontWeight: "700" },

  nextChips: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#b30e29",
  },
  chipGhost: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  chipText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  buyBtnBig: {
    backgroundColor: "#b30e29",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  buyBtnText: { color: "#fff", fontWeight: "900" },

  center: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  err: { color: "#fff" },
});
