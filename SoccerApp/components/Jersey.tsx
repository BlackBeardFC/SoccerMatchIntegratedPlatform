import React from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from "react-native-svg";

type Props = {
  width?: number;           // 유니폼 가로 (기본 44)
  jersey: string;           // 상의(메인) 색 (#b30e29 등)
  trim: string;             // 칼라/테두리 색 (#0f0f10 등)
  number?: number | string; // 등번호
};

export default function Jersey({ width = 44, jersey, trim, number }: Props) {
  const w = width;
  const h = Math.round(w * 1.1); // 비율 살짝 세로 길게

  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox="0 0 296 321">
        <Defs>
          {/* 상의에 약한 하이라이트 */}
          <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={jersey} stopOpacity={1} />
            <Stop offset="100%" stopColor={jersey} stopOpacity={0.8} />
          </LinearGradient>
        </Defs>

        {/* 외곽선(검은 굵은 라인 느낌) */}
        <Path
          d="M24 116c-6-3-10-9-11-16 16-10 33-17 52-21 16-3 29-10 38-16 16-10 37-10 53 0 9 6 22 13 38 16 19 4 36 11 52 21-1 7-5 13-11 16l-7 3v108c0 18-8 34-22 45-16 13-37 20-73 24-36-4-58-11-73-24-14-11-22-27-22-45V119l-6-3Z"
          fill={trim}
        />

        {/* 몸통 */}
        <Path
          d="M38 124v102c0 14 6 26 17 35 14 11 33 17 63 20 30-3 49-9 63-20 11-9 17-21 17-35V124c-23-7-41-15-55-24-10-6-22-6-32 0-14 9-32 17-55 24Z"
          fill="url(#bodyGrad)"
        />

        {/* 소매 */}
        <Path
          d="M38 124c-10-1-20-5-30-10-4-2-7-5-8-9 14-8 29-14 45-17 6 12 15 24 27 36-12 2-23 2-34 0Z"
          fill="url(#bodyGrad)"
          stroke={trim}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <Path
          d="M258 124c10-1 20-5 30-10 4-2 7-5 8-9-14-8-29-14-45-17-6 12-15 24-27 36 12 2 23 2 34 0Z"
          fill="url(#bodyGrad)"
          stroke={trim}
          strokeWidth={6}
          strokeLinejoin="round"
        />

        {/* 밑단 */}
        <Path
          d="M58 250c0 15 0 15 6 21 16 15 42 22 84 26 42-4 68-11 84-26 6-6 6-6 6-21"
          stroke={trim}
          strokeWidth={8}
          fill="none"
        />

        {/* 네크/칼라 */}
        <G>
          <Path
            d="M97 63c13 8 25 12 51 12s38-4 51-12c-4-6-8-10-13-13-25 9-50 9-76 0-5 3-9 7-13 13Z"
            fill={trim}
          />
        </G>

        {/* 등번호: 외곽선(아래층) + 내부 채움(위층) 두 겹 */}
        {number != null && (
          <>
            {/* 아래층(Stroke) */}
            <SvgText
              x={148}
              y={188}
              fontSize={90}
              fontWeight="800"
              textAnchor="middle"
              fill="none"
              stroke={trim}
              strokeWidth={8}
            >
              {String(number)}
            </SvgText>

            {/* 위층(Fill) */}
            <SvgText
              x={148}
              y={188}
              fontSize={90}
              fontWeight="800"
              textAnchor="middle"
              fill="#ffffff"
            >
              {String(number)}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}