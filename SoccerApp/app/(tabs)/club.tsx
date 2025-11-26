import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import { CLUBS, type Club } from "../../data/clubs";
import { clubLogos } from "../../data/clubLogos";

const NUM_COLUMNS = 3;
const GAP = 15;
const PADDING = 16;

const logoTweak: Record<
  string,
  { scale?: number; offsetY?: number }
> = {
  blackbeard: { scale: 0.9, offsetY: 2 },
  raccoon: { scale: 1.1, offsetY: 1 },
  snake: { scale: 1.12, offsetY: 0 },
  elephant: { scale: 1.13, offsetY: 0 },
  owl: { scale: 1, offsetY: 1 },
  whitebeard: { scale: 0.83, offsetY: 0 },
  ant: { scale: 1, offsetY: 0 },
  crow: { scale: 1.02, offsetY: -1 },
  hyeonmu: { scale: 1.05, offsetY: 1 },
  sparrow: { scale: 0.99, offsetY: -1 },
  octopus: { scale: 1.03, offsetY: -1.3 },
  toad: { scale: 1.04, offsetY: -1.5 },
};

export default function ClubTab() {
  const { width } = useWindowDimensions();

  const itemSize = useMemo(() => {
    const totalGap = GAP * (NUM_COLUMNS - 1);
    return (width - PADDING * 2 - totalGap) / NUM_COLUMNS;
  }, [width]);

  const data = useMemo(
    () => Object.values(CLUBS).map((c: Club) => ({ id: c.id, name: c.name })),
    []
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrap}>
        <Text style={styles.headerSub}>각 구단 로고를 누르면 상세페이지가 열립니다.</Text>
      </View>
      <FlatList
        key={`cols-${NUM_COLUMNS}`}
        data={data}
        keyExtractor={(it) => it.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ padding: PADDING, paddingBottom: 40 }}
        columnWrapperStyle={{ gap: GAP }}
        renderItem={({ item }) => {
          const logo = clubLogos[item.id];
          const tweak = logoTweak[item.id] || {};
          const scaleAnim = new Animated.Value(1);

          const handlePressIn = () => {
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
              speed: 20,
              bounciness: 5,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              speed: 20,
              bounciness: 5,
            }).start();
          };

          return (
            <Link
              href={{ pathname: "/club/[id]", params: { id: item.id } }}
              asChild
            >
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.card, { width: itemSize }]}
                android_ripple={{ color: "rgba(255,255,255,0.08)" }}
              >
                <Animated.View
                  style={[
                    styles.logoFrame,
                    { height: itemSize, transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Image
                    source={logo}
                    resizeMode="contain"
                    style={[
                      styles.logo,
                      {
                        transform: [
                          { scale: tweak.scale ?? 0.9 },
                          { translateY: tweak.offsetY ?? 0 },
                        ],
                      },
                    ]}
                  />
                </Animated.View>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            </Link>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },

  headerWrap: {
    alignItems: "center",
    marginBottom: 20
  },
  headerSub: {
    color: "#B5B5B8",
    fontSize: 13,
    textAlign: "left", 
    alignSelf: "flex-start", 
    width: "100%", 
    marginLeft: 20,
    marginTop: 8
  },

  card: {
    alignItems: "center",
  },
  logoFrame: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },
  logo: {
    width: "200%",
    height: "200%",
  },
  name: {
    marginTop: -10, 
    width: "100%",
    textAlign: "center",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
