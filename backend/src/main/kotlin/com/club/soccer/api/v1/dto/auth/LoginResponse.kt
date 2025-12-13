package com.club.soccer.api.v1.dto.auth

import com.club.soccer.api.v1.dto.user.UserResponse

data class LoginResponse(
    val token: String,
    val user: UserResponse
)
