package com.club.soccer.domain.club

import org.springframework.data.jpa.repository.JpaRepository

interface ClubRepository : JpaRepository<ClubEntity, Long>
