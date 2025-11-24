package com.club.soccer.api.v1.dto

data class AdminTeamReq(
    val name: String,
    val city: String?,
    //val tier: String? // seat_tier enum 문자열 (예: "A", "B")
)

data class AdminStadiumReq(
    val name: String,
    val address: String?
)

data class AdminMatchReq(
    val stadiumId: Long,
    val homeTeamId: Long,
    val awayTeamId: Long,
    val startAt: String // ISO-8601 문자열
)

data class AdminMatchUpdateReq(
    val startAt: String?,
    val status: String?,    // "SCHEDULED", "FINISHED" 등
    val homeScore: Int?,
    val awayScore: Int?
)
