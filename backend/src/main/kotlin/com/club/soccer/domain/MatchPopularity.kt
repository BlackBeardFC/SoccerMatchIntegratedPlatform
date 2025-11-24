package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "match_popularity")
class MatchPopularity(

    @Id
    @Column(name = "match_id")
    val matchId: Long,

    @Column(name = "view_count", nullable = false)
    var viewCount: Long = 0,

    @Column(name = "reservation_count", nullable = false)
    var reservationCount: Long = 0,

    @Column(name = "last_viewed_at")
    var lastViewedAt: OffsetDateTime? = null
)
