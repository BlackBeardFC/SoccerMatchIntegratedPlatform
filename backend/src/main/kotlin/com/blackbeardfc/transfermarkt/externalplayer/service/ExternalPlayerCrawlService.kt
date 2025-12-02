package com.blackbeardfc.transfermarkt.externalplayer.service

import com.blackbeardfc.transfermarkt.externalplayer.domain.ExternalPlayerEntity
import com.blackbeardfc.transfermarkt.externalplayer.domain.ExternalPlayerRepository
import org.jsoup.Jsoup
import org.springframework.stereotype.Service

@Service
class ExternalPlayerCrawlService(
    private val externalPlayerRepository: ExternalPlayerRepository
) {

    private val BASE_URL = "https://www.transfermarkt.com"
    private val USER_AGENT =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"

    private val targetLeagues = listOf(
        "https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1",
        "https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1",
        "https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1",
        "https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1",
        "https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1",
        "https://www.transfermarkt.com/major-league-soccer/startseite/wettbewerb/MLS1"
    )

    fun crawlAllLeagues() {
        val result = mutableListOf<ExternalPlayerEntity>()

        for (leagueUrl in targetLeagues) {
            val leaguePlayers = crawlLeague(leagueUrl)
            println("[Crawl] ${leaguePlayers.size} players fetched from $leagueUrl")
            result += leaguePlayers
        }

        externalPlayerRepository.saveAll(result)
        println("[Crawl] saved ${result.size} players.")
    }

    private fun crawlLeague(leagueUrl: String): List<ExternalPlayerEntity> {
        val doc = Jsoup.connect(leagueUrl).userAgent(USER_AGENT).get()

        val playerRows = doc.select("table.items > tbody > tr")

        val players = mutableListOf<ExternalPlayerEntity>()

        for (row in playerRows) {
            val link = row.select("td.posrela a").attr("href")
            if (link.isEmpty()) continue

            val detailUrl = BASE_URL + link

            // 상세 페이지 크롤링
            val detail = crawlPlayerDetail(detailUrl)

            if (detail != null) players += detail
        }

        return players
    }

    private fun crawlPlayerDetail(url: String): ExternalPlayerEntity? {
        val doc = Jsoup.connect(url).userAgent(USER_AGENT).get()

        val name = doc.selectFirst("h1[data-placeholder]")?.text() ?: return null

        // 포지션
        val pos = doc.select("div.data-header__position").text()

        // 나이(예: "Age: 31")
        val ageText = doc.select("span.data-header__content").firstOrNull()?.text()
        val age = ageText?.filter { it.isDigit() }?.toIntOrNull()

        // 키 "1,75 m"
        val heightText = doc.select("span:contains(m)").text()
        val height = heightText.replace("m", "")
            .replace(",", ".")
            .trim()
            .toDoubleOrNull()
            ?.times(100)
            ?.toInt()

        // 몸무게는 없는 경우 많음 → null 허용
        val weight: Int? = null

        // 국적 (여러 국적 중 첫 번째)
        val nationality = doc.select("span.data-header__label a.flaggenrahmen")
            .firstOrNull()
            ?.attr("title")

        // 소속팀
        val teamName = doc.select("span.data-header__label a.spielprofil_tooltip")
            .firstOrNull()
            ?.text()

        // 어떤 리그인지
        val league = doc.select("a.breadcrumbs__link").lastOrNull()?.text()

        return ExternalPlayerEntity(
            name = name,
            position = pos,
            age = age,
            height = height,
            weight = weight,
            nationality = nationality,
            sourceTeam = teamName,
            sourceLeague = league,
            detailUrl = url
        )
    }
}
