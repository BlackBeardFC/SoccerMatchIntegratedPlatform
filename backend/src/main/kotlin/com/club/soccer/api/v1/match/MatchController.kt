package com.club.soccer.api.v1.match

import com.club.soccer.api.v1.dto.MatchDto
import com.club.soccer.api.v1.dto.SeatAvailabilityDto
import com.club.soccer.service.MatchService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/matches")
class MatchController(
    private val matchService: MatchService
) {

    @GetMapping
    fun getMatches(
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?
    ): List<MatchDto> =
        matchService.getMatches(from, to)

    @GetMapping("/{id}")
    fun getMatch(@PathVariable id: Long): MatchDto =
        matchService.getMatch(id)

    @GetMapping("/{id}/seats")
    fun getSeats(@PathVariable id: Long): List<SeatAvailabilityDto> =
        matchService.getSeats(id)
}
