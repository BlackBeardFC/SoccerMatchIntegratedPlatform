import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import type { Club, Player, Match } from "../data/clubs";
// import JerseyIcon from "./JerseyIcon";

function Jersey({ p, club }: { p: Player; club: Club }) {
  return (
    <View style={styles.jerseyWrap}>
      <View
        style={[
          styles.jersey,
          { backgroundColor: club.kit.jersey, borderColor: club.kit.trim },
        ]}
      >
        <Text style={styles.jerseyNumber}>{p.number}</Text>
      </View>
      <Text style={styles.playerName}>
        {p.name}
        {p.isCaptain ? " (C)" : ""}
      </Text>
    </View>
  );
}

export default function ClubDetail({ club }: { club: Club }) {
  const nav = useNavigation();

  useEffect(() => {
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
  }, [club.name]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>

      <View style={styles.headerCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="shield-half-outline" size={20} color={club.kit.jersey} />
          <Text style={styles.clubTitle}>
            {club.name} <Text style={styles.clubRegion}>({club.region})</Text>
          </Text>
        </View>
        <Text style={styles.leagueText}>{club.stadium}</Text>
      </View>

      <Text style={styles.sectionTitle}>현재 포메이션</Text>
      <View style={styles.pitch}>
        <Text style={styles.coachText}>감독: {club.coach}</Text>

        <View style={[styles.pitchRow, { marginTop: 8 }]}>
          <Jersey p={club.players.gk} club={club} />
        </View>

        {club.players.lines.map((row: Player[], idx: number) => (
          <View key={idx} style={styles.pitchRow}>
            {row.map((p: Player, i: number) => (
              <Jersey key={`${p.number}-${i}`} p={p} club={club} />
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.formationText}>
        <Ionicons name="football-outline" size={14} color="#cfcfcf" /> {club.formation}
      </Text>

      <Text style={styles.sectionTitle}>시즌 성적</Text>
      <View style={styles.card}>
        <Text style={styles.seasonText}>순위: {club.season.rank}위</Text>
        <Text style={styles.seasonText}>
          {club.season.wins}승 {club.season.draws}무 {club.season.losses}패
        </Text>
        <Text style={styles.seasonText}>득점 {club.season.gf} · 실점 {club.season.ga} · 승점 {club.season.pts}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>최근 경기</Text>
      <View style={styles.card}>
        {club.recent.map((m: Match, i: number) => (
          <Text key={`${m.date}-${i}`} style={styles.recentText}>
            {m.date.slice(5).replace("-", "/")} | {m.homeAway === "H" ? "홈" : "원정"} | {m.opponent} | {m.score} | {m.result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  headerCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 14,
    borderColor: "#1f1f1f",
  },
  clubTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  clubRegion: { color: "#cfcfcf", fontSize: 14, fontWeight: "700" },
  leagueText: { color: "#9aa0a6", marginTop: 6, fontSize: 12 },

  sectionTitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  pitch: {
    marginHorizontal: 16,
    backgroundColor: "#0c2a1c",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#164e3b",
    paddingVertical: 16,
    alignItems: "center",
  },
  coachText: { color: "#d1d5db", fontSize: 12, marginBottom: 6 },
  pitchRow: { flexDirection: "row", justifyContent: "space-evenly", marginVertical: 10 },

  jerseyWrap: { alignItems: "center", width: 64 },
  jersey: {
    width: 36,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  jerseyNumber: { color: "#fff", fontSize: 13, fontWeight: "900" },
  playerName: { color: "#e5e7eb", fontSize: 11, marginTop: 4, textAlign: "center" },

  formationText: { color: "#cfcfcf", marginTop: 8, textAlign: "center" },

  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
  },
  seasonText: { color: "#fff", fontSize: 13, marginBottom: 6 },
  recentText: { color: "#ddd", fontSize: 12, marginVertical: 4 },
});