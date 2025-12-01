package com.blackbeardfc.transfermarkt.player.config

import com.blackbeardfc.transfermarkt.player.service.ExternalPlayerMappingService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class PlayerMappingRunner(
    private val mappingService: ExternalPlayerMappingService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        mappingService.generateVirtualLeague()
    }
}
