package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(
    name = "teams",
    uniqueConstraints = [UniqueConstraint(columnNames = ["name"])]
)
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    var name: String,

    var city: String? = null,

    @Column(name = "logo_url")
    var logoUrl: String? = null,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
