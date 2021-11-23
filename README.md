# blogi

blogi sovellus

To create suitable SQL table paste this code: 
  create table users (
    login varchar(20) not null, 
    password varchar(40) not null, 
    posts JSON, 
    primary key(login)
  );
