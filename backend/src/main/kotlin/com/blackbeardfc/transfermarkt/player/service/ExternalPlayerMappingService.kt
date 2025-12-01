package com.blackbeardfc.transfermarkt.player.service

import com.blackbeardfc.transfermarkt.externalplayer.domain.ExternalPlayerRepository
import com.blackbeardfc.transfermarkt.player.domain.PlayerEntity
import com.blackbeardfc.transfermarkt.player.domain.PlayerPosition
import com.blackbeardfc.transfermarkt.player.domain.PlayerRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.random.Random

@Service
class ExternalPlayerMappingService(
    private val externalPlayerRepository: ExternalPlayerRepository,
    private val playerRepository: PlayerRepository
) {

    private val rnd = Random(System.currentTimeMillis())

    // 팀 개수
    private val TEAM_COUNT = 12

    // 팀당 포지션 구성
    private val SQUAD_GK = 3
    private val SQUAD_DF = 8
    private val SQUAD_MF = 8
    private val SQUAD_FW = 6

    // external_players의 position 문자열을 PlayerPosition enum으로 매핑
    private fun mapPosition(pos: String?): PlayerPosition {
        if (pos == null) return PlayerPosition.MF

        return when {
            pos.contains("Keeper", true) -> PlayerPosition.GK
            pos.contains("Goalkeeper", true) -> PlayerPosition.GK
            pos.contains("Defender", true) -> PlayerPosition.DF
            pos.contains("Midfielder", true) -> PlayerPosition.MF
            pos.contains("Striker", true) -> PlayerPosition.FW
            pos.contains("Forward", true) -> PlayerPosition.FW
            else -> PlayerPosition.MF
        }
    }

    private fun nextBackNumber(used: MutableSet<Int>): Int {
        while (true) {
            val num = rnd.nextInt(1, 100)
            if (used.add(num)) return num
        }
    }

    /**
     * external_players → 12팀 자동 구성
     */
    fun generateVirtualLeague() {
        val totalRequired = TEAM_COUNT * (SQUAD_GK + SQUAD_DF + SQUAD_MF + SQUAD_FW)

        val ext = externalPlayerRepository.findAll()

        if (ext.size < totalRequired) {
            throw IllegalStateException(
                "external_players 수가 부족합니다. 필요: $totalRequired, 현재: ${ext.size}"
            )
        }

        println("[Mapping] external_players ${ext.size}명 중 ${totalRequired}명을 사용하여 12팀 구성 시작")

        // 포지션별 리스트
        val gkList = ext.filter { mapPosition(it.position) == PlayerPosition.GK }.toMutableList()
        val dfList = ext.filter { mapPosition(it.position) == PlayerPosition.DF }.toMutableList()
        val mfList = ext.filter { mapPosition(it.position) == PlayerPosition.MF }.toMutableList()
        val fwList = ext.filter { mapPosition(it.position) == PlayerPosition.FW }.toMutableList()

        // 랜덤 섞기
        gkList.shuffle()
        dfList.shuffle()
        mfList.shuffle()
        fwList.shuffle()

        val result = mutableListOf<PlayerEntity>()

        for (teamId in 1L..TEAM_COUNT.toLong()) {

            val usedNumbers = mutableSetOf<Int>()

            fun createPlayerFrom(extPlayer: com.blackbeardfc.transfermarkt.externalplayer.domain.ExternalPlayerEntity,
                                 pos: PlayerPosition): PlayerEntity {

                val backNum = nextBackNumber(usedNumbers)

                return PlayerEntity(
                    teamId = teamId,
                    name = extPlayer.name,
                    position = pos,
                    backNumber = backNum,
                    age = extPlayer.age ?: 25,
                    height = extPlayer.height ?: 178,
                    weight = extPlayer.weight ?: 72,
                    nationality = extPlayer.nationality ?: "Unknown",
                    preferredFoot = "Right",          // Transfermarkt 상세정보에 있을 수도 있지만 여기선 기본값
                    createdAt = LocalDateTime.now()
                )
            }

            // GK
            repeat(SQUAD_GK) {
                val p = gkList.removeFirst()
                result += createPlayerFrom(p, PlayerPosition.GK)
            }

            // DF
            repeat(SQUAD_DF) {
                val p = dfList.removeFirst()
                result += createPlayerFrom(p, PlayerPosition.DF)
            }

            // MF
            repeat(SQUAD_MF) {
                val p = mfList.removeFirst()
                result += createPlayerFrom(p, PlayerPosition.MF)
            }

            // FW
            repeat(SQUAD_FW) {
                val p = fwList.removeFirst()
                result += createPlayerFrom(p, PlayerPosition.FW)
            }
        }

        playerRepository.deleteAll()   // 기존 선수 삭제
        playerRepository.saveAll(result)

        println("[Mapping] 12개 팀 생성 완료. 총 ${result.size}명 저장됨.")
    }
}
