import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const keyboardOffset = headerHeight;

  const { register, login } = useAuth();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState(""); // 🔹 닉네임 추가
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const nameRef   = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null); // 🔹 닉네임 ref
  const emailRef  = useRef<TextInput>(null);
  const phoneRef  = useRef<TextInput>(null);
  const pwRef     = useRef<TextInput>(null);
  const pw2Ref    = useRef<TextInput>(null);

  const ensureVisible = (ref: React.RefObject<TextInput | null>) => {
    ref.current?.measureInWindow((_x, y) => {
      const targetY = Math.max(0, y - headerHeight - 12);
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    });
  };

  const onFieldFocus = (ref: React.RefObject<TextInput | null>) => () => {
    requestAnimationFrame(() => ensureVisible(ref));
  };

  const validate = () => {
    if (!name.trim()) return "이름을 입력하세요.";
    if (!nickname.trim()) return "닉네임을 입력하세요.";           // 🔹 닉네임 검사
    if (nickname.trim().length < 2) return "닉네임은 2자 이상이어야 합니다.";
    if (!email.trim()) return "이메일을 입력하세요.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "이메일 형식이 올바르지 않습니다.";
    if (!phone.trim()) return "핸드폰 번호를 입력하세요.";
    if (!/^[0-9]{10,11}$/.test(phone.trim())) return "핸드폰 번호 형식이 올바르지 않습니다.";
    if (pw.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    if (pw !== pw2) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  const onSubmit = async () => {
    const v = validate();
    setErr(v);
    if (v) return;
    try {
      setLoading(true);
      if (typeof register === "function") {
        // 🔹 당장은 기존대로 3개만 보냄 (name, email, pw)
        // 닉네임은 나중에 백엔드 붙일 때 같이 보내면 됨
        await register( name.trim(), email.trim(), pw, nickname.trim(), phone.trim()
);
      } else if (typeof login === "function") {
        await login(email.trim(), pw);
      }
      router.replace("/mypage");
    } catch {
      setErr("회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "회원가입",
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

      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={keyboardOffset}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.brandBox}>
                <Ionicons name="football-outline" size={30} color={Colors.primary} />
                <Text style={styles.brandTitle}>ShootBox</Text>
                <Text style={styles.brandDesc}>계정을 만들고 경기 예매를 시작해보세요.</Text>
              </View>

              {err && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#fff" />
                  <Text style={styles.errorText}>{err}</Text>
                </View>
              )}

              <View style={styles.form}>
                {/* 이름 */}
                <Text style={styles.label}>이름</Text>
                <TextInput
                  ref={nameRef}
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="홍길동"
                  placeholderTextColor="#8b8b8b"
                  returnKeyType="next"
                  onFocus={onFieldFocus(nameRef)}
                  onSubmitEditing={() => nicknameRef.current?.focus()} // 🔹 다음: 닉네임
                />

                {/* 닉네임 */}
                <Text style={[styles.label, { marginTop: 14 }]}>닉네임</Text>
                <TextInput
                  ref={nicknameRef}
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="경기장에서 보여질 이름"
                  placeholderTextColor="#8b8b8b"
                  returnKeyType="next"
                  autoCapitalize="none"
                  onFocus={onFieldFocus(nicknameRef)}
                  onSubmitEditing={() => emailRef.current?.focus()} // 🔹 다음: 이메일
                />

                {/* 이메일 */}
                <Text style={[styles.label, { marginTop: 14 }]}>이메일</Text>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor="#8b8b8b"
                  returnKeyType="next"
                  onFocus={onFieldFocus(emailRef)}
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />

                {/* 핸드폰 번호 */}
                <Text style={[styles.label, { marginTop: 14 }]}>핸드폰 번호</Text>
                <TextInput
                  ref={phoneRef}
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="01012345678"
                  placeholderTextColor="#8b8b8b"
                  keyboardType="phone-pad"
                  maxLength={11}
                  returnKeyType="next"
                  onFocus={onFieldFocus(phoneRef)}
                  onSubmitEditing={() => pwRef.current?.focus()}
                />

                {/* 비밀번호 */}
                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호</Text>
                <View style={styles.pwRow}>
                  <TextInput
                    ref={pwRef}
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    value={pw}
                    onChangeText={setPw}
                    secureTextEntry={!showPw}
                    placeholder="비밀번호 (6자 이상)"
                    placeholderTextColor="#8b8b8b"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="oneTimeCode"
                    returnKeyType="next"
                    onFocus={onFieldFocus(pwRef)}
                    onSubmitEditing={() => pw2Ref.current?.focus()}
                  />
                  <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                    <Ionicons name={showPw ? "eye-off" : "eye"} size={18} color="#cfcfcf" />
                  </Pressable>
                </View>

                {/* 비밀번호 확인 */}
                <Text style={[styles.label, { marginTop: 14 }]}>비밀번호 확인</Text>
                <View style={styles.pwRow}>
                  <TextInput
                    ref={pw2Ref}
                    style={[styles.input, { flex: 1, paddingRight: 44 }]}
                    value={pw2}
                    onChangeText={setPw2}
                    secureTextEntry={!showPw2}
                    placeholder="비밀번호 확인"
                    placeholderTextColor="#8b8b8b"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="done"
                    onFocus={onFieldFocus(pw2Ref)}
                    onSubmitEditing={onSubmit}
                  />
                  <Pressable onPress={() => setShowPw2(v => !v)} style={styles.eyeBtn}>
                    <Ionicons name={showPw2 ? "eye-off" : "eye"} size={18} color="#cfcfcf" />
                  </Pressable>
                </View>

                {/* 회원가입 버튼 */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && { opacity: 0.5 }]}
                  disabled={loading}
                  onPress={onSubmit}
                >
                  {loading ? <ActivityIndicator /> : <Text style={styles.submitBtnText}>회원가입</Text>}
                </TouchableOpacity>

                {/* 로그인으로 이동 */}
                <Pressable style={styles.helperRow} onPress={() => router.push("/auth/login")}>
                  <Text style={styles.helperText}>이미 계정이 있나요? </Text>
                  <Text style={[styles.helperText, { color: Colors.primary, fontWeight: "800" }]}>
                    로그인
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
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  brandBox: { alignItems: "center", marginBottom: 18 },
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

  form: { marginTop: 6 },
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

  submitBtn: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },

  helperRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  helperText: { color: "#cfcfcf", fontSize: 12 },
});
