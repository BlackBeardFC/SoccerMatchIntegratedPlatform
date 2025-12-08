package com.club.soccer.api.v1.match

import com.club.soccer.domain.match.MatchJpaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class MatchQueryService(
    private val matchRepository: MatchJpaRepository
) {

    @Transactional(readOnly = true)
    fun getUpcomingMatches(
        dateFrom: LocalDate?,
        dateTo: LocalDate?
    ): List<MatchSummaryResponse> {
        val fromDateTime = (dateFrom ?: LocalDate.now()).atStartOfDay()
        val toDateTime: LocalDateTime? = dateTo?.atTime(LocalTime.MAX)

        return matchRepository.findUpcomingMatches(fromDateTime, toDateTime)
            .map { it.toSummaryDto() }
    }

    @Transactional(readOnly = true)
    fun getMatchDetail(matchId: Long): MatchDetailResponse {
        val match = matchRepository.findById(matchId)
            .orElseThrow { IllegalArgumentException("Match not found: $matchId") }

        // 연관 엔티티 초기화용(지연 로딩일 때 안전)
        match.homeClub.name
        match.awayClub.name

        return match.toDetailDto()
    }
}
