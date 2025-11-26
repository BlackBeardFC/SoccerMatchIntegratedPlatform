package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(
    name = "sections",
    uniqueConstraints = [UniqueConstraint(columnNames = ["stadium_id", "name"])]
)
class Section(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stadium_id", nullable = false)
    var stadium: Stadium,

    @Column(nullable = false)
    var name: String,

    @Column(name = "base_price", nullable = false)
    var basePrice: Int,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
