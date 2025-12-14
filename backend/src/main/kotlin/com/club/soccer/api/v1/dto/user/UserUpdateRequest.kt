package com.club.soccer.api.v1.dto.user

import java.time.LocalDate

data class UserUpdateRequest(
    val name: String,
    val nickname: String,
    val phone: String?,
    val birthDate: LocalDate?,
    val profileImageUrl: String?,
    val favoriteClubId: Long?,
    val notifyReservationDone: Boolean,
    val notifyRecommendMatch: Boolean,
    val notifyPromotion: Boolean,
)
