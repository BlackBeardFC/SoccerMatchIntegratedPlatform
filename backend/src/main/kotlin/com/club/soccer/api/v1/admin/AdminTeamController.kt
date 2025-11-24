package com.club.soccer.api.v1.admin

import com.club.soccer.api.v1.dto.AdminTeamReq
import com.club.soccer.domain.Team
import com.club.soccer.service.AdminTeamService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/teams")
class AdminTeamController(
    private val adminTeamService: AdminTeamService
) {

    @GetMapping
    fun getTeams(): List<Team> =
        adminTeamService.getTeams()

    @PostMapping
    fun createTeam(@RequestBody req: AdminTeamReq): Team =
        adminTeamService.createTeam(req)

    @PatchMapping("/{id}")
    fun updateTeam(
        @PathVariable id: Long,
        @RequestBody req: AdminTeamReq
    ): Team =
        adminTeamService.updateTeam(id, req)
}
