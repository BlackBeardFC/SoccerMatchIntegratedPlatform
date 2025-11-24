package com.club.soccer.api.v1.admin

import com.club.soccer.api.v1.dto.AdminStadiumReq
import com.club.soccer.domain.Stadium
import com.club.soccer.service.AdminStadiumService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/stadiums")
class AdminStadiumController(
    private val adminStadiumService: AdminStadiumService
) {

    @GetMapping
    fun getStadiums(): List<Stadium> =
        adminStadiumService.getStadiums()

    @PostMapping
    fun createStadium(
        @RequestBody req: AdminStadiumReq
    ): Stadium =
        adminStadiumService.createStadium(req)

    @PatchMapping("/{id}")
    fun updateStadium(
        @PathVariable id: Long,
        @RequestBody req: AdminStadiumReq
    ): Stadium =
        adminStadiumService.updateStadium(id, req)
}
