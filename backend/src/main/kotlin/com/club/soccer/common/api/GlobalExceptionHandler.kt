package com.club.soccer.common.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.slf4j.LoggerFactory

data class ErrorResponse(
    val message: String,
    val errors: List<FieldErrorResponse> = emptyList(),
)

data class FieldErrorResponse(
    val field: String,
    val message: String?,
)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val fieldErrors = ex.bindingResult.fieldErrors.map {
            FieldErrorResponse(
                field = it.field,
                message = it.defaultMessage
            )
        }
        return ResponseEntity(
            ErrorResponse(
                message = "요청 값이 올바르지 않습니다.",
                errors = fieldErrors
            ),
            HttpStatus.BAD_REQUEST
        )
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        return ResponseEntity(
            ErrorResponse(message = ex.message ?: "잘못된 요청입니다."),
            HttpStatus.BAD_REQUEST
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleOther(ex: Exception): ResponseEntity<ErrorResponse> {
        // 디버깅용으로 로그만 잘 찍어두면 됨
        return ResponseEntity(
            ErrorResponse(message = "서버 내부 오류가 발생했습니다."),
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    }
}
