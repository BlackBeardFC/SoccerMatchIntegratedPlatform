package com.blackbeardfc.transfermarkt.externalplayer.domain

import org.springframework.data.jpa.repository.JpaRepository

interface ExternalPlayerRepository :
    JpaRepository<ExternalPlayerEntity, Long>
