package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(
    name = "stadiums",
    uniqueConstraints = [UniqueConstraint(columnNames = ["name"])]
)
class Stadium(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stadium_id")
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    var address: String? = null,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
