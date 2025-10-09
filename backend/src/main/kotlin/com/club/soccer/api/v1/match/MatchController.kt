package com.club.soccer.api.v1.match

import com.club.soccer.api.v1.dto.MatchDto
import com.club.soccer.api.v1.dto.SeatAvailabilityDto
import com.club.soccer.domain.AvailabilityRepository
import com.club.soccer.domain.MatchRepository
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.OffsetDateTime

@RestController
@RequestMapping("/api/matches")
class MatchController(
    private val matchRepository: MatchRepository,
    private val availabilityRepository: AvailabilityRepository
) {
    @GetMapping
    @Transactional(readOnly = true)
    fun getMatches(
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?
    ): List<MatchDto> {
        val now = OffsetDateTime.now()
        fun parseOrNull(s: String?) = s?.let { runCatching { OffsetDateTime.parse(it) }.getOrNull() }
        val start = parseOrNull(from) ?: now.minusMonths(6)
        val end   = parseOrNull(to)   ?: now.plusYears(1)

        val rows = matchRepository.findBetweenSimple(start, end)
        return rows.map { r ->
            MatchDto(
                matchId   = r.getMatchId(),
                stadiumId = r.getStadiumId(),
                homeTeamId= r.getHomeTeamId(),
                awayTeamId= r.getAwayTeamId(),
                startAt   = r.getStartAt().toString(),
                status    = r.getStatus(),
                homeScore = r.getHomeScore(),
                awayScore = r.getAwayScore()
            )
        }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    fun getMatch(@PathVariable id: Long): MatchDto {
        val r = matchRepository.findOneSimple(id) ?: throw IllegalArgumentException("경기($id) 없음")
        return MatchDto(
            matchId   = r.getMatchId(),
            stadiumId = r.getStadiumId(),
            homeTeamId= r.getHomeTeamId(),
            awayTeamId= r.getAwayTeamId(),
            startAt   = r.getStartAt().toString(),
            status    = r.getStatus(),
            homeScore = r.getHomeScore(),
            awayScore = r.getAwayScore()
        )
    }

    @GetMapping("/{id}/seats")
    @Transactional(readOnly = true)
    fun getSeats(@PathVariable id: Long): List<SeatAvailabilityDto> =
        availabilityRepository.findAvailability(id).map(SeatAvailabilityDto::from)
}
