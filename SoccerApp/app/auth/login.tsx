import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);
    if (!email.trim() || !pw.trim()) {
      setErr("이메일과 비밀번호를 입력하세요.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), pw);
      router.replace("/mypage");
    } catch {
      setErr("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "로그인",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 0, padding: 6, borderRadius: 10 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start", 
                paddingBottom: 40,
                paddingTop: insets.top + 10,
                paddingHorizontal: 18,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.brandBox}>
                <Ionicons name="football-outline" size={40} paddingTop={0} color={Colors.primary} />
                <Text style={styles.brandTitle}>ShootBox</Text>
                <Text style={styles.brandDesc}>로그인 후 다양한 기능을 활용해보세요.</Text>
              </View>

              {err && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#fff" />
                  <Text style={styles.errorText}>{err}</Text>
                </View>
              )}

              <View style={styles.label}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor="#8b8b8b"
                  returnKeyType="next"
                />

                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호</Text>
                <View style={styles.pwRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    placeholder="비밀번호"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPw}
                    value={pw}
                    onChangeText={setPw}
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                  <Pressable
                    onPress={() => setShowPw(!showPw)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPw ? "eye-off" : "eye"}
                      size={18}
                      color="#cfcfcf"
                    />
                  </Pressable>
                </View>

                <TouchableOpacity
                  style={[styles.loginBtn, loading && { opacity: 0.5 }]}
                  disabled={loading}
                  onPress={onSubmit}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.loginBtnText}>로그인</Text>
                  )}
                </TouchableOpacity>

                <Pressable
                  style={styles.helperRow}
                  onPress={() => router.push("/auth/register")}
                >
                  <Text style={styles.helperText}>아직 계정이 없나요? </Text>
                  <Text
                    style={[
                      styles.helperText,
                      { color: Colors.primary, fontWeight: "800" },
                    ]}
                  >
                    회원가입
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  brandBox: { alignItems: "center", marginBottom: 20 },
  brandTitle: { color: "#fff", fontWeight: "900", fontSize: 22, marginTop: 8 },
  brandDesc: { color: "#cfcfcf", fontSize: 12, marginTop: 6 },
  errorBox: {
    backgroundColor: "#2a0f12",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  errorText: { color: "#fff", fontSize: 12, flexShrink: 1 },
  label: { color: "#b5b5b5", fontSize: 12, marginBottom: 8 },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  pwRow: { position: "relative", flexDirection: "row", alignItems: "center" },
  eyeBtn: {
    position: "absolute",
    right: 10,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  loginBtn: {
    marginTop: 35,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  helperRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  helperText: { color: "#cfcfcf", fontSize: 12, marginBottom: 40 },
});

