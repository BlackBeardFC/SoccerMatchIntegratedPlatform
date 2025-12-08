//package com.club.soccer.api.v1.match
//
//import org.springframework.format.annotation.DateTimeFormat
//import org.springframework.web.bind.annotation.*
//import java.time.LocalDate
//
//@RestController
//@RequestMapping("/api/matches")
//class MatchQueryController(
//    private val matchQueryService: MatchQueryService
//) {
//
//    @GetMapping
//    fun getMatches(
//        @RequestParam(required = false)
//        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
//        dateFrom: LocalDate?,
//
//        @RequestParam(required = false)
//        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
//        dateTo: LocalDate?
//    ): List<MatchSummaryResponse> {
//        return matchQueryService.getUpcomingMatches(dateFrom, dateTo)
//    }
//
//    @GetMapping("/{matchId}")
//    fun getMatchDetail(
//        @PathVariable matchId: Long
//    ): MatchDetailResponse {
//        return matchQueryService.getMatchDetail(matchId)
//    }
//}
