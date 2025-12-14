package com.club.soccer.domain.user

import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserEntity, Long> {

    fun findByLoginId(loginId: String): UserEntity?

    fun existsByLoginId(loginId: String): Boolean

    fun existsByEmail(email: String): Boolean
}
