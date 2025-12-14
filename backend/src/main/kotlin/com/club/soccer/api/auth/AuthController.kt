package com.club.soccer.api.auth

import com.club.soccer.api.v1.dto.auth.LoginRequest
import com.club.soccer.api.v1.dto.auth.LoginResponse
import com.club.soccer.api.v1.dto.auth.SignupRequest
import com.club.soccer.service.auth.AuthService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {

    @PostMapping("/signup")
    fun signup(@RequestBody request: SignupRequest): LoginResponse =
        authService.signup(request)

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): LoginResponse =
        authService.login(request)

}