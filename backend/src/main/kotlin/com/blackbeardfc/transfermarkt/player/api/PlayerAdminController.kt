package com.blackbeardfc.transfermarkt.player.api

import com.blackbeardfc.transfermarkt.player.service.PlayerCrawlService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class PlayerAdminController(
    private val playerCrawlService: PlayerCrawlService
) {

    @GetMapping("/api/admin/players/crawl")
    fun crawlPlayers(
        @RequestParam(defaultValue = "1") startPage: Int,
        @RequestParam(defaultValue = "2") endPage: Int
    ): Map<String, Any> {
        val saved = playerCrawlService.crawlAndSaveTopPlayers(startPage, endPage)
        return mapOf(
            "count" to saved.size,
            "message" to "크롤링 완료 및 저장 완료"
        )
    }
}