package com.club.soccer.api.v1.club

import com.club.soccer.domain.club.ClubRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ClubQueryService(
    private val clubRepository: ClubRepository
) {

    @Transactional(readOnly = true)
    fun getClubs(): List<ClubSummaryResponse> {
        return clubRepository.findAll()
            .map { it.toSummaryDto() }
    }

    @Transactional(readOnly = true)
    fun getClubDetail(clubId: Long): ClubDetailResponse {
        val club = clubRepository.findById(clubId)
            .orElseThrow { IllegalArgumentException("Club not found: $clubId") }

        return club.toDetailDto()
    }
}
