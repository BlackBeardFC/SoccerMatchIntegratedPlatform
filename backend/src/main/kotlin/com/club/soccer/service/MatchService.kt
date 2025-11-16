package com.club.soccer.service

import com.club.soccer.api.v1.dto.MatchDto
import com.club.soccer.api.v1.dto.SeatAvailabilityDto
import com.club.soccer.domain.AvailabilityRepository
import com.club.soccer.domain.MatchRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime

@Service
class MatchService(
    private val matchRepository: MatchRepository,
    private val availabilityRepository: AvailabilityRepository
) {

    @Transactional(readOnly = true)
    fun getMatches(from: String?, to: String?): List<MatchDto> {
        val now = OffsetDateTime.now()

        fun parseOrNull(s: String?) =
            s?.let { runCatching { OffsetDateTime.parse(it) }.getOrNull() }

        val start = parseOrNull(from) ?: now.minusMonths(6)
        val end   = parseOrNull(to)   ?: now.plusYears(1)

        val rows = matchRepository.findBetweenSimple(start, end)
        return rows.map { r ->
            MatchDto(
                matchId    = r.getMatchId(),
                stadiumId  = r.getStadiumId(),
                homeTeamId = r.getHomeTeamId(),
                awayTeamId = r.getAwayTeamId(),
                startAt    = r.getStartAt().toString(),
                status     = r.getStatus(),
                homeScore  = r.getHomeScore(),
                awayScore  = r.getAwayScore()
            )
        }
    }

    @Transactional(readOnly = true)
    fun getMatch(id: Long): MatchDto {
        val r = matchRepository.findOneSimple(id)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "경기($id)를 찾을 수 없습니다."
            )

        return MatchDto(
            matchId    = r.getMatchId(),
            stadiumId  = r.getStadiumId(),
            homeTeamId = r.getHomeTeamId(),
            awayTeamId = r.getAwayTeamId(),
            startAt    = r.getStartAt().toString(),
            status     = r.getStatus(),
            homeScore  = r.getHomeScore(),
            awayScore  = r.getAwayScore()
        )
    }

    @Transactional(readOnly = true)
    fun getSeats(matchId: Long): List<SeatAvailabilityDto> =
        availabilityRepository.findAvailability(matchId)
            .map(SeatAvailabilityDto::from)
}
