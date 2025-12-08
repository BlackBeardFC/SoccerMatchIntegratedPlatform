alter table matches
    add column if not exists home_score integer default 0 not null;

alter table matches
    add column if not exists away_score integer default 0 not null;