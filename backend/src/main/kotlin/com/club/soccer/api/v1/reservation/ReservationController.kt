package com.club.soccer.api.v1.reservation

import com.club.soccer.api.v1.dto.ConfirmReq
import com.club.soccer.api.v1.dto.ConfirmResp
import com.club.soccer.api.v1.dto.HoldReq
import com.club.soccer.api.v1.dto.HoldResp
import com.club.soccer.service.ReservationService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/reservations")
class ReservationController(
    private val reservationService: ReservationService
) {

    @PostMapping("/hold")
    fun holdReservation(
        @RequestBody req: HoldReq
    ): HoldResp =
        reservationService.holdReservation(req)

    @PostMapping("/{id}/confirm")
    fun confirmReservation(
        @PathVariable id: Long,
        @RequestBody req: ConfirmReq
    ): ConfirmResp =
        reservationService.confirmReservation(id, req)
}
