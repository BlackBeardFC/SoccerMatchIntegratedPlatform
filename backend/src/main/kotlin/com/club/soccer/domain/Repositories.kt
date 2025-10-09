package com.club.soccer.domain

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.OffsetDateTime

/* ---------- 기본 CRUD + 자주 쓰는 파생 메서드들 ---------- */

interface MemberRepository : JpaRepository<Member, Long> {
    fun findByEmail(email: String): Member?
}

interface TeamRepository : JpaRepository<Team, Long>

interface PlayerRepository : JpaRepository<Player, Long> {
    fun findByTeamId(teamId: Long): List<Player>
}

interface StadiumRepository : JpaRepository<Stadium, Long>

interface SectionRepository : JpaRepository<Section, Long> {
    fun findByStadiumId(stadiumId: Long): List<Section>
    fun findByStadiumIdAndName(stadiumId: Long, name: String): Section?
}

interface SeatRepository : JpaRepository<Seat, Long> {
    fun findBySectionId(sectionId: Long): List<Seat>
    fun findBySectionIdAndRowNoAndColNo(sectionId: Long, rowNo: String, colNo: String): Seat?
    fun countBySectionId(sectionId: Long): Long
}

/* ---------- Match: 프로젝션 기반(네이티브)으로 안전 조회 ---------- */

interface MatchProjection {
    fun getMatchId(): Long
    fun getStadiumId(): Long
    fun getHomeTeamId(): Long
    fun getAwayTeamId(): Long
    fun getStartAt(): java.time.Instant   // ⬅️ 여기만 Instant로!
    fun getStatus(): String
    fun getHomeScore(): Int
    fun getAwayScore(): Int
}

interface MatchRepository : JpaRepository<Match, Long> {

    @Query(
        value = """
            SELECT
              m.match_id       AS matchId,
              m.stadium_id     AS stadiumId,
              m.home_team_id   AS homeTeamId,
              m.away_team_id   AS awayTeamId,
              m.start_at       AS startAt,
              m.status::text   AS status,
              m.home_score     AS homeScore,
              m.away_score     AS awayScore
            FROM matches m
            WHERE m.start_at BETWEEN :start AND :end
            ORDER BY m.start_at ASC
        """,
        nativeQuery = true
    )
    fun findBetweenSimple(
        @Param("start") start: OffsetDateTime,
        @Param("end") end: OffsetDateTime
    ): List<MatchProjection>

    @Query(
        value = """
            SELECT
              m.match_id       AS matchId,
              m.stadium_id     AS stadiumId,
              m.home_team_id   AS homeTeamId,
              m.away_team_id   AS awayTeamId,
              m.start_at       AS startAt,
              m.status::text   AS status,
              m.home_score     AS homeScore,
              m.away_score     AS awayScore
            FROM matches m
            WHERE m.match_id = :id
        """,
        nativeQuery = true
    )
    fun findOneSimple(@Param("id") id: Long): MatchProjection?

    /* 필요시 사용 가능한 JPA 버전(지연로딩 이슈 가능):
    fun findByStatus(status: MatchStatus): List<Match>

    @Query("select m from Match m where m.startAt between :start and :end order by m.startAt asc")
    fun findBetween(@Param("start") start: OffsetDateTime, @Param("end") end: OffsetDateTime): List<Match>

    @Query("select m from Match m where m.startAt >= :from order by m.startAt asc")
    fun findUpcoming(@Param("from") from: OffsetDateTime = OffsetDateTime.now(), pageable: Pageable): List<Match>
    */
}

interface ReservationRepository : JpaRepository<Reservation, Long> {

    /** 특정 회원의 예약(홀드/확정) 최신순 */
    @Query("select r from Reservation r where r.member.id = :memberId order by r.createdAt desc")
    fun findRecentByMember(@Param("memberId") memberId: Long, pageable: Pageable): List<Reservation>

    /** 아직 만료되지 않은 PENDING 홀드 */
    @Query("""
        select r from Reservation r
        where r.member.id = :memberId
          and r.match.id  = :matchId
          and r.status    = com.club.soccer.domain.ReservationStatus.PENDING
          and (r.holdExpiresAt is null or r.holdExpiresAt > CURRENT_TIMESTAMP)
        order by r.createdAt desc
    """)
    fun findActiveHold(@Param("memberId") memberId: Long, @Param("matchId") matchId: Long): List<Reservation>
}

interface ReservationItemRepository : JpaRepository<ReservationItem, Long> {
    fun findByReservationId(reservationId: Long): List<ReservationItem>
    fun existsByReservationIdAndSeatId(reservationId: Long, seatId: Long): Boolean
    fun countByReservationId(reservationId: Long): Long
}

interface PaymentRepository : JpaRepository<Payment, Long> {
    fun findByReservationId(reservationId: Long): Payment?
}

/* ---------- 좌석 가용성(락) 조회 ---------- */

interface SeatAvailabilityProjection {
    fun getSeatId(): Long
    fun getLocked(): Boolean
    fun getSectionName(): String
    fun getRowNo(): String
    fun getColNo(): String
    fun getBasePrice(): Int
}

interface AvailabilityRepository : JpaRepository<Seat, Long> {

    @Query(
        value = """
            SELECT
              s.seat_id                  AS seatId,
              COALESCE(v.locked, FALSE)  AS locked,
              sec.name                   AS sectionName,
              s.row_no                   AS rowNo,
              s.col_no                   AS colNo,
              sec.base_price             AS basePrice
            FROM matches m
            JOIN stadiums st ON st.stadium_id = m.stadium_id
            JOIN sections sec ON sec.stadium_id = st.stadium_id
            JOIN seats s ON s.section_id = sec.section_id
            LEFT JOIN v_match_seat_locks v ON v.match_id = m.match_id AND v.seat_id = s.seat_id
            WHERE m.match_id = :matchId
            ORDER BY sec.name, s.row_no, s.col_no
        """,
        nativeQuery = true
    )
    fun findAvailability(@Param("matchId") matchId: Long): List<SeatAvailabilityProjection>
}
