package com.club.soccer.service.user

import com.club.soccer.api.v1.dto.user.UserUpdateRequest
import com.club.soccer.domain.user.UserEntity
import com.club.soccer.domain.user.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(
    private val userRepository: UserRepository,
) {

    fun getUserById(id: Long): UserEntity =
        userRepository.findById(id)
            .orElseThrow { NoSuchElementException("존재하지 않는 사용자입니다. id=$id") }

    @Transactional
    fun updateUser(id: Long, request: UserUpdateRequest): UserEntity {
        val user = getUserById(id)

        user.name = request.name
        user.nickname = request.nickname
        user.phone = request.phone
        user.birthDate = request.birthDate
        user.profileImageUrl = request.profileImageUrl
        user.favoriteClubId = request.favoriteClubId
        user.notifyReservationDone = request.notifyReservationDone
        user.notifyRecommendMatch = request.notifyRecommendMatch
        user.notifyPromotion = request.notifyPromotion
        user.updatedAt = LocalDateTime.now()

        return user
    }
}
