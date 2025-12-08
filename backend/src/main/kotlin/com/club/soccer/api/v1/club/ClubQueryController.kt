package com.club.soccer.api.v1.club

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/clubs")
class ClubQueryController(
    private val clubQueryService: ClubQueryService
) {

    @GetMapping
    fun getClubs(): List<ClubSummaryResponse> {
        return clubQueryService.getClubs()
    }

    @GetMapping("/{clubId}")
    fun getClubDetail(
        @PathVariable clubId: Long
    ): ClubDetailResponse {
        return clubQueryService.getClubDetail(clubId)
    }
}
