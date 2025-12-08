create table clubs (
    id              bigserial primary key,
    name            varchar(100) not null,
    logo_url        varchar(255),
    short_description varchar(255),
    city            varchar(100)
);
