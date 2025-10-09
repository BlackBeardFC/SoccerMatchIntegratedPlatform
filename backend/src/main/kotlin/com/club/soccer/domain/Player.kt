package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(
    name = "players",
    uniqueConstraints = [UniqueConstraint(columnNames = ["team_id", "number"])]
)
class Player(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    var team: Team,

    @Column(nullable = false)
    var name: String,

    var position: String? = null,

    var number: Int? = null,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
