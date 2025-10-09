package com.club.soccer.domain

import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.OffsetDateTime

@Entity
@Table(name = "payments")
class Payment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    var reservation: Reservation,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "payment_status")
    @Type(value = PostgreSQLEnumType::class)
    var status: PaymentStatus = PaymentStatus.PENDING,

    @Column
    var method: String? = null,              // 예: KAKAO_PAY, CARD 등 (자유 텍스트)

    @Column
    var amount: Long? = null,

    @Column(name = "paid_at")
    var paidAt: OffsetDateTime? = null,

    @Column(name = "pg_tx_id")
    var pgTxId: String? = null,

    @Column(name = "created_at", insertable = false, updatable = false)
    var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", insertable = false, updatable = false)
    var updatedAt: OffsetDateTime? = null
)
