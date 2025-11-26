package com.club.soccer.domain

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime

@Entity
@Table(name = "matches")
class Match(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stadium_id", nullable = false)
    var stadium: Stadium,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    var homeTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    var awayTeam: Team,

    @Column(name = "start_at", nullable = false)
    var startAt: OffsetDateTime,

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "status", nullable = false)
    @ColumnTransformer(read = "status::text", write = "?::match_status")
    var status: MatchStatus = MatchStatus.SCHEDULED,

    @Column(name = "home_score", nullable = false)
    var homeScore: Int = 0,

    @Column(name = "away_score", nullable = false)
    var awayScore: Int = 0,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
