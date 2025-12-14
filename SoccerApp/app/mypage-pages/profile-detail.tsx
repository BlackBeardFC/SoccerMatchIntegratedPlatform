import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";

export default function editProfileScreen() {
  const router = useRouter();
    const { user, updateUser } = useAuth();

  // AuthContext / API에서 가져오도록 변경
  const [nickname, setNickname] = useState(user.nickname);
  const [name, setName] = useState(user.name);
  const email = user.email; // 읽기 전용
  const [phone, setPhone] = useState(user.phone);
  const [birth, setBirth] = useState(user.birth);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    user.profileImageUri
  );

  const handleChangeProfileImage = async () => {
    // 1) 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진을 변경하려면 앨범 접근 권한이 필요합니다.");
      return;
    }

    // 2) 갤러리 열기
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,      // 네모 안에서 자르기
      aspect: [1, 1],           // 1:1 비율 (동그란 프로필에 어울림)
      quality: 0.9,
    });

    if (result.canceled) return;

    // 3) 선택된 이미지 URI 상태에 저장
    const uri = result.assets[0].uri;
    setProfileImageUri(uri);

    // 🔹 나중에 여기서 서버로 업로드 API 호출하면 됨
    // await uploadProfileImage(uri);
  };

  const handleSave = () => {
    // TODO: 유효성 검사 + 백엔드 API 호출
    updateUser({
      nickname, name, phone, birth, profileImageUri });
    console.log("저장:", { nickname, name, email, phone, birth, profileImageUri });
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "내 정보 수정",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerBackVisible: false,
          contentStyle: { backgroundColor: "#000" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* 1. 프로필 섹션 */}
        <View style={styles.sectionCard}>
          <SectionTitle title="프로필" />

          <View style={styles.profileRow}>
            <View style={styles.profileImageWrapper}>
             {profileImageUri ? (
                <Image
                    source={{ uri: profileImageUri }}
                    style={styles.profileImage}
                    />
                ) : (
                    // 아직 이미지 안 골랐을 때 보여줄 빈 동그라미
                    <View style={styles.profileEmptyCircle}>
                    <Ionicons name="person" size={32} color="#555" />
                    </View>
                 )}
              <TouchableOpacity
                style={styles.profileImageEditBadge}
                onPress={handleChangeProfileImage}
              >
                <Ionicons name="camera" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileTextWrapper}>
              <Text style={styles.profileLabel}>닉네임</Text>
              <TextInput
                style={styles.profileInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임을 입력하세요"
                placeholderTextColor="#666666"
              />
            </View>
          </View>
        </View>

        {/* 2. 기본 정보 섹션 */}
        <View style={styles.sectionCard}>
          <SectionTitle title="기본 정보" />

          {/* 이름 */}
          <FormRow label="이름">
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#666666"
            />
          </FormRow>

          {/* 이메일 (읽기 전용 예시) */}
          <FormRow label="이메일">
            <View style={[styles.input, styles.inputReadonly]}>
              <Text style={styles.inputReadonlyText}>{email}</Text>
            </View>
          </FormRow>

          {/* 전화번호 */}
          <FormRow label="전화번호">
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="010-0000-0000"
              placeholderTextColor="#666666"
            />
          </FormRow>

          {/* 생년월일 */}
          <FormRow label="생년월일">
            <TextInput
              style={styles.input}
              value={birth}
              onChangeText={setBirth}
              placeholder="YYYY.MM.DD"
              placeholderTextColor="#666666"
            />
          </FormRow>
        </View>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>변경 사항 저장</Text>
            </TouchableOpacity>
        </ScrollView>
    </>     
  );
}

/* ---------------------- 서브 컴포넌트 ---------------------- */

type SectionTitleProps = {
  title: string;
};

type FormRowProps = {
  label: string;
  children: React.ReactNode;
};

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleWrapper}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function FormRow({ label, children }: FormRowProps) {
  return (
    <View style={styles.formRow}>
      <Text style={styles.formLabel}>{label}</Text>
      {children}
    </View>
  );
}

/* ------------------------- 스타일 ------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  sectionCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    borderRadius: 3,
    backgroundColor: "#b30e29",
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },

  /* 프로필 */
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#b30e29",
    overflow: "hidden",
    marginRight: 16,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
    profileEmptyCircle: {
    flex: 1,                      // 부모(profileImageWrapper)를 꽉 채우게
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2a2a2c",   // 어두운 회색 배경
  },
  profileImageEditBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileTextWrapper: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 13,
    color: "#c5c5c5",
    marginBottom: 4,
  },
  profileInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "#141416",
  },

  /* 기본 정보 폼 */
  formRow: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 13,
    color: "#c5c5c5",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "#141416",
  },
  inputReadonly: {
    backgroundColor: "#101015",
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputReadonlyText: {
    fontSize: 14,
    color: "#9a9a9a",
  },

  /* 저장 버튼 */
  saveButton: {
    backgroundColor: "#b30e29",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
