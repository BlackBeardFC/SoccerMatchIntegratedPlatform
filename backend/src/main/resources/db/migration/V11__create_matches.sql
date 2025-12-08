create table matches (
    id              bigserial primary key,
    home_team_id    bigint not null,
    away_team_id    bigint not null,
    stadium_name    varchar(100) not null,
    start_at        timestamp without time zone not null,
    description     text
);

-- 여기서부터 FK 부분 수정
alter table matches
    add constraint fk_matches_home_team
        foreign key (home_team_id) references teams;

alter table matches
    add constraint fk_matches_away_team
        foreign key (away_team_id) references teams;