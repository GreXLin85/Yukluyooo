CREATE TABLE `uploads` (
	`id` int NOT NULL AUTO_INCREMENT,
	`dosya_yol` varchar(30) NOT NULL,
	`dosya_ad` varchar(30) NOT NULL,
	`boyut` varchar(10) NOT NULL,
	`uniqlink` varchar(10) NOT NULL UNIQUE,
	`yukleyenip` varchar(16) NOT NULL,
	PRIMARY KEY (`id`)
);

