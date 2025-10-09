package com.club.soccer.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.boot.autoconfigure.domain.EntityScan

@SpringBootApplication(scanBasePackages = ["com.club.soccer"])
@EnableJpaRepositories(basePackages = ["com.club.soccer.domain"])
@EntityScan(basePackages = ["com.club.soccer.domain"])
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
