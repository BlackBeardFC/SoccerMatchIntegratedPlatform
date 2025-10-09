package com.club.soccer.domain

import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(
    name = "seats",
    uniqueConstraints = [UniqueConstraint(columnNames = ["section_id", "row_no", "col_no"])]
)
class Seat(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    var section: Section,

    @Column(name = "row_no", nullable = false)
    var rowNo: String,

    @Column(name = "col_no", nullable = false)
    var colNo: String,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null
) : Auditable
