package com.club.soccer.domain

import org.springframework.data.jpa.repository.JpaRepository

interface MatchPopularityRepository : JpaRepository<MatchPopularity, Long> {

    fun findByMatchIdIn(matchIds: List<Long>): List<MatchPopularity>
}
