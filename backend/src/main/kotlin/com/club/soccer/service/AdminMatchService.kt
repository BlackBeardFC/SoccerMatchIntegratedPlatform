package com.club.soccer.service

import com.club.soccer.api.v1.dto.AdminMatchReq
import com.club.soccer.api.v1.dto.AdminMatchUpdateReq
import com.club.soccer.domain.Match
import com.club.soccer.domain.MatchRepository
import com.club.soccer.domain.MatchStatus
import com.club.soccer.domain.StadiumRepository
import com.club.soccer.domain.TeamRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime

@Service
class AdminMatchService(
    private val matchRepository: MatchRepository,
    private val teamRepository: TeamRepository,
    private val stadiumRepository: StadiumRepository
) {

    @Transactional(readOnly = true)
    fun getMatches(): List<Match> =
        matchRepository.findAll()

    @Transactional
    fun createMatch(req: AdminMatchReq): Match {
        val stadium = stadiumRepository.findById(req.stadiumId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "경기장(${req.stadiumId})을 찾을 수 없습니다."
                )
            }

        val homeTeam = teamRepository.findById(req.homeTeamId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "홈 팀(${req.homeTeamId})을 찾을 수 없습니다."
                )
            }

        val awayTeam = teamRepository.findById(req.awayTeamId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "원정 팀(${req.awayTeamId})을 찾을 수 없습니다."
                )
            }

        val startAt = runCatching { OffsetDateTime.parse(req.startAt) }
            .getOrElse {
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "startAt 형식이 올바르지 않습니다. ISO-8601 형식을 사용하세요."
                )
            }

        val match = Match(
            stadium = stadium,
            homeTeam = homeTeam,
            awayTeam = awayTeam,
            startAt = startAt,
            status = MatchStatus.SCHEDULED,
            homeScore = 0,
            awayScore = 0
        )

        return matchRepository.save(match)
    }

    @Transactional
    fun updateMatch(id: Long, req: AdminMatchUpdateReq): Match {
        val match = matchRepository.findById(id)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "경기($id)를 찾을 수 없습니다."
                )
            }

        // 시작 시간 변경
        req.startAt?.let {
            val parsed = runCatching { OffsetDateTime.parse(it) }
                .getOrElse {
                    throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "startAt 형식이 올바르지 않습니다."
                    )
                }
            match.startAt = parsed
        }

        // 상태 변경
        req.status?.let {
            val newStatus = runCatching { MatchStatus.valueOf(it) }
                .getOrElse {
                    throw ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "status 값이 올바르지 않습니다. (예: SCHEDULED, FINISHED)"
                    )
                }
            match.status = newStatus
        }

        // 스코어 변경
        if (req.homeScore != null) {
            match.homeScore = req.homeScore
        }
        if (req.awayScore != null) {
            match.awayScore = req.awayScore
        }

        return matchRepository.save(match)
    }
}
