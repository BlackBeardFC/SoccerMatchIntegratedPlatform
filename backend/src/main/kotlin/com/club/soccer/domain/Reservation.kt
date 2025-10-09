package com.club.soccer.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
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

    // Hibernate 쪽엔 "문자열"로 전달 (VARCHAR)
    // 읽을 때는 status::text 로 받고, 쓸 때는 ?::reservation_status 로 캐스팅
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "status", nullable = false)
    @ColumnTransformer(read = "status::text", write = "?::reservation_status")
    var status: ReservationStatus = ReservationStatus.PENDING,

    @Column(name = "hold_expires_at")
    var holdExpiresAt: OffsetDateTime? = null,

    @Column(name = "total_amount", nullable = false)
    var totalAmount: Long = 0,

    @Column(name = "created_at", insertable = false, updatable = false)
    override var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    override var updatedAt: OffsetDateTime? = null,

    @OneToMany(mappedBy = "reservation", cascade = [CascadeType.ALL], orphanRemoval = true)
    var items: MutableList<ReservationItem> = mutableListOf()
) : Auditable
