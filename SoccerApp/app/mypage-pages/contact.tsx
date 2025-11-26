import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

type CategoryKey = "reserve" | "payment" | "refund" | "account" | "tech" | "etc";

type IconLib = "ion" | "mci";
type CatDef = { key: CategoryKey; label: string; icon: { lib: IconLib; name: string } };

const CATEGORIES: CatDef[] = [
  { key: "reserve",  label: "예매 관련",   icon: { lib: "ion", name: "ticket-outline" } },
  { key: "payment",  label: "결제 관련",   icon: { lib: "ion", name: "card-outline" } },
  { key: "refund",   label: "환불 관련",   icon: { lib: "ion", name: "cash-outline" } },
  { key: "account",  label: "계정 관련",   icon: { lib: "ion", name: "key-outline" } },
  { key: "tech",     label: "기술 지원",   icon: { lib: "mci", name: "wrench-outline" } },
  { key: "etc",      label: "기타 문의",   icon: { lib: "ion", name: "help-circle-outline" } },
];

const MAX_LEN = 500;

export default function ContactScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryKey>("reserve");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const remain = useMemo(() => MAX_LEN - content.length, [content]);

  const onSubmit = () => {
    if (!title.trim()) return Alert.alert("제목을 입력해주세요.");
    if (!content.trim()) return Alert.alert("문의 내용을 입력해주세요.");
    // TODO: 서버 연동
    Alert.alert("문의 접수 완료", "빠르게 확인 후 답변드리겠습니다.", [
      { text: "확인", onPress: () => router.back() },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "문의사항",
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

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#000" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={64}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View style={styles.headerNote}>
            <Ionicons name="information-circle-outline" size={16} color="#9aa0a6" />
            <Text style={styles.headerNoteText}>
              문의 유형을 선택하고 내용을 입력해 주세요. 빠르게 답변드릴게요.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>문의 카테고리</Text>
          <View style={styles.categoryWrap}>
            {CATEGORIES.map((c) => {
              const selected = category === c.key;
              const color = selected ? "#fff" : "#cfcfcf";
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  style={[styles.chip, selected && styles.chipOn]}
                >
                  {c.icon.lib === "ion" ? (
                    <Ionicons name={c.icon.name as any} size={16} color={color} style={{ marginRight: 6 }} />
                  ) : (
                    <MaterialCommunityIcons name={c.icon.name as any} size={16} color={color} style={{ marginRight: 6 }} />
                  )}
                  <Text style={[styles.chipText, selected && styles.chipTextOn]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>문의 제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="문의 제목을 입력하세요"
            placeholderTextColor="#8b8b8b"
            maxLength={100}
            returnKeyType="next"
          />

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>문의 내용</Text>
          <View style={styles.textareaWrap}>
            <TextInput
              style={styles.textarea}
              value={content}
              onChangeText={(t) => setContent(t.slice(0, MAX_LEN))}
              placeholder="문의 내용을 자세히 입력해주세요"
              placeholderTextColor="#8b8b8b"
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.counter}>{content.length}/{MAX_LEN}</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
              <Text style={styles.secondaryBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit}>
              <Text style={styles.primaryBtnText}>문의 접수</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },

  headerNote: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  headerNoteText: { color: "#9aa0a6", fontSize: 12 },

  sectionTitle: { color: "#cfcfcf", fontSize: 12, marginBottom: 8 },

  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2b2f33",
    backgroundColor: "transparent",
  },
  chipOn: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(179,14,41,0.12)",
  },
  chipText: { color: "#cfcfcf", fontSize: 13, fontWeight: "600" },
  chipTextOn: { color: "#fff" },

  input: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2b2f33",
    color: "#fff",
    height: 46,
    paddingHorizontal: 12,
  },
  textareaWrap: { position: "relative" },
  textarea: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2b2f33",
    color: "#fff",
    minHeight: 140,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 22,
  },
  counter: { position: "absolute", right: 10, bottom: 8, color: "#9aa0a6", fontSize: 11 },

  btnRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2e3337",
  },
  secondaryBtnText: { color: "#e5e7eb", fontWeight: "800" },

  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900" },
});
