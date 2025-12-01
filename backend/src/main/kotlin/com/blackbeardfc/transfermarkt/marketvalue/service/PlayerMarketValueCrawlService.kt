package com.blackbeardfc.transfermarkt.marketvalue.service

import com.blackbeardfc.transfermarkt.marketvalue.domain.PlayerMarketValueEntity
import com.blackbeardfc.transfermarkt.marketvalue.domain.PlayerMarketValueRepository
import org.jsoup.Jsoup
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PlayerMarketValueCrawlService(
    private val repo: PlayerMarketValueRepository
) {

    private val baseUrl =
        "https://www.transfermarkt.com/marktwertetop/wertvollstespieler?page="

    private val userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"

    @Transactional
    fun crawl(startPage: Int = 1, endPage: Int = 2): List<PlayerMarketValueEntity> {

        val result = mutableListOf<PlayerMarketValueEntity>()

        for (page in startPage..endPage) {
            val url = "$baseUrl$page"

            val doc = Jsoup.connect(url)
                .userAgent(userAgent)
                .timeout(10_000)
                .get()

            val rows = doc.select("tr.odd, tr.even")

            for (row in rows) {
                val tds = row.select("td")
                if (tds.size < 9) continue

                val rankNumber = tds[0].text().trim().toIntOrNull() ?: continue
                val name = tds[3].text().trim()
                val position = tds[4].text().trim()
                val age = tds[5].text().trim().toIntOrNull() ?: 0
                val nation = tds[6].selectFirst("img")?.attr("alt") ?: ""
                val team = tds[7].selectFirst("img")?.attr("alt") ?: ""
                val marketValue = tds[8].text().trim()

                val mvEuro = parseMarketValueToEuro(marketValue)

                val entity = PlayerMarketValueEntity(
                    rankNumber = rankNumber,
                    name = name,
                    position = position,
                    age = age,
                    nation = nation,
                    team = team,
                    marketValueText = marketValue,
                    marketValueEuro = mvEuro
                )

                result += entity
            }

            Thread.sleep(1000)
        }

        return repo.saveAll(result)
    }

    private fun parseMarketValueToEuro(text: String): Long? {
        val cleaned = text.replace("€", "").trim()

        return when {
            cleaned.endsWith("m", true) ->
                (cleaned.removeSuffix("m").toDoubleOrNull()?.times(1_000_000))?.toLong()

            cleaned.endsWith("k", true) ->
                (cleaned.removeSuffix("k").toDoubleOrNull()?.times(1_000))?.toLong()

            else -> cleaned.toDoubleOrNull()?.toLong()
        }
    }
}
