package com.club.soccer.service

import com.club.soccer.api.v1.dto.MatchDto
import com.club.soccer.domain.MatchPopularity
import com.club.soccer.domain.MatchPopularityRepository
import com.club.soccer.domain.MemberRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime

@Service
class RecommendationService(
    private val matchService: MatchService,
    private val memberRepository: MemberRepository,
    private val matchPopularityRepository: MatchPopularityRepository
) {

    /**
     * 추천 우선순위:
     *  1) 회원의 응원팀이 참가한 경기 우선 (favorite_team_id)
     *  2) 경기 시간이 가까운 순 (앞으로 열릴 경기만)
     *  3) 인기 지수(view_count + 3 * reservation_count) 높은 경기 우선
     *  4) 최대 10개 반환
     */
    @Transactional(readOnly = true)
    fun getRecommendedMatches(memberId: Long): List<MatchDto> {
        val member = memberRepository.findById(memberId).orElseThrow {
            ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "회원($memberId)을 찾을 수 없습니다."
            )
        }

        val favoriteTeamId = member.favoriteTeam?.id

        // 이미 잘 동작하는 MatchService 재사용
        val allMatches = matchService.getMatches(from = null, to = null)
        val now = OffsetDateTime.now()

        // 앞으로 열릴 경기만 추려서 (dto, startAt) 튜플로 변환
        val upcoming = allMatches.mapNotNull { dto ->
            val startAt = runCatching { OffsetDateTime.parse(dto.startAt) }.getOrNull()
            if (startAt != null && startAt.isAfter(now)) dto to startAt else null
        }

        if (upcoming.isEmpty()) return emptyList()

        val matchIds = upcoming.map { (dto, _) -> dto.matchId }
        val popularityMap: Map<Long, MatchPopularity> =
            if (matchIds.isNotEmpty()) {
                matchPopularityRepository.findByMatchIdIn(matchIds).associateBy { it.matchId }
            } else {
                emptyMap()
            }

        val scored = upcoming.map { (dto, startAt) ->
            val popularity = popularityMap[dto.matchId]
            val viewCount = popularity?.viewCount ?: 0
            val reservationCount = popularity?.reservationCount ?: 0
            val popularityScore = viewCount + reservationCount * 3

            val isFavorite = favoriteTeamId != null &&
                    (dto.homeTeamId == favoriteTeamId || dto.awayTeamId == favoriteTeamId)

            // 점수 계산 (단순 가중치 기반)
            val favoriteWeight = if (isFavorite) 10_000 else 0
            val timeWeight =
                - (startAt.toEpochSecond() - now.toEpochSecond()).coerceAtLeast(0) / 60 // 분 단위로 줄이기
            val popularityWeight = popularityScore * 100

            val totalScore = favoriteWeight + timeWeight + popularityWeight

            dto to totalScore
        }

        return scored
            .sortedByDescending { it.second }
            .map { it.first }
            .take(10)
    }

    /**
     * 🟡 선택 기능: 인기 지수용 view 카운트 증가
     *  - 나중에 경기 상세 조회 API에서 호출해주면 됨.
     */
    @Transactional
    fun recordView(matchId: Long) {
        val now = OffsetDateTime.now()
        val entity = matchPopularityRepository.findById(matchId)
            .orElse(MatchPopularity(matchId = matchId))
        entity.viewCount += 1
        entity.lastViewedAt = now
        matchPopularityRepository.save(entity)
    }

    /**
     * 🟡 선택 기능: 예약 완료 시 인기 지수용 예약 카운트 증가
     *  - 나중에 예약 확정(confirm) 로직에서 호출해주면 됨.
     */
    @Transactional
    fun recordReservation(matchId: Long) {
        val entity = matchPopularityRepository.findById(matchId)
            .orElse(MatchPopularity(matchId = matchId))
        entity.reservationCount += 1
        matchPopularityRepository.save(entity)
    }
}
