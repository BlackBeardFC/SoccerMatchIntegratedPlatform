package com.club.soccer.api.v1.dto.auth

data class LoginRequest(
    val loginId: String,
    val password: String
)
