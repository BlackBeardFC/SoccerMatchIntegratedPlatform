package com.club.soccer.admin.inquiry.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface InquiryRepository : JpaRepository<InquiryEntity, Long> {

    fun findAllByStatusOrderByCreatedAtDesc(
        status: InquiryStatus,
        pageable: Pageable
    ): Page<InquiryEntity>

    fun findAllByOrderByCreatedAtDesc(
        pageable: Pageable
    ): Page<InquiryEntity>
}
