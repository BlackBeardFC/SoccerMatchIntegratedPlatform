package com.club.soccer.domain.match

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface MatchJpaRepository : JpaRepository<MatchEntity, Long> {

    @Query(
        """
        select m
        from MatchEntity m
        join fetch m.homeClub hc
        join fetch m.awayClub ac
        where m.startAt >= :from
        and (:to is null or m.startAt <= :to)
        order by m.startAt asc
        """
    )
    fun findUpcomingMatches(
        @Param("from") from: LocalDateTime,
        @Param("to") to: LocalDateTime?
    ): List<MatchEntity>
}
