package com.club.soccer.service.auth

import com.club.soccer.api.v1.dto.auth.LoginRequest
import com.club.soccer.api.v1.dto.auth.LoginResponse
import com.club.soccer.api.v1.dto.auth.SignupRequest
import com.club.soccer.api.v1.dto.user.UserResponse
import com.club.soccer.config.jwt.JwtTokenProvider
import com.club.soccer.domain.user.UserEntity
import com.club.soccer.domain.user.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
) {

    @Transactional
    fun signup(request: SignupRequest): LoginResponse {
        if (userRepository.existsByLoginId(request.loginId)) {
            throw IllegalArgumentException("이미 사용 중인 아이디입니다.")
        }
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("이미 사용 중인 이메일입니다.")
        }

        val user = UserEntity(
            loginId = request.loginId,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            name = request.name,
            nickname = request.nickname,
            phone = request.phone,
            birthDate = request.birthDate,
            profileImageUrl = null,
            favoriteClubId = null,
            notifyReservationDone = true,
            notifyRecommendMatch = true,
            notifyPromotion = true,
        )

        val saved = userRepository.save(user)
        val token = jwtTokenProvider.createToken(saved.id, saved.loginId, saved.role)

        return LoginResponse(
            token = token,
            user = UserResponse.from(saved),
        )
    }

    fun login(request: LoginRequest): LoginResponse {
        val user = userRepository.findByLoginId(request.loginId)
            ?: throw IllegalArgumentException("아이디 또는 비밀번호가 잘못되었습니다.")

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw IllegalArgumentException("아이디 또는 비밀번호가 잘못되었습니다.")
        }

        val token = jwtTokenProvider.createToken(user.id, user.loginId, user.role)

        return LoginResponse(
            token = token,
            user = UserResponse.from(user),
        )
    }
}
