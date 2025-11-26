export type Player = { name: string; number: number; isCaptain?: boolean };
export type Match = {
  date: string; opponent: string; homeAway: "H" | "A"; result: "W" | "D" | "L"; score: string;
};
export type Club = {
  id: string;
  name: string;
  region: string;
  stadium: string;
  coach: string;
  formation: string;
  kit: { jersey: string; trim: string }; 
  players: { gk: Player; lines: Player[][] }; 
  season: { rank: number; wins: number; draws: number; losses: number; gf: number; ga: number; pts: number };
  recent: Match[];
};

export const CLUBS: Record<string, Club> = {
  blackbeard: {
    id: "blackbeard",
    name: "검은수염 FC",
    region: "부천",
    stadium: "검은수염 스타디움",
    coach: "미겔 산토스 🇵🇹",
    formation: "4-3-3 (공미형)",
    kit: { jersey: "#b30e29", trim: "#0f0f10" },

    players: {
      gk: { name: "김태윤", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "오세훈", number: 2 }, // RB
          { name: "이현수", number: 4 }, // CB
          { name: "파비오 산체스 🇧🇷", number: 5 }, // CB
          { name: "한지훈", number: 3 }, // LB
        ],
        // MF (3)
        [
          { name: "장도윤", number: 6 }, // CDM
          { name: "이찬혁", number: 8 }, // CM
          { name: "박시우", number: 10 }, // CAM
        ],
        // FW (3)
        [
          { name: "루카스 안드레 🇧🇷", number: 11 }, // RW
          { name: "김민수", number: 7 }, // LW
          { name: "정우진", number: 9 }, // ST
        ],
      ],
    },

    season: {
      rank: 1,
      wins: 18,
      draws: 6,
      losses: 4,
      gf: 57,
      ga: 26,
      pts: 60,
    },

    recent: [
      { date: "2025-10-12", opponent: "라쿤 FC", homeAway: "H", result: "W", score: "3-0" },
      { date: "2025-10-06", opponent: "현무 SC", homeAway: "A", result: "D", score: "1-1" },
      { date: "2025-09-28", opponent: "까마귀 FC", homeAway: "H", result: "W", score: "2-1" },
      { date: "2025-09-21", opponent: "부엉이 FC", homeAway: "A", result: "W", score: "4-2" },
      { date: "2025-09-14", opponent: "엘리펀트 FC", homeAway: "H", result: "L", score: "0-1" },
    ],
  },

  raccoon: {
    id: "raccoon",
    name: "라쿤 FC",
    region: "김천",
    stadium: "라쿤 아레나",
    coach: "최도형 🇰🇷",
    formation: "4-2-3-1 (수미형)",
    kit: { jersey: "#7b5e42", trim: "#e4d6b5" },

    players: {
      gk: { name: "박민재", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "조상우", number: 22 },          // RB
          { name: "황재원", number: 5 },           // CB
          { name: "안토니오 디아스 🇪🇸", number: 3 }, // CB
          { name: "이서준", number: 27 },          // LB
        ],
        // MF (3) → CDM 2 + CAM 1
        [
          { name: "장성빈", number: 6 }, // CDM
          { name: "김경호", number: 14 }, // CDM
          { name: "김도환", number: 10 }, // CAM
        ],
        // FW (3)
        [
          { name: "나카무라 쇼 🇯🇵", number: 17 }, // RW
          { name: "박현준", number: 11 },           // LW
          { name: "백현우", number: 9 },            // ST
        ],
      ],
    },

    season: {
      rank: 3,
      wins: 15,
      draws: 9,
      losses: 7,
      gf: 48,
      ga: 33,
      pts: 54,
    },

    recent: [
      { date: "2025-10-13", opponent: "검은수염 FC", homeAway: "A", result: "L", score: "0-3" },
      { date: "2025-10-07", opponent: "참새 FC", homeAway: "H", result: "W", score: "2-1" },
      { date: "2025-09-29", opponent: "까마귀 FC", homeAway: "A", result: "D", score: "1-1" },
      { date: "2025-09-21", opponent: "현무 FC", homeAway: "H", result: "W", score: "3-0" },
      { date: "2025-09-14", opponent: "엘리펀트 FC", homeAway: "A", result: "W", score: "2-0" },
    ],
  },

  snake: {
    id: "snake",
    name: "스네이크 FC",
    region: "대전",
    stadium: "스네이크 파크",
    coach: "알레한드로 로페즈 🇪🇸",
    formation: "3-4-3 (공격형)",
    kit: { jersey: "#3b7c57", trim: "#0f0f10" },

    players: {
      gk: { name: "최강호", number: 1 },
      lines: [
        // DF (3)
        [
          { name: "박영준", number: 4 },
          { name: "브루노 실바 🇧🇷", number: 5 },
          { name: "최정훈", number: 6 },
        ],
        // MF (4) → RM, CM, CM, LM
        [
          { name: "임태규", number: 2 },   // RM
          { name: "김대윤", number: 8 },   // CM
          { name: "한유찬", number: 16 },  // CM
          { name: "정지민", number: 3 },   // LM
        ],
        // FW (3) → RW, LW, ST
        [
          { name: "세르히오 로하스 🇨🇴", number: 11 }, // RW
          { name: "이현우", number: 7 },               // LW
          { name: "김우람", number: 9 },               // ST
        ],
      ],
    },

    season: {
      rank: 6,
      wins: 13,
      draws: 7,
      losses: 10,
      gf: 42,
      ga: 36,
      pts: 46,
    },

    recent: [
      { date: "2025-10-09", opponent: "두꺼비 FC", homeAway: "H", result: "W", score: "2-1" },
      { date: "2025-10-03", opponent: "흰수염 FC", homeAway: "A", result: "L", score: "0-1" },
      { date: "2025-09-27", opponent: "현무 SC", homeAway: "H", result: "D", score: "1-1" },
    ],
  },

  elephant: {
    id: "elephant",
    name: "엘리펀트 FC",
    region: "포항",
    stadium: "엘리펀트 스타디움",
    coach: "박성진 🇰🇷",
    formation: "4-4-2 (밸런스형)",
    kit: { jersey: "#8c8c8c", trim: "#5e4632" },

    players: {
      gk: { name: "장도현", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "김주혁", number: 2 },          // RB
          { name: "이주환", number: 4 },          // CB
          { name: "마르코 디에즈 🇪🇸", number: 5 }, // CB
          { name: "최기훈", number: 3 },          // LB
        ],
        // MF (4) → RM, CM, CM, LM
        [
          { name: "오태민", number: 8 },  // RM
          { name: "전현수", number: 6 },  // CM
          { name: "조하늘", number: 10 }, // CM
          { name: "윤태준", number: 7 },  // LM
        ],
        // FW (2)
        [
          { name: "김세윤", number: 9 },             // ST
          { name: "아다마 투레 🇲🇱", number: 17 },   // ST
        ],
      ],
    },

    season: {
      rank: 5,
      wins: 14,
      draws: 8,
      losses: 8,
      gf: 45,
      ga: 34,
      pts: 50,
    },

    recent: [
      { date: "2025-10-10", opponent: "까마귀 FC", homeAway: "H", result: "W", score: "3-1" },
      { date: "2025-10-05", opponent: "참새 FC", homeAway: "A", result: "D", score: "2-2" },
      { date: "2025-09-28", opponent: "스네이크 FC", homeAway: "H", result: "L", score: "0-2" },
      { date: "2025-09-20", opponent: "라쿤 FC", homeAway: "H", result: "L", score: "0-2" },
    ],
  },

  owl: {
    id: "owl",
    name: "부엉이 FC",
    region: "서울",
    stadium: "부엉이 필드",
    coach: "이시카와 히로시 🇯🇵",
    formation: "3-5-2 (공미형)",
    kit: { jersey: "#6b5638", trim: "#c9a86a" }, 

    players: {
      gk: { name: "정민호", number: 1 },
      lines: [
        // DF (3)
        [
          { name: "박찬호", number: 5 },
          { name: "장진수", number: 6 },
          { name: "윤승현", number: 3 },
        ],
        // MF (5) → RM, CM, CM, CAM, LM
        [
          { name: "조형우", number: 2 },   // RM
          { name: "김영하", number: 14 },  // CM
          { name: "오세민", number: 10 },  // CM
          { name: "이준석", number: 8 },   // CAM
          { name: "김도윤", number: 7 },   // LM
        ],
        // FW (2)
        [
          { name: "황성빈", number: 9 },
          { name: "강보원", number: 11 }, // 주장 (C)
        ],
      ],
    },

    season: {
      rank: 7,
      wins: 11,
      draws: 9,
      losses: 10,
      gf: 39,
      ga: 35,
      pts: 42,
    },

    recent: [
      { date: "2025-10-12", opponent: "현무 FC", homeAway: "H", result: "W", score: "2-1" },
      { date: "2025-10-06", opponent: "문어 FC", homeAway: "A", result: "L", score: "1-2" },
      { date: "2025-09-29", opponent: "까마귀 FC", homeAway: "H", result: "D", score: "0-0" },
      { date: "2025-09-22", opponent: "라쿤 FC", homeAway: "A", result: "L", score: "1-3" },
    ],
  },

  whitebeard: {
    id: "whitebeard",
    name: "흰수염 FC",
    region: "인천",
    stadium: "흰수염 돔",
    coach: "다니엘 루이즈 🇦🇷",
    formation: "4-2-3-1 (밸런스형)",
    kit: { jersey: "#c7e1f0", trim: "#004b87" },

    players: {
      gk: { name: "강진우", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "이재하", number: 2 },        // RB
          { name: "송우혁", number: 4 },        // CB
          { name: "마테우스 🇧🇷", number: 5 },   // CB
          { name: "박기훈", number: 3 },        // LB
        ],
        // MF (3) → CDM, CDM, CAM
        [
          { name: "정태영", number: 6 },        // CDM
          { name: "박연호", number: 8 },        // CDM
          { name: "문찬수", number: 10 },       // CAM
        ],
        // FW (3) → RW, LW, ST
        [
          { name: "리카르도 🇨🇱", number: 11 }, // RW
          { name: "김현우", number: 7 },        // LW
          { name: "윤재민", number: 9 },        // ST
        ],
      ],
    },

    season: {
      rank: 4,
      wins: 16,
      draws: 6,
      losses: 8,
      gf: 49,
      ga: 32,
      pts: 54,
    },

    recent: [
      { date: "2025-10-13", opponent: "스네이크 FC", homeAway: "H", result: "W", score: "1-0" },
      { date: "2025-10-05", opponent: "검은수염 FC", homeAway: "A", result: "L", score: "0-2" },
      { date: "2025-09-28", opponent: "엘리펀트 FC", homeAway: "H", result: "W", score: "3-1" },
      { date: "2025-09-22", opponent: "부엉이 FC", homeAway: "A", result: "W", score: "2-0" },
    ],
  },

  ant: {
    id: "ant",
    name: "개미 FC",
    region: "광주",
    stadium: "개미 스타디움",
    coach: "김기환 🇰🇷",
    formation: "5-3-2 (수미형)",
    kit: { jersey: "#a84300", trim: "#4b2e1b" },

    players: {
      gk: { name: "최범수", number: 1 },
      lines: [
        // DF (5) → RWB, CB, CB, CB, LWB
        [
          { name: "박인서", number: 2 },   // RWB
          { name: "최건호", number: 4 },   // CB
          { name: "박태호", number: 5 },   // CB
          { name: "오민석", number: 3 },   // CB
          { name: "김재혁", number: 7 },   // LWB
        ],
        // MF (3) → CM, CM, CAM
        [
          { name: "이현호", number: 8 },   // CM
          { name: "김나연", number: 6 },   // CM
          { name: "조성빈", number: 10 },  // CAM
        ],
        // FW (2)
        [
          { name: "리 하오 🇨🇳", number: 19 }, // ST
          { name: "강현수", number: 9 },       // ST
        ],
      ],
    },

    season: {
      rank: 8,
      wins: 10,
      draws: 8,
      losses: 12,
      gf: 36,
      ga: 40,
      pts: 38,
    },

    recent: [
      { date: "2025-10-13", opponent: "부엉이 FC", homeAway: "A", result: "D", score: "1-1" },
      { date: "2025-10-06", opponent: "두꺼비 FC", homeAway: "H", result: "L", score: "0-2" },
      { date: "2025-09-28", opponent: "현무 SC", homeAway: "A", result: "W", score: "2-0" },
      { date: "2025-09-21", opponent: "엘리펀트 FC", homeAway: "H", result: "D", score: "0-0" },
    ],
  },

  crow: {
    id: "crow",
    name: "까마귀 FC",
    region: "안양",
    stadium: "까마귀 파크",
    coach: "장요한 🇰🇷",
    formation: "4-1-4-1 (수미형)",
    kit: { jersey: "#1a1a1a", trim: "#e2e2e2" },

    players: {
      gk: { name: "배성우", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "윤태성", number: 2 },             // RB
          { name: "임수현", number: 5 },             // CB
          { name: "알렉산더 코르사 🇷🇸", number: 6 }, // CB
          { name: "최현호", number: 3 },             // LB
        ],
        // MF (5) → CDM, RM, CM, CM, LM
        [
          { name: "김지호", number: 14 },  // CDM
          { name: "박성현", number: 11 },  // RM
          { name: "정재원", number: 8 },   // CM
          { name: "이한결", number: 10 },  // CM
          { name: "강도윤", number: 7 },   // LM
        ],
        // FW (1)
        [
          { name: "마르코 브란코 🇵🇹", number: 9 }, // ST
        ],
      ],
    },

    season: {
      rank: 9,
      wins: 9,
      draws: 9,
      losses: 12,
      gf: 34,
      ga: 39,
      pts: 36,
    },

    recent: [
      { date: "2025-10-14", opponent: "엘리펀트 FC", homeAway: "A", result: "L", score: "1-3" },
      { date: "2025-10-07", opponent: "라쿤 FC", homeAway: "H", result: "D", score: "1-1" },
      { date: "2025-09-30", opponent: "참새 FC", homeAway: "A", result: "W", score: "2-0" },
      { date: "2025-09-22", opponent: "현무 FC", homeAway: "H", result: "L", score: "0-2" },
    ],
  },

  hyeonmu: {
    id: "hyeonmu",
    name: "현무 FC",
    region: "포항",
    stadium: "현무 스타디움",
    coach: "마이클 크로포드 🇬🇧",
    formation: "5-4-1 (수미형)",
    kit: { jersey: "#004f48", trim: "#00332e" },

    players: {
      gk: { name: "박동혁", number: 1 },
      lines: [
        // DF (5)
        [
          { name: "김형진", number: 2 },   // RWB
          { name: "최정민", number: 4 },   // CB
          { name: "김도하", number: 5 },   // CB
          { name: "이준하", number: 3 },   // CB
          { name: "이강민", number: 7 },   // LWB
        ],
        // MF (4)
        [
          { name: "조성재", number: 6 },   // RM
          { name: "박현우", number: 8 },   // CM
          { name: "김태하", number: 10 },  // CM
          { name: "우루베 🇯🇵", number: 17 }, // LM
        ],
        // FW (1)
        [
          { name: "존 멘데스 🇵🇹", number: 9 }, // ST
        ],
      ],
    },

    season: {
      rank: 11,
      wins: 7,
      draws: 8,
      losses: 14,
      gf: 28,
      ga: 44,
      pts: 29,
    },

    recent: [
      { date: "2025-10-10", opponent: "부엉이 FC", homeAway: "H", result: "W", score: "2-0" },
      { date: "2025-10-04", opponent: "두꺼비 FC", homeAway: "A", result: "D", score: "1-1" },
      { date: "2025-09-27", opponent: "라쿤 FC", homeAway: "H", result: "L", score: "0-3" },
      { date: "2025-09-20", opponent: "까마귀 FC", homeAway: "A", result: "W", score: "1-0" },
    ],
  },

  sparrow: {
    id: "sparrow",
    name: "참새 FC",
    region: "수원",
    stadium: "참새 스타디움",
    coach: "김태수 🇰🇷",
    formation: "4-3-3 (공격형)",
    kit: { jersey: "#b68a56", trim: "#6a4c2c" },

    players: {
      gk: { name: "한지혁", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "이도윤", number: 2 },          // RB
          { name: "조경민", number: 5 },          // CB
          { name: "마르셀로 🇧🇷", number: 4 },     // CB
          { name: "김주한", number: 3 },          // LB
        ],
        // MF (3) → CDM, CM, CAM
        [
          { name: "최현석", number: 6 },          // CDM
          { name: "정진호", number: 8 },          // CM
          { name: "이우형", number: 10 },         // CAM
        ],
        // FW (3) → RW, LW, ST
        [
          { name: "박승우", number: 11 },         // RW
          { name: "다비드 곤살레스 🇪🇸", number: 7 }, // LW
          { name: "김성현", number: 9 },          // ST
        ],
      ],
    },

    season: {
      rank: 8,
      wins: 12,
      draws: 6,
      losses: 12,
      gf: 41,
      ga: 39,
      pts: 42,
    },

    recent: [
      { date: "2025-10-13", opponent: "까마귀 FC", homeAway: "H", result: "L", score: "0-2" },
      { date: "2025-10-06", opponent: "라쿤 FC", homeAway: "A", result: "L", score: "1-2" },
      { date: "2025-09-29", opponent: "두꺼비 FC", homeAway: "H", result: "W", score: "2-0" },
      { date: "2025-09-22", opponent: "흰수염 FC", homeAway: "A", result: "D", score: "1-1" },
    ],
  },

  octopus: {
    id: "octopus",
    name: "문어 FC",
    region: "제주",
    stadium: "문어돔",
    coach: "앙헬 모라 🇪🇸",
    formation: "3-4-2-1 (공미형)",
    kit: { jersey: "#5a3b52", trim: "#c8b28b" },

    players: {
      gk: { name: "윤정호", number: 1 },
      lines: [
        // DF (3)
        [
          { name: "김기태", number: 4 },
          { name: "세바스티안 🇨🇱", number: 5 },
          { name: "오준영", number: 3 },
        ],
        // MF (4)
        [
          { name: "이도형", number: 2 }, // RM
          { name: "박정수", number: 6 }, // CM
          { name: "윤도하", number: 8 }, // CM
          { name: "김시윤", number: 7 }, // LM
        ],
        // CAM (2)
        [
          { name: "하승민", number: 10 },
          { name: "후안 로페즈 🇪🇸", number: 11 },
        ],
        // FW (1)
        [
          { name: "김도윤", number: 9 },
        ],
      ],
    },

    season: {
      rank: 5,
      wins: 15,
      draws: 8,
      losses: 7,
      gf: 46,
      ga: 30,
      pts: 53,
    },

    recent: [
      { date: "2025-10-12", opponent: "엘리펀트 FC", homeAway: "H", result: "W", score: "3-1" },
      { date: "2025-10-05", opponent: "라쿤 FC", homeAway: "A", result: "D", score: "1-1" },
      { date: "2025-09-28", opponent: "두꺼비 FC", homeAway: "A", result: "W", score: "3-0" },
      { date: "2025-09-20", opponent: "스네이크 FC", homeAway: "H", result: "L", score: "1-2" },
    ],
  },

  toad: {
    id: "toad",
    name: "두꺼비 FC",
    region: "대구",
    stadium: "두꺼비 스타디움",
    coach: "한재욱 🇰🇷",
    formation: "4-5-1 (수비형)",
    kit: { jersey: "#7a6042", trim: "#9da174" },

    players: {
      gk: { name: "이찬민", number: 1 },
      lines: [
        // DF (4)
        [
          { name: "윤상우", number: 2 },           // RB
          { name: "김주호", number: 5 },           // CB
          { name: "파블로 가르시아 🇦🇷", number: 6 }, // CB
          { name: "박도현", number: 3 },           // LB
        ],
        // MF (5) → RM, CM, CM, CM, LM
        [
          { name: "유승민", number: 11 },  // RM
          { name: "최성훈", number: 14 },  // CM
          { name: "정하늘", number: 8 },   // CM
          { name: "이민호", number: 10 },  // CM
          { name: "김동윤", number: 7 },   // LM
        ],
        // FW (1)
        [
          { name: "알렉스 하비 🇬🇧", number: 9 }, // ST
        ],
      ],
    },

    season: {
      rank: 10,
      wins: 8,
      draws: 10,
      losses: 12,
      gf: 30,
      ga: 41,
      pts: 34,
    },

    recent: [
      { date: "2025-10-11", opponent: "개미 FC", homeAway: "A", result: "W", score: "2-0" },
      { date: "2025-10-06", opponent: "문어 FC", homeAway: "H", result: "L", score: "1-3" },
      { date: "2025-09-28", opponent: "까마귀 FC", homeAway: "A", result: "D", score: "0-0" },
      { date: "2025-09-21", opponent: "흰수염 FC", homeAway: "H", result: "L", score: "0-1" },
    ],
  },
};
