//공통 색상 정의

// export default {
//   primary: "#b30e29", // 검은수염 FC 메인 컬러
//   background: "#000000", 
//   text: "#ffffff",
//   tabIconActive: "#b30e29",
//   tabIconInactive: "#999999",
// };


// constants/Colors.ts
const Colors = {
  // 브랜드/탭
  primary: "#b30e29",
  tabIconActive: "#b30e29",
  tabIconInactive: "#8e8e93",

  // 배경/텍스트
  background: "#0f0f10",
  surface: "#1a1b1e",
  text: "#ffffff",
  textMuted: "#b5b5b8",

  // 보더 등
  border: "#2a2b2f",

  // 선택: 필요하면 사용
  success: "#34c759",
  danger: "#ff3b30",
  warning: "#ffcc00",
} as const;

export default Colors;
