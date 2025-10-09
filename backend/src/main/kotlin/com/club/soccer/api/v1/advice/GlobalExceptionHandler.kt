package com.club.soccer.api.v1.advice

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

data class ErrorBody(val message: String)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException::class, NoSuchElementException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun notFound(ex: Exception) = ErrorBody(ex.message ?: "Not found")

    @ExceptionHandler(IllegalStateException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun badRequest(ex: IllegalStateException) = ErrorBody(ex.message ?: "Bad request")

    // 👇 추가
    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun unexpected(ex: Exception) = ErrorBody(ex.message ?: "Internal Server Error")
}
