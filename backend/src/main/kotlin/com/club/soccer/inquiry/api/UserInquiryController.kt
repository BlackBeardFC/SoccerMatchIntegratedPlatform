package com.club.soccer.inquiry.api

import com.club.soccer.admin.inquiry.api.InquiryCreateRequest
import com.club.soccer.admin.inquiry.api.InquiryDetailResponse
import com.club.soccer.admin.inquiry.application.InquiryService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/api/inquiries")
class UserInquiryController(
    private val inquiryService: InquiryService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createInquiry(
        @RequestBody @Valid request: InquiryCreateRequest,
    ): InquiryDetailResponse {
        // 추후에 userId는 인증 정보에서 뽑고,
        // request.userId는 제거해도 됨(지금은 편의상 그대로 둠)
        return inquiryService.createInquiry(request)
    }
}
