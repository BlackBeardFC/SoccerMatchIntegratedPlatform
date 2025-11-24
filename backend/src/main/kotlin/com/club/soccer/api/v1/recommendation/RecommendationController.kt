package com.club.soccer.api.v1.recommendation

import com.club.soccer.api.v1.dto.MatchDto
import com.club.soccer.service.RecommendationService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/recommendations")
class RecommendationController(
    private val recommendationService: RecommendationService
) {

    /**
     * 예: GET /api/recommendations?memberId=1
     */
    @GetMapping
    fun getRecommendations(
        @RequestParam memberId: Long
    ): List<MatchDto> =
        recommendationService.getRecommendedMatches(memberId)
}
