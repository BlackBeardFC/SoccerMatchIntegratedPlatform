// app/mypage-pages/add-card.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function AddCardScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const isEditing = !!user.hasCard;

  const [cardBrand, setCardBrand] = useState(
    user.cardBrand ?? "하나카드"
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState(""); // MM/YY
  const [ownerName, setOwnerName] = useState("");
  const [birth, setBirth] = useState(""); // YYMMDD
  const [pw2, setPw2] = useState(""); // 비밀번호 앞 2자리

  const onSubmit = () => {
    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, "").length < 12) {
      Alert.alert("카드 번호를 올바르게 입력해주세요.");
      return;
    }
    if (!expiry.trim()) {
      Alert.alert("유효기간을 입력해주세요.");
      return;
    }

    const onlyDigits = cardNumber.replace(/\D/g, "");
    const last4 = onlyDigits.slice(-4);

    updateUser({
      hasCard: true,
      cardBrand: cardBrand || "내 카드",
      cardLast4: last4,
    });

    Alert.alert(
      isEditing ? "수정 완료" : "등록 완료",
      isEditing ? "카드 정보가 수정되었습니다." : "카드가 등록되었습니다.",
      [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const onDeleteCard = () => {
    Alert.alert(
      "카드 삭제",
      "등록된 카드를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            updateUser({
              hasCard: false,
              cardBrand: undefined,
              cardLast4: undefined,
            });
            Alert.alert("삭제 완료", "카드가 삭제되었습니다.", [
              { text: "확인", onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditing ? "카드 관리" : "카드 등록",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 6 }}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#000" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {isEditing ? "등록된 카드 정보 수정" : "새 카드 등록"}
            </Text>

            {/* 카드 이름 / 브랜드 */}
            <Text style={styles.label}>카드 이름</Text>
            <TextInput
              style={styles.input}
              value={cardBrand}
              onChangeText={setCardBrand}
              placeholder="예: 하나카드, 국민카드"
              placeholderTextColor="#888"
            />

            {/* 카드 번호 */}
            <Text style={styles.label}>카드 번호</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder={
                isEditing && user.cardLast4
                  ? `**** **** **** ${user.cardLast4}`
                  : "1234 5678 9012 3456"
              }
              placeholderTextColor="#888"
              keyboardType="number-pad"
            />

            {/* 유효기간 */}
            <Text style={styles.label}>유효기간 (MM/YY)</Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={setExpiry}
              placeholder="08/27"
              placeholderTextColor="#888"
              keyboardType="number-pad"
            />

            {/* 소유자 이름 */}
            <Text style={styles.label}>소유자 이름</Text>
            <TextInput
              style={styles.input}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="카드 소유자 이름"
              placeholderTextColor="#888"
            />

            {/* 생년월일 */}
            <Text style={styles.label}>생년월일 (YYMMDD)</Text>
            <TextInput
              style={styles.input}
              value={birth}
              onChangeText={setBirth}
              placeholder="030305"
              placeholderTextColor="#888"
              keyboardType="number-pad"
            />

            {/* 비밀번호 앞 두 자리 */}
            <Text style={styles.label}>비밀번호 앞 2자리</Text>
            <TextInput
              style={styles.input}
              value={pw2}
              onChangeText={setPw2}
              placeholder="**"
              placeholderTextColor="#888"
              maxLength={2}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>

          {/* 등록/수정 버튼 */}
          <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
            <Text style={styles.saveButtonText}>
              {isEditing ? "카드 정보 저장" : "카드 등록하기"}
            </Text>
          </TouchableOpacity>

          {/* 삭제 버튼 (등록되어 있을 때만) */}
          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#2b1214", marginTop: 8 }]}
              onPress={onDeleteCard}
            >
              <Text style={[styles.saveButtonText, { color: "#ff4e4e" }]}>
                카드 삭제하기
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
  sectionCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#c5c5c5",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: "#fff",
    backgroundColor: "#141416",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
