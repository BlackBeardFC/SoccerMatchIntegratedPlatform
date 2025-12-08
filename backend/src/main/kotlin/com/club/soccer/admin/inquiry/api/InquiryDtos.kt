package com.club.soccer.admin.inquiry.api

import com.club.soccer.admin.inquiry.domain.InquiryEntity
import com.club.soccer.admin.inquiry.domain.InquiryStatus
import java.time.LocalDateTime
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class InquirySummaryResponse(
    val id: Long,
    val status: InquiryStatus,
    val createdAt: LocalDateTime,
    val userNickname: String,
    val userEmail: String?,
    val title: String,
)

data class InquiryDetailResponse(
    val id: Long,
    val status: InquiryStatus,
    val createdAt: LocalDateTime,
    val userId: Long,
    val userNickname: String,
    val userEmail: String?,
    val title: String,
    val content: String,
    val answeredAt: LocalDateTime?,
    val answer: String?,
)

data class InquiryAnswerRequest(
    @field:NotBlank
    val answer: String,
)

data class InquiryStatusUpdateRequest(
    val status: InquiryStatus,
)

data class InquiryCreateRequest(
    @field:NotNull
    val userId: Long,

    @field:NotBlank
    @field:Size(max = 50)
    val userNickname: String,

    @field:Email
    @field:Size(max = 100)
    val userEmail: String?,

    @field:NotBlank
    @field:Size(max = 100)
    val title: String,

    @field:NotBlank
    val content: String,
)

fun InquiryEntity.toSummaryResponse(): InquirySummaryResponse =
    InquirySummaryResponse(
        id = requireNotNull(id),
        status = status,
        createdAt = createdAt,
        userNickname = userNickname,
        userEmail = userEmail,
        title = title,
    )

fun InquiryEntity.toDetailResponse(): InquiryDetailResponse =
    InquiryDetailResponse(
        id = requireNotNull(id),
        status = status,
        createdAt = createdAt,
        userId = userId,
        userNickname = userNickname,
        userEmail = userEmail,
        title = title,
        content = content,
        answeredAt = answeredAt,
        answer = answer,
    )
