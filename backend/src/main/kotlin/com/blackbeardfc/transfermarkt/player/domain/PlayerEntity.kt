package com.blackbeardfc.transfermarkt.player.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "players")
class PlayerEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")                    // ★ player_id 매핑
    val id: Long? = null,

    // 우리 리그 12개 팀 id (1~12 가정)
    @Column(name = "team_id", nullable = false)    // ★ team_id 매핑
    val teamId: Long,

    @Column(name = "name", nullable = false, length = 50)
    val name: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "position", nullable = false, length = 10)
    val position: PlayerPosition,

    // 등번호 (팀 내에서만 유니크)
    @Column(name = "back_number", nullable = false)   // ★ back_number 매핑
    val backNumber: Int,

    @Column(name = "age", nullable = false)
    val age: Int,

    @Column(name = "height", nullable = false)    // cm
    val height: Int,

    @Column(name = "weight", nullable = false)    // kg
    val weight: Int,

    @Column(name = "nationality", nullable = false, length = 30)
    val nationality: String,

    @Column(name = "preferred_foot", nullable = false, length = 10) // "Left", "Right", "Both"
    val preferredFoot: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
