package com.blackbeardfc.transfermarkt.player.service

import com.blackbeardfc.transfermarkt.player.domain.PlayerEntity
import com.blackbeardfc.transfermarkt.player.domain.PlayerPosition
import kotlin.random.Random

object PlayerDummyGenerator {

    private val rnd = Random(System.currentTimeMillis())

    // 실제 선수 이름 대충 모아둔 리스트 (예시)
    private val realPlayerNames = listOf(
        // 한국 선수들
        "손흥민", "김민재", "이강인", "황희찬", "황의조", "조규성", "정우영", "김진수", "권창훈", "정승현",
        "홍철", "이재성", "김영권", "박지성", "이청용", "기성용", "구자철", "김신욱",

        // 해외 스타들 (예시)
        "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", "Erling Haaland",
        "Kevin De Bruyne", "Robert Lewandowski", "Neymar", "Mohamed Salah",
        "Virgil van Dijk", "Harry Kane", "Luka Modrić", "Sergio Ramos",
        "Toni Kroos", "Karim Benzema", "Antoine Griezmann", "Luis Suárez",
        "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Pedri", "Gavi"
    )

    /**
     * 지금 단계에서는 '실제 선수 이름' 리스트에서 랜덤으로 하나 뽑아서 사용.
     * (나중에 크롤링 붙이면, 여기서 external_players에서 가져오도록 교체 예정)
     */
    private fun randomName(): String = realPlayerNames.random(rnd)

    private fun randomAge(): Int = rnd.nextInt(18, 36)          // 18~35 (그냥 더미)
    private fun randomHeight(): Int = rnd.nextInt(170, 196)     // 170~195
    private fun randomWeight(): Int = rnd.nextInt(60, 91)       // 60~90
    private fun randomFoot(): String = listOf("Left", "Right", "Both").random(rnd)

    /**
     * 팀 내에서 등번호 중복 방지
     */
    private fun nextBackNumber(used: MutableSet<Int>): Int {
        while (true) {
            val num = rnd.nextInt(1, 100) // 1~99
            if (used.add(num)) return num
        }
    }

    /**
     * teamCount개 팀을 생성하고, 각 팀에 25명 고정 스쿼드 구성
     * (GK 3명 / DF 8명 / MF 8명 / FW 6명)
     */
    fun generateAllTeamsPlayers(
        teamCount: Int = 12
    ): List<PlayerEntity> {

        require(teamCount > 0)

        val result = mutableListOf<PlayerEntity>()

        for (teamId in 1L..teamCount.toLong()) {

            val usedNumbers = mutableSetOf<Int>()

            fun createPlayer(pos: PlayerPosition): PlayerEntity {
                val backNumber = nextBackNumber(usedNumbers)
                return PlayerEntity(
                    teamId = teamId,
                    name = randomName(),          // ✅ 이제 실제 선수 이름에서 랜덤으로 선택
                    position = pos,
                    backNumber = backNumber,
                    age = randomAge(),
                    height = randomHeight(),
                    weight = randomWeight(),
                    nationality = "Korea",        // 일단 더미 (추후 크롤링 데이터로 교체 가능)
                    preferredFoot = randomFoot()
                )
            }

            // 비율에 따라 정확히 25명 생성 (총 12팀 = 300명)
            repeat(3) { result += createPlayer(PlayerPosition.GK) }
            repeat(8) { result += createPlayer(PlayerPosition.DF) }
            repeat(8) { result += createPlayer(PlayerPosition.MF) }
            repeat(6) { result += createPlayer(PlayerPosition.FW) }
        }

        return result
    }
}
