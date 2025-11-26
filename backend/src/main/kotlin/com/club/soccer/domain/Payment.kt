package com.club.soccer.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
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
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "status", nullable = false)
    @ColumnTransformer(read = "status::text", write = "?::payment_status")
    var status: PaymentStatus = PaymentStatus.PENDING,

    var method: String? = null,
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
