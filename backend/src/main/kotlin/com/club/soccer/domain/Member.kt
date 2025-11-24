package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity @Table(name = "members")
class Member(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    val id: Long = 0,

    @Column(nullable = false, unique = true) var email: String,
    @Column(name = "password_hash", nullable = false) var passwordHash: String,
    @Column(nullable = false) var name: String,
    @Column(nullable = false) var role: String = "USER",

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favorite_team_id")
    var favoriteTeam: Team? = null,

    @Column(name="created_at", insertable=false, updatable=false)
    override var createdAt: OffsetDateTime? = null,
    @Column(name="updated_at", insertable=false, updatable=false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
