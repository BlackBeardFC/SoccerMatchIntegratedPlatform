package com.club.soccer.admin.inquiry.api

import com.club.soccer.admin.inquiry.application.InquiryService
import com.club.soccer.admin.inquiry.domain.InquiryStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/admin/inquiries")
class AdminInquiryController(
    private val inquiryService: InquiryService,
) {

    // 문의 목록 조회 (status 필터: WAITING / COMPLETED 선택적)
    @GetMapping
    fun getInquiries(
        @RequestParam(required = false) status: InquiryStatus?,
        @PageableDefault(size = 20) pageable: Pageable,
    ): Page<InquirySummaryResponse> {
        return inquiryService.getInquiries(status, pageable)
    }

    // 문의 상세 조회
    @GetMapping("/{id}")
    fun getInquiryDetail(
        @PathVariable id: Long,
    ): InquiryDetailResponse {
        return inquiryService.getInquiryDetail(id)
    }

    // (옵션) 앱에서 유저가 문의 등록할 때 사용할 수 있음
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createInquiry(
        @RequestBody @Valid request: InquiryCreateRequest,
    ): InquiryDetailResponse {
        return inquiryService.createInquiry(request)
    }

    // 답변 등록 + 상태 COMPLETED로 변경
    @PostMapping("/{id}/answer")
    fun answerInquiry(
        @PathVariable id: Long,
        @RequestBody @Valid request: InquiryAnswerRequest,
    ): InquiryDetailResponse {
        return inquiryService.answerInquiry(id, request)
    }

    // 상태만 변경 (WAITING <-> COMPLETED)
    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestBody request: InquiryStatusUpdateRequest,
    ): InquiryDetailResponse {
        return inquiryService.updateStatus(id, request)
    }
}
