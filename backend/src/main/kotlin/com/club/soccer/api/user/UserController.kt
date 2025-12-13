package com.club.soccer.api.user

import com.club.soccer.api.v1.dto.user.UserResponse
import com.club.soccer.api.v1.dto.user.UserUpdateRequest
import com.club.soccer.service.user.UserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
) {

    @GetMapping("/test")
    fun test(): String = "user api ok"

    // TODO: 나중에 JWT 붙이면 여기에서 토큰에서 userId 꺼내서 사용
    private fun getCurrentUserIdStub(): Long = 1L

    // 내 정보 조회
    @GetMapping("/me")
    fun getMe(): UserResponse {
        val userId = getCurrentUserIdStub()
        val user = userService.getUserById(userId)
        return UserResponse.from(user)
    }

    // 내 정보 수정
    @PutMapping("/me")
    fun updateMe(@RequestBody request: UserUpdateRequest): UserResponse {
        val userId = getCurrentUserIdStub()
        val updated = userService.updateUser(userId, request)
        return UserResponse.from(updated)
    }

    // 참고용: 특정 ID로 조회하는 엔드포인트도 하나 만들어두면 편함
    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): UserResponse {
        val user = userService.getUserById(id)
        return UserResponse.from(user)
    }
}
