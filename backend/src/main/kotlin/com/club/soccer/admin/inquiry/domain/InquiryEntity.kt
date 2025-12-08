package com.club.soccer.admin.inquiry.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "inquiries")
class InquiryEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    // 실제 유저 테이블과 FK로 묶어도 되는데,
    // 일단은 id + 닉네임/이메일 스냅샷으로만 사용
    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(name = "user_nickname", nullable = false, length = 50)
    val userNickname: String,

    @Column(name = "user_email", length = 100)
    val userEmail: String? = null,

    @Column(nullable = false, length = 100)
    var title: String,

    @Column(nullable = false, columnDefinition = "text")
    var content: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    var status: InquiryStatus = InquiryStatus.WAITING,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "answered_at")
    var answeredAt: LocalDateTime? = null,

    @Column(columnDefinition = "text")
    var answer: String? = null,
)
