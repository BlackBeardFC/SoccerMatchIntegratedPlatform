// app/mypage-pages/support.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

/* ⚽ 구단 데이터: 한 줄 + mainColor 포함 */
const CLUBS = [
  { id: "blackbeard", nameKr: "검은수염 FC", city: "서울", stadium: "검은수염 스타디움", mainColor: "#b30e29" },
  { id: "raccoon", nameKr: "라쿤 FC", city: "인천", stadium: "라쿤 아레나", mainColor: "#7b5e42" },
  { id: "snake", nameKr: "스네이크 FC", city: "대구", stadium: "스네이크 파크", mainColor: "#3b7c57" },
  { id: "owl", nameKr: "부엉이 FC", city: "대전", stadium: "부엉이 스타디움", mainColor: "#6b5638" },
  { id: "whitebeard", nameKr: "흰수염 FC", city: "부산", stadium: "흰수염 돔", mainColor: "#c7e1f0" },
  { id: "crow", nameKr: "까마귀 FC", city: "광주", stadium: "까마귀 필드", mainColor: "#1a1a1a" },
  { id: "elephant", nameKr: "엘리펀트 FC", city: "수원", stadium: "엘리펀트 스타디움", mainColor: "#8c8c8c" },
  { id: "ant", nameKr: "개미 FC", city: "성남", stadium: "개미 스타디움", mainColor: "#a84300" },
  { id: "hyunmu", nameKr: "현무 FC", city: "포항", stadium: "현무 아레나", mainColor: "#004f48" },
  { id: "sparrow", nameKr: "참새 FC", city: "울산", stadium: "참새 필드", mainColor: "#b68a56" },
  { id: "octopus", nameKr: "문어 FC", city: "제주", stadium: "문어 돔", mainColor: "#5a3b52" },
  { id: "toad", nameKr: "두꺼비 FC", city: "전주", stadium: "두꺼비 스타디움", mainColor: "#7a6042" },
] as const;

type Club = (typeof CLUBS)[number];

export default function SupportClubPage() {
  const router = useRouter();

  const [favoriteClub, setFavoriteClub] = useState<Club | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);

  const handleSelectClub = (club: Club) => {
    Alert.alert(
      "응원 구단 설정",
      `${club.nameKr}을(를) 응원 구단으로 설정하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "설정하기",
          onPress: () => {
            setFavoriteClub(club);
            setIsSelecting(false);
          },
        },
      ]
    );
  };

  const handleChangeClub = () => {
    setIsSelecting(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "응원 구단",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 현재 응원 구단 카드 */}
        {favoriteClub ? (
          <View style={styles.favoriteCard}>
            <Text style={styles.favoriteLabel}>현재 응원 구단</Text>

            <View style={styles.favoriteHeaderRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.favoriteName}>{favoriteClub.nameKr}</Text>
                <Text style={styles.favoriteSub}>
                  {favoriteClub.city} · {favoriteClub.stadium}
                </Text>

                <View
                  style={[
                    styles.favoriteTag,
                    { backgroundColor: favoriteClub.mainColor },
                  ]}
                >
                  <Text style={styles.favoriteTagText}>MY CLUB</Text>
                </View>
              </View>

              <View style={styles.favoriteIconCircle}>
                <Ionicons
                  name="shield-half-outline"
                  size={26}
                  color="#fff"
                />
              </View>
            </View>

            <View style={styles.favoriteInfoBox}>
              <Text style={styles.infoLine}>· 홈 도시: {favoriteClub.city}</Text>
              <Text style={styles.infoLine}>· 홈 경기장: {favoriteClub.stadium}</Text>
              <Text style={styles.infoLine}>
                · {favoriteClub.nameKr}와(과) 함께하는 뜨거운 한 시즌! 🔥
              </Text>
            </View>

            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChangeClub}
              activeOpacity={0.85}
            >
              <Text style={styles.changeButtonText}>응원 구단 변경하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyFavoriteCard}>
            <Text style={styles.emptyTitle}>아직 응원 구단이 없어요</Text>
            <Text style={styles.emptySub}>
              좋아하는 구단을 선택해서 나만의 응원 팀을 등록해 보세요!
            </Text>
          </View>
        )}

        {/* 구단 선택 영역 (2 x 6 그리드) */}
        {isSelecting && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>구단 선택</Text>
            <Text style={styles.sectionSub}>
              응원하고 싶은 구단을 선택해 주세요.
            </Text>

            <View style={styles.clubGrid}>
              {CLUBS.map((club) => {
                const isCurrent = favoriteClub?.id === club.id;
                const color = club.mainColor;

                return (
                  <TouchableOpacity
                    key={club.id}
                    style={[
                      styles.clubCard,
                      isCurrent && { borderColor: Colors.primary },
                    ]}
                    onPress={() => handleSelectClub(club)}
                    activeOpacity={0.9}
                  >
                    {/* 상단 컬러 포인트 바 */}
                    <View
                      style={[
                        styles.colorBar,
                        { backgroundColor: color },
                      ]}
                    />

                    <View style={styles.cardContent}>
                      <View
                        style={[
                          styles.clubIconCircle,
                          { borderColor: color },
                        ]}
                      >
                        <Ionicons
                          name="shield-half-outline"
                          size={18}
                          color="#fff"
                        />
                      </View>

                      <Text style={styles.clubName} numberOfLines={1}>
                        {club.nameKr}
                      </Text>
                      <Text style={styles.clubMeta} numberOfLines={1}>
                        {club.city} · {club.stadium}
                      </Text>

                      {isCurrent && (
                        <Text style={styles.currentBadge}>선택됨</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // 현재 응원 구단 카드
  favoriteCard: {
    backgroundColor: "#101010",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderColor: "#1f2933",
    borderWidth: 1,
  },
  favoriteLabel: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  favoriteHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  favoriteSub: {
    color: "#b5b5b8",
    fontSize: 13,
    marginTop: 2,
  },
  favoriteTag: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  favoriteTagText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "700",
  },
  favoriteIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteInfoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#181818",
  },
  infoLine: {
    color: "#e5e5e5",
    fontSize: 12,
    marginBottom: 3,
  },
  changeButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  changeButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  // 응원 구단 없음
  emptyFavoriteCard: {
    backgroundColor: "#101010",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderColor: "#1f2933",
    borderWidth: 1,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptySub: {
    color: "#b5b5b8",
    fontSize: 13,
    marginTop: 6,
  },

  // 구단 리스트 섹션
  listSection: {
    marginTop: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSub: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },

  // 2 x 6 그리드
  clubGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  clubCard: {
    width: "48%",
    backgroundColor: "#111",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
    overflow: "hidden",
  },
  colorBar: {
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  clubIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 6,
  },
  clubName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  clubMeta: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 2,
  },
  currentBadge: {
    marginTop: 6,
    fontSize: 10,
    color: Colors.primary,
  },
});