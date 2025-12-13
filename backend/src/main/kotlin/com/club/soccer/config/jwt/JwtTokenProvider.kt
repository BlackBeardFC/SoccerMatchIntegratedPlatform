package com.club.soccer.config.jwt

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date

@Component
class JwtTokenProvider {

    // 과제용 하드코딩 secret (실서비스면 환경변수/설정파일로)
    private val secret = "this-is-very-secret-key-for-jwt-should-be-long"
    private val algorithm: Algorithm = Algorithm.HMAC256(secret)

    // 토큰 유효기간: 1일D
    private val validityInDays: Long = 1L

    fun createToken(userId: Long, loginId: String, role: String): String {
        val now = Instant.now()
        val expiresAt = now.plus(validityInDays, ChronoUnit.DAYS)

        return JWT.create()
            .withSubject(userId.toString())
            .withClaim("loginId", loginId)
            .withClaim("role", role)
            .withIssuedAt(Date.from(now))
            .withExpiresAt(Date.from(expiresAt))
            .sign(algorithm)
    }

    fun getUserId(token: String): Long {
        val verifier = JWT.require(algorithm).build()
        val decoded = verifier.verify(token)
        return decoded.subject.toLong()
    }
}
