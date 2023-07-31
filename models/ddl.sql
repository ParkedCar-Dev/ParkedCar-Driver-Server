create sequence user_id;

create table if not exists driver (
    user_id integer primary key default nextval('user_id'),
    name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(255) not null,
    password varchar(255) not null,
    rating double precision
);

create table if not exists space_owner (
    user_id integer primary key default nextval('user_id'),
    name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(255) not null,
    password varchar(255) not null
);

create table if not exists space (
    space_id serial not null primary key,
    width double precision not null,
    length double precision not null,
    height double precision not null,
    base_fare double precision not null,
    user_id integer not null references space_owner(user_id),
    security_measures varchar(255) not null,
    status varchar(255) not null,
    rating double precision,
    total_books integer not null,
    auto_approve boolean not null,
    address varchar(255) not null,
    city varchar(255) not null,
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    availability_mask varchar(336) not null,
    time_slots boolean[336] not null
);

create table if not exists time_slot_prices (
    time_slot_id serial not null primary key,
    from_time int not null,
    to_time int not null,
    additional_price double precision not null
);

create table if not exists booking(
    booking_id serial not null primary key,
    space_id integer not null references space(space_id),
    driver_id integer not null references driver(user_id),
    from_time timestamp not null,
    to_time timestamp not null,
    status varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    total_price double precision not null,
    payment_id varchar(255) not null,
    payment_status varchar(255) not null,
    payment_medium varchar(255) not null,
    medium_transaction_id varchar(255) not null
);

create table if not exists search_history(
    search_id serial not null primary key,
    user_id integer not null references driver(user_id),
    search_text varchar(255) not null,
    created_at timestamp not null,
    from_time timestamp not null,
    to_time timestamp not null
);

create table if not exists transaction(
    transaction_id serial not null primary key,
    booking_id integer not null references booking(booking_id),
    amount double precision not null,
    created_at timestamp not null,
    updated_at timestamp not null,
    status varchar(255) not null
);

create table if not exists rating(
    rating_id serial not null primary key,
    booking_id integer not null references booking(booking_id),
    rating double precision not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table if not exists complaint(
    complaint_id serial not null primary key,
    booking_id integer not null references booking(booking_id),
    against varchar(255) not null,
    complaint_text varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null
);
