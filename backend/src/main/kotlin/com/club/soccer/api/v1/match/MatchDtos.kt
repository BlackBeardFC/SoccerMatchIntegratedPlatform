package com.club.soccer.api.v1.match

import com.club.soccer.domain.match.MatchEntity
import java.time.LocalDateTime

data class MatchSummaryResponse(
    val id: Long,
    val homeClubName: String,
    val awayClubName: String,
    val homeClubLogoUrl: String?,
    val awayClubLogoUrl: String?,
    val startAt: LocalDateTime,
    val stadiumName: String
)

data class MatchDetailResponse(
    val id: Long,
    val homeClubName: String,
    val awayClubName: String,
    val homeClubLogoUrl: String?,
    val awayClubLogoUrl: String?,
    val startAt: LocalDateTime,
    val stadiumName: String,
    val description: String?
)

fun MatchEntity.toSummaryDto(): MatchSummaryResponse =
    MatchSummaryResponse(
        id = this.id ?: 0L,
        homeClubName = this.homeClub.name,
        awayClubName = this.awayClub.name,
        homeClubLogoUrl = this.homeClub.logoUrl,
        awayClubLogoUrl = this.awayClub.logoUrl,
        startAt = this.startAt,
        stadiumName = this.stadiumName
    )

fun MatchEntity.toDetailDto(): MatchDetailResponse =
    MatchDetailResponse(
        id = this.id ?: 0L,
        homeClubName = this.homeClub.name,
        awayClubName = this.awayClub.name,
        homeClubLogoUrl = this.homeClub.logoUrl,
        awayClubLogoUrl = this.awayClub.logoUrl,
        startAt = this.startAt,
        stadiumName = this.stadiumName,
        description = this.description
    )
