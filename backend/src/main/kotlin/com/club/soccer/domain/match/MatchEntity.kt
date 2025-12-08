package com.club.soccer.domain.match

import com.club.soccer.domain.club.ClubEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "matches")
class MatchEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    // 홈팀
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    val homeClub: ClubEntity,

    // 원정팀
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    val awayClub: ClubEntity,

    @Column(name = "stadium_name", nullable = false, length = 100)
    val stadiumName: String,

    @Column(name = "start_at", nullable = false)
    val startAt: LocalDateTime,

    @Column(columnDefinition = "text")
    val description: String? = null
)
