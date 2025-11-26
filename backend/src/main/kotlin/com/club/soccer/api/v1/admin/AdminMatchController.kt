package com.club.soccer.api.v1.admin

import com.club.soccer.api.v1.dto.AdminMatchReq
import com.club.soccer.api.v1.dto.AdminMatchUpdateReq
import com.club.soccer.domain.Match
import com.club.soccer.service.AdminMatchService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/matches")
class AdminMatchController(
    private val adminMatchService: AdminMatchService
) {

    @GetMapping
    fun getMatches(): List<Match> =
        adminMatchService.getMatches()

    @PostMapping
    fun createMatch(
        @RequestBody req: AdminMatchReq
    ): Match =
        adminMatchService.createMatch(req)

    @PatchMapping("/{id}")
    fun updateMatch(
        @PathVariable id: Long,
        @RequestBody req: AdminMatchUpdateReq
    ): Match =
        adminMatchService.updateMatch(id, req)
}
