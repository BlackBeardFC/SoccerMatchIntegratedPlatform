package com.club.soccer.service

import com.club.soccer.api.v1.dto.ConfirmReq
import com.club.soccer.api.v1.dto.ConfirmResp
import com.club.soccer.api.v1.dto.HoldReq
import com.club.soccer.api.v1.dto.HoldResp
import com.club.soccer.domain.*
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.OffsetDateTime
import java.util.*

@Service
class ReservationService(
    private val reservationRepository: ReservationRepository,
    private val reservationItemRepository: ReservationItemRepository,
    private val memberRepository: MemberRepository,
    private val matchRepository: MatchRepository,
    private val seatRepository: SeatRepository,
    private val paymentRepository: PaymentRepository
) {

    @Transactional
    fun holdReservation(req: HoldReq): HoldResp {
        val member = memberRepository.findById(req.memberId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "회원(${req.memberId})을 찾을 수 없습니다."
                )
            }

        val match = matchRepository.findById(req.matchId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "경기(${req.matchId})를 찾을 수 없습니다."
                )
            }

        val holdUntil = OffsetDateTime.now().plusMinutes(5)

        val reservation = reservationRepository.save(
            Reservation(
                member        = member,
                match         = match,
                holdExpiresAt = holdUntil,
                status        = ReservationStatus.PENDING,
                totalAmount   = 0
            )
        )

        req.seatIds.forEach { seatId ->
            val seat = seatRepository.findById(seatId)
                .orElseThrow {
                    ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "좌석($seatId)을 찾을 수 없습니다."
                    )
                }

            if (!reservationItemRepository.existsByReservationIdAndSeatId(reservation.id, seatId)) {
                reservation.items.add(
                    ReservationItem(
                        reservation = reservation,
                        seat        = seat,
                        price       = seat.section.basePrice
                    )
                )
                reservation.totalAmount += seat.section.basePrice
            }
        }

        reservationRepository.save(reservation)

        return HoldResp(
            reservationId = reservation.id,
            holdExpiresAt = holdUntil.toString()
        )
    }

    @Transactional
    fun confirmReservation(
        reservationId: Long,
        req: ConfirmReq
    ): ConfirmResp {
        val reservation = reservationRepository.findById(reservationId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "예약($reservationId)을 찾을 수 없습니다."
                )
            }

        if (reservation.items.isEmpty()) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "좌석이 없습니다."
            )
        }

        if (reservation.status != ReservationStatus.PENDING) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "이미 처리된 예약입니다."
            )
        }

        if (reservation.holdExpiresAt?.isBefore(OffsetDateTime.now()) == true) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "홀드가 만료되었습니다."
            )
        }

        reservation.status = ReservationStatus.CONFIRMED

        val payment = paymentRepository.save(
            Payment(
                reservation = reservation,
                method      = req.method,
                amount      = reservation.totalAmount,
                paidAt      = OffsetDateTime.now(),
                status      = PaymentStatus.SUCCESS,
                pgTxId      = UUID.randomUUID().toString()
            )
        )

        reservationRepository.save(reservation)

        return ConfirmResp(
            paymentId         = payment.id,
            status            = payment.status.name,
            amount            = payment.amount,
            reservationStatus = reservation.status.name
        )
    }
}
