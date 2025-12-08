alter table matches
    add column if not exists status varchar(20) not null default 'SCHEDULED';
