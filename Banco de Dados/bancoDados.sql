create user 'Admin'@'%' identified by 'admin@123';

grant all privileges on ordemservico.* to 'Admin'@'%';

flush privileges;

create database ordemservico;

use ordemservico;

create table servico(

id 		 int(11) not null auto_increment,
nome 	 varchar(80) not null,
email	 varchar(150)not null,
maquina  varchar(80) not null,

primary key (id)

) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

