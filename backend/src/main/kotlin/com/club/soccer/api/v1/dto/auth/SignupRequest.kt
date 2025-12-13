package com.club.soccer.api.v1.dto.auth

import java.time.LocalDate

data class SignupRequest(
    val loginId: String,
    val email: String,
    val password: String,
    val name: String,
    val nickname: String,
    val phone: String?,
    val birthDate: LocalDate?
)
