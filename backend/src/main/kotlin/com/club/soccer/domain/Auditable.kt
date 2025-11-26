package com.club.soccer.domain

import java.time.OffsetDateTime

interface Auditable {
    var createdAt: OffsetDateTime?
    var updatedAt: OffsetDateTime?
}
