# blogi

blogi app

To run this app open terminal from code folder and paste node .\server.js, also make sure you have all required dependencies installed, at least:
  bcryptjs,
  body-parser,
  express,
  hbs,
  mysql,
  cookie-parser,
  dotenv,
  jsonwebtoken

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

create table posts(
     id int not null auto_increment primary key,
     name varchar(255) not null,
     content text,
     date timestamp not null default current_timestamp(),
     login varchar(30) not null,
     foreign key(login) references users(login)
);

Also make sure you have .env file in code folder(on server.js file level) with following strings (all variables starting with DATABASE_ you can change with your server settings):
DATABASE = blog
DATABASE_HOST = localhost
DATABASE_USER = user
DATABASE_PASSWORD = user
JWT_SECRET = donothackme
JWT_EXPIRES_IN = 30d
JWT_COOKIE_EXPIRES = 30
