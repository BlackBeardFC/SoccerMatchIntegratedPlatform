package com.blackbeardfc.transfermarkt.externalplayer.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "external_players")
class ExternalPlayerEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val externalPlayerId: Long? = null,

    val sourcePlayerId: Long? = null,

    val name: String,
    val position: String?,
    val age: Int?,
    val height: Int?,
    val weight: Int?,
    val nationality: String?,
    val sourceTeam: String?,
    val sourceLeague: String?,

    val detailUrl: String? = null,

    val createdAt: LocalDateTime = LocalDateTime.now()
)
