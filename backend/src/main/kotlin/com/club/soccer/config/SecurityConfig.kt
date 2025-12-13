package com.club.soccer.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors {}
            // 개발용: 모든 요청 허용
            .authorizeHttpRequests { auth ->
                auth.anyRequest().permitAll()
            }
            // CSRF 비활성화 (POST/PUT 테스트 용이)
            .csrf { it.disable() }
            // 기본 인증/폼 로그인 끄기 (401 챌린지 방지)
            .httpBasic { it.disable() }
            .formLogin { it.disable() }

        return http.build()
    }
}
