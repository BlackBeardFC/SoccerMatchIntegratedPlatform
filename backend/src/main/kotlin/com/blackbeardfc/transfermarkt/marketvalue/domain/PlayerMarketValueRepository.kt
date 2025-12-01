package com.blackbeardfc.transfermarkt.marketvalue.domain

import org.springframework.data.jpa.repository.JpaRepository

interface PlayerMarketValueRepository :
    JpaRepository<PlayerMarketValueEntity, Long>
