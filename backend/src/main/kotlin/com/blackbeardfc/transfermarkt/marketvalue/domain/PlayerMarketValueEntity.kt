package com.blackbeardfc.transfermarkt.marketvalue.domain

import jakarta.persistence.*

@Entity
@Table(name = "player_market_values")
class PlayerMarketValueEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val rankNumber: Int,

    @Column(nullable = false, length = 50)
    val name: String,

    @Column(nullable = false, length = 50)
    val position: String,

    @Column(nullable = false)
    val age: Int,

    @Column(nullable = false, length = 50)
    val nation: String,

    @Column(nullable = false, length = 50)
    val team: String,

    @Column(nullable = false, length = 20)
    val marketValueText: String,

    @Column(nullable = true)
    val marketValueEuro: Long? = null          // 숫자로도 저장하고 싶을 때

)
