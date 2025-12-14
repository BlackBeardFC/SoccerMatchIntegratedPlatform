package com.club.soccer.config.jwt

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date

@Component
class JwtProvider {

    private val secret = "this-is-very-secret-key-for-jwt-should-be-long"
    private val algorithm: Algorithm = Algorithm.HMAC256(secret)
    private val validityDays: Long = 1L

    fun createToken(userId: Long): String {
        val now = Instant.now()
        val exp = now.plus(validityDays, ChronoUnit.DAYS)

        return JWT.create()
            .withSubject(userId.toString())
            .withIssuedAt(Date.from(now))
            .withExpiresAt(Date.from(exp))
            .sign(algorithm)
    }
}
