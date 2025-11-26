package com.club.soccer.service

import com.club.soccer.api.v1.dto.AdminStadiumReq
import com.club.soccer.domain.Stadium
import com.club.soccer.domain.StadiumRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class AdminStadiumService(
    private val stadiumRepository: StadiumRepository
) {

    @Transactional(readOnly = true)
    fun getStadiums(): List<Stadium> =
        stadiumRepository.findAll()

    @Transactional
    fun createStadium(req: AdminStadiumReq): Stadium {
        val stadium = Stadium(
            name = req.name,
            address = req.address
        )
        return stadiumRepository.save(stadium)
    }

    @Transactional
    fun updateStadium(id: Long, req: AdminStadiumReq): Stadium {
        val stadium = stadiumRepository.findById(id)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "경기장($id)을 찾을 수 없습니다."
                )
            }

        stadium.name = req.name
        stadium.address = req.address

        return stadiumRepository.save(stadium)
    }
}
