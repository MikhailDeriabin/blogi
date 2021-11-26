# blogi

blogi app

To create suitable SQL tables paste this code (for mysql):

  create table users (
    login varchar(40) not null, 
    password varchar(150) not null,
    primary key(login)
  );

create table users_data(
     id int not null auto_increment primary key,
     name varchar(50),
     email varchar(100),
     phone varchar(20),
     hobbies varchar(255),
     date timestamp not null default CURRENT_TIMESTAMP(),
     login varchar(30) not null,
     foreign key (login) references users(login)
);
