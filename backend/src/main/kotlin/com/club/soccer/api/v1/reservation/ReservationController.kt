package com.club.soccer.api.v1.reservation

import com.club.soccer.api.v1.dto.ConfirmResp
import com.club.soccer.api.v1.dto.HoldResp
import com.club.soccer.domain.*
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.time.OffsetDateTime
import java.util.*

@RestController
@RequestMapping("/api/reservations")
class ReservationController(
    private val reservationRepository: ReservationRepository,
    private val reservationItemRepository: ReservationItemRepository,
    private val memberRepository: MemberRepository,
    private val matchRepository: MatchRepository,
    private val seatRepository: SeatRepository,
    private val paymentRepository: PaymentRepository
) {
    @PostMapping("/hold")
    @Transactional
    fun holdReservation(
        @RequestParam memberId: Long,
        @RequestParam matchId: Long,
        @RequestParam seatIds: List<Long>
    ): HoldResp {
        val member = memberRepository.findById(memberId).orElseThrow()
        val match = matchRepository.findById(matchId).orElseThrow()
        val holdUntil = OffsetDateTime.now().plusMinutes(5)

        val reservation = reservationRepository.save(
            Reservation(member = member, match = match, holdExpiresAt = holdUntil, status = ReservationStatus.PENDING, totalAmount = 0)
        )

        seatIds.forEach { seatId ->
            val seat = seatRepository.findById(seatId).orElseThrow()
            if (!reservationItemRepository.existsByReservationIdAndSeatId(reservation.id, seatId)) {
                reservation.items.add(ReservationItem(reservation = reservation, seat = seat, price = seat.section.basePrice))
                reservation.totalAmount += seat.section.basePrice
            }
        }

        reservationRepository.save(reservation)
        return HoldResp(reservationId = reservation.id, holdExpiresAt = holdUntil.toString())
    }

    @PostMapping("/{id}/confirm")
    @Transactional
    fun confirmReservation(@PathVariable id: Long, @RequestParam method: String): ConfirmResp {
        val reservation = reservationRepository.findById(id).orElseThrow()
        if (reservation.items.isEmpty()) throw IllegalStateException("좌석 없음")
        if (reservation.status != ReservationStatus.PENDING) throw IllegalStateException("이미 처리됨")
        if (reservation.holdExpiresAt?.isBefore(OffsetDateTime.now()) == true) throw IllegalStateException("홀드 만료")

        reservation.status = ReservationStatus.CONFIRMED
        val payment = paymentRepository.save(
            Payment(
                reservation = reservation,
                method = method,
                amount = reservation.totalAmount,
                paidAt = OffsetDateTime.now(),
                status = PaymentStatus.SUCCESS,
                pgTxId = UUID.randomUUID().toString()
            )
        )
        reservationRepository.save(reservation)
        return ConfirmResp(paymentId = payment.id, status = payment.status.name, amount = payment.amount, reservationStatus = reservation.status.name)
    }
}
