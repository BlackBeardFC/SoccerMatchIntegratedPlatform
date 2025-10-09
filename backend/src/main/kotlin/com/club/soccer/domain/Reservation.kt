package com.club.soccer.domain

import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.OffsetDateTime

@Entity
@Table(name = "reservations")
class Reservation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    var member: Member,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    var match: Match,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "reservation_status")
    @Type(value = PostgreSQLEnumType::class)
    var status: ReservationStatus = ReservationStatus.PENDING,

    @Column(name = "hold_expires_at")
    var holdExpiresAt: OffsetDateTime? = null,

    @Column(name = "total_amount", nullable = false)
    var totalAmount: Long = 0,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null,

    // 예매 항목(좌석별)
    @OneToMany(mappedBy = "reservation", cascade = [CascadeType.ALL], orphanRemoval = true)
    var items: MutableList<ReservationItem> = mutableListOf()
) : Auditable
