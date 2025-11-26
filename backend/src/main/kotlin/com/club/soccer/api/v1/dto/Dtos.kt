package com.club.soccer.api.v1.dto

import com.club.soccer.domain.Match
import com.club.soccer.domain.SeatAvailabilityProjection

data class MatchDto(
    val matchId: Long,
    val stadiumId: Long,
    val homeTeamId: Long,
    val awayTeamId: Long,
    val startAt: String,
    val status: String,
    val homeScore: Int,
    val awayScore: Int
) {
    companion object {
        fun from(m: Match) = MatchDto(
            matchId = m.id,
            stadiumId = m.stadium.id,
            homeTeamId = m.homeTeam.id,
            awayTeamId = m.awayTeam.id,
            startAt = m.startAt.toString(),
            status = m.status.name,
            homeScore = m.homeScore,
            awayScore = m.awayScore
        )
    }
}

data class SeatAvailabilityDto(
    val seatId: Long,
    val locked: Boolean,
    val section: String,
    val row: String,
    val col: String,
    val basePrice: Int
) {
    companion object {
        fun from(p: SeatAvailabilityProjection) = SeatAvailabilityDto(
            seatId = p.getSeatId(),
            locked = p.getLocked(),
            section = p.getSectionName(),
            row = p.getRowNo(),
            col = p.getColNo(),
            basePrice = p.getBasePrice()
        )
    }
}

data class HoldResp(val reservationId: Long, val holdExpiresAt: String)
data class ConfirmResp(val paymentId: Long, val status: String, val amount: Long?, val reservationStatus: String)
