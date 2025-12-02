package com.blackbeardfc.transfermarkt.player.domain

import org.springframework.data.jpa.repository.JpaRepository

interface PlayerRepository : JpaRepository<PlayerEntity, Long>