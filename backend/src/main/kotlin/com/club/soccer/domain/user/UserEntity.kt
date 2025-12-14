package com.club.soccer.domain.user

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class UserEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    // 로그인용 아이디 (qwerty3495)
    @Column(name = "login_id", nullable = false, unique = true, length = 50)
    val loginId: String,

    // 이메일
    @Column(nullable = false, unique = true, length = 255)
    val email: String,

    // 비밀번호 (나중에 해시로 저장)
    @Column(nullable = false, length = 255)
    var password: String,

    // 이름
    @Column(nullable = false, length = 50)
    var name: String,

    // 닉네임
    @Column(nullable = false, length = 50)
    var nickname: String,

    // 전화번호
    @Column(length = 20)
    var phone: String? = null,

    // 생년월일
    @Column(name = "birth_date")
    var birthDate: LocalDate? = null,

    // 프로필 이미지
    @Column(name = "profile_image_url", length = 500)
    var profileImageUrl: String? = null,

    // 응원팀 (선택)
    @Column(name = "favorite_club_id")
    var favoriteClubId: Long? = null,

    // 알림 설정
    @Column(name = "notify_reservation_done", nullable = false)
    var notifyReservationDone: Boolean = true,

    @Column(name = "notify_recommend_match", nullable = false)
    var notifyRecommendMatch: Boolean = true,

    @Column(name = "notify_promotion", nullable = false)
    var notifyPromotion: Boolean = true,

    // 권한/상태
    @Column(nullable = false, length = 20)
    var role: String = "USER",

    @Column(nullable = false, length = 20)
    var status: String = "ACTIVE",

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
)
