package com.club.soccer.api.v1.club

import com.club.soccer.domain.club.ClubEntity

data class ClubSummaryResponse(
    val id: Long,
    val name: String,
    val logoUrl: String?,
    val shortDescription: String?
)

data class ClubDetailResponse(
    val id: Long,
    val name: String,
    val logoUrl: String?,
    val shortDescription: String?,
    val city: String?
)

fun ClubEntity.toSummaryDto(): ClubSummaryResponse =
    ClubSummaryResponse(
        id = this.id ?: 0L,
        name = this.name,
        logoUrl = this.logoUrl,
        shortDescription = this.shortDescription
    )

fun ClubEntity.toDetailDto(): ClubDetailResponse =
    ClubDetailResponse(
        id = this.id ?: 0L,
        name = this.name,
        logoUrl = this.logoUrl,
        shortDescription = this.shortDescription,
        city = this.city
    )
