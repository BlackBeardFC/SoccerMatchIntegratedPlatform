package com.club.soccer.api.v1.dto

data class HoldReq(
    val memberId: Long,
    val matchId: Long,
    val seatIds: List<Long>
)

data class ConfirmReq(
    val method: String
)
