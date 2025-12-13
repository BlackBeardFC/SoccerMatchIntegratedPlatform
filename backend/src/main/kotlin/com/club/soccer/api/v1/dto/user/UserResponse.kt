package com.club.soccer.api.v1.dto.user

import com.club.soccer.domain.user.UserEntity
import java.time.LocalDate
import java.time.LocalDateTime

data class UserResponse(
    val id: Long,
    val loginId: String,
    val email: String,
    val name: String,
    val nickname: String,
    val phone: String?,
    val birthDate: LocalDate?,
    val profileImageUrl: String?,
    val favoriteClubId: Long?,
    val notifyReservationDone: Boolean,
    val notifyRecommendMatch: Boolean,
    val notifyPromotion: Boolean,
    val role: String,
    val status: String,
    val createdAt: LocalDateTime,
) {
    companion object {
        fun from(entity: UserEntity): UserResponse =
            UserResponse(
                id = entity.id,
                loginId = entity.loginId,
                email = entity.email,
                name = entity.name,
                nickname = entity.nickname,
                phone = entity.phone,
                birthDate = entity.birthDate,
                profileImageUrl = entity.profileImageUrl,
                favoriteClubId = entity.favoriteClubId,
                notifyReservationDone = entity.notifyReservationDone,
                notifyRecommendMatch = entity.notifyRecommendMatch,
                notifyPromotion = entity.notifyPromotion,
                role = entity.role,
                status = entity.status,
                createdAt = entity.createdAt,
            )
    }
}
