// //공통 파일 스타일

// import { StyleSheet } from "react-native";
// import Colors from "./Colors";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.background,
//   },
//   text: {
//     color: Colors.text,
//     fontSize: 18,
//   },
// });

import { StyleSheet } from "react-native";
import Colors from "./Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
  },
});
