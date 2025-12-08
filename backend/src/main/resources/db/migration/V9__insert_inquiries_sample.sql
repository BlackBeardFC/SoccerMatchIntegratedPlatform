INSERT INTO inquiries (user_id, user_nickname, user_email, title, content, status, created_at)
VALUES
    (1, 'soccerFan01', 'fan01@example.com', '예매 취소 문의', '어제 경기 예매를 취소하고 싶습니다.', 'WAITING', NOW() - INTERVAL '2 day'),
    (2, 'bbfcUltra', 'ultra@example.com', '좌석 변경 가능 여부', '같은 구역 내에서 좌석 변경이 가능한가요?', 'COMPLETED', NOW() - INTERVAL '1 day'),
    (3, 'mobileUser', 'mobile@example.com', '모바일 티켓 문의', '티켓이 앱에 안 보여요.', 'WAITING', NOW());
