package com.blackbeardfc.transfermarkt.player.config

import com.blackbeardfc.transfermarkt.player.domain.PlayerRepository
import com.blackbeardfc.transfermarkt.player.service.PlayerDummyGenerator
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class PlayerSeedRunner(
    private val playerRepository: PlayerRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        val count = playerRepository.count()
        if (count > 0) {
            println("[PlayerSeedRunner] players already exist ($count), skip seeding.")
            return
        }

        val players = PlayerDummyGenerator.generateAllTeamsPlayers(
            teamCount = 12
        )

        playerRepository.saveAll(players)
        println("[PlayerSeedRunner] seeded ${players.size} players.")
    }
}