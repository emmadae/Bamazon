-- practice one --
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR (100) NOT NULL,
	department_name VARCHAR (100) NOT NULL,
	price INTEGER (10) NOT NULL,
	stock_quantity INTEGER (10) NOT NULL, 
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) values 
("45LB Barbell", "weights", 200, 10),
("30LB Kettlebell", "weights", 40, 7),
("AbMat", "equipment", 30, 50),
("Wrist Wraps", "accessories", 12, 80),
("Rowing Machine", "equipment", 950, 3),
("Box", "equipment", 50, 10),
("Grips", "accessories", 30, 25),
("35LB Dumbbell", "weights", 40, 8),
("Assault Bike", "equipment", 800, 2),
("Tape", "accessories", 5, 100);


DROP TABLE products;
TRUNCATE TABLE products;





SELECT name, data, author
FROM users
INNER JOIN comments ON users.id = comments.author;