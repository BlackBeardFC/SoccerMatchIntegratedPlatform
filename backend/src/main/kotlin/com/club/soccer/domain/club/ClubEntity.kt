package com.club.soccer.domain.club

import jakarta.persistence.*

@Entity
@Table(name = "clubs")
class ClubEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 100)
    val name: String,

    @Column(name = "logo_url", length = 255)
    val logoUrl: String? = null,

    @Column(name = "short_description", length = 255)
    val shortDescription: String? = null,

    @Column(length = 100)
    val city: String? = null
)
