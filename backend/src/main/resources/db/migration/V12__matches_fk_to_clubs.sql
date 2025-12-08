alter table matches
    drop constraint if exists fk_matches_home_team;

alter table matches
    drop constraint if exists fk_matches_away_team;

alter table matches
    add constraint fk_matches_home_team
        foreign key (home_team_id) references clubs(id);

alter table matches
    add constraint fk_matches_away_team
        foreign key (away_team_id) references clubs(id);