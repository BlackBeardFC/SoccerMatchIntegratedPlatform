package com.club.soccer.admin.inquiry.application

import com.club.soccer.admin.inquiry.api.*
import com.club.soccer.admin.inquiry.domain.InquiryEntity
import com.club.soccer.admin.inquiry.domain.InquiryRepository
import com.club.soccer.admin.inquiry.domain.InquiryStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class InquiryService(
    private val inquiryRepository: InquiryRepository,
) {

    @Transactional(readOnly = true)
    fun getInquiries(
        status: InquiryStatus?,
        pageable: Pageable
    ): Page<InquirySummaryResponse> {
        val page = if (status != null) {
            inquiryRepository.findAllByStatusOrderByCreatedAtDesc(status, pageable)
        } else {
            inquiryRepository.findAllByOrderByCreatedAtDesc(pageable)
        }

        return page.map { it.toSummaryResponse() }
    }

    @Transactional(readOnly = true)
    fun getInquiryDetail(id: Long): InquiryDetailResponse {
        val inquiry = inquiryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("문의가 존재하지 않습니다. id=$id") }

        return inquiry.toDetailResponse()
    }

    @Transactional
    fun createInquiry(request: InquiryCreateRequest): InquiryDetailResponse {
        val entity = InquiryEntity(
            userId = request.userId,
            userNickname = request.userNickname,
            userEmail = request.userEmail,
            title = request.title,
            content = request.content,
        )

        val saved = inquiryRepository.save(entity)
        return saved.toDetailResponse()
    }

    @Transactional
    fun answerInquiry(id: Long, request: InquiryAnswerRequest): InquiryDetailResponse {
        val inquiry = inquiryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("문의가 존재하지 않습니다. id=$id") }

        inquiry.answer = request.answer
        inquiry.answeredAt = LocalDateTime.now()
        inquiry.status = InquiryStatus.COMPLETED

        return inquiry.toDetailResponse()
    }

    @Transactional
    fun updateStatus(id: Long, request: InquiryStatusUpdateRequest): InquiryDetailResponse {
        val inquiry = inquiryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("문의가 존재하지 않습니다. id=$id") }

        inquiry.status = request.status

        // 상태를 WAITING으로 되돌릴 때는 답변/답변시간은 유지하거나 null로 지우거나
        // 정책에 맞게 선택하면 됨 (일단은 그대로 둠)
        return inquiry.toDetailResponse()
    }
}
