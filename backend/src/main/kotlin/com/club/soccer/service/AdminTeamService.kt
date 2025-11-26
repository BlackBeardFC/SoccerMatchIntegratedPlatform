package com.club.soccer.service

import com.club.soccer.api.v1.dto.AdminTeamReq
import com.club.soccer.domain.Team
import com.club.soccer.domain.TeamRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminTeamService(
    private val teamRepository: TeamRepository
) {

    @Transactional(readOnly = true)
    fun getTeams(): List<Team> =
        teamRepository.findAll()

    @Transactional
    fun createTeam(req: AdminTeamReq): Team {
        val team = Team(
            name = req.name,
            city = req.city,
            //tier = req.tier?.let { enumValueOf(it) }  // seat_tier enum 사용 중이면
        )
        return teamRepository.save(team)
    }

    @Transactional
    fun updateTeam(id: Long, req: AdminTeamReq): Team {
        val team = teamRepository.findById(id).orElseThrow()
        team.name = req.name
        team.city = req.city
        //team.tier = req.tier?.let { enumValueOf(it) }
        return teamRepository.save(team)
    }
}
