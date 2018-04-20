const mysql = require("mysql");
const inquire = require('inquirer');
const cTable = require('console.table');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PASSWORD,
  database: "bamazon"
});

let currentTableData = [];
// seedDB();
displayItems();


function startSale(){
    inquire.prompt([
        {
        type: 'input',
        message: 'Please input the product ID of item you want to buy',
        name: 'prod_id'
        },
        {
            type: 'input',
            message: 'How many would you like to buy?',
            name: 'quantity'
        }
    ]).then(res => {
        currentTableData.forEach(d => {
            if(d.item_id === parseInt(res.prod_id)){
                if(d.stock_quantity >= parseInt(res.quantity)){
                    connection.query(`update products set stock_quantity = ${d.stock_quantity - res.quantity} WHERE item_id = '${res.prod_id}'`);
                    console.log(`You Purchased ${d.product_name} for $${d.price}.`)
                    inquire.prompt([
                        {
                            type: 'confirm',
                            message: 'Buy another item?',
                            name: 'conf'
                        }
                    ]).then(res=>{
                        if(res.conf){
                            displayItems();
                        }else{
                            connection.end();
                            console.log('Thank you, Visit us again!')
                        }
                    })
                    
                }else{
                    console.log('Not enough on stock');
                    startSale();
                }
                
            }
        })
    })
}



function displayItems(){
    connection.query(`SELECT * FROM products`, (err, data)=>{
        if(err) throw err;
        currentTableData = data;
        let table = cTable.getTable(data);
        console.log('\n           PRODUCTS FOR SALE \n\n',table);
        startSale();
    })
    
}




























function seedDB(){
    connection.query(`drop table if exists products`, (err, res)=>{
        if(err) throw err;
        console.log('table dropped');
    })
    connection.query(`create table products (item_id integer(10) not null auto_increment, product_name varchar(30) not null, department_name varchar(30) not null, price integer(10) not null, stock_quantity integer(10) not null, primary key (item_id))`, (err, res)=>{
        if(err) throw err;
        console.log(res);
    });
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('iPod','Electronics', 150, 8)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Computer Mouse','Electronics', 75, 10)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Refrigerator','Appliances', 1500, 2)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Television','Entertainment', 700, 5)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Obi-Sword','Space', 10000, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Playstation','Gaming', 300, 3)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Laptop','Electronics', 600, 7)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('iPhone','Electronics', 999, 2)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Chuck Norris Fist','Death Accessories', 150000, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Batman Mobile','Automotive', 100000, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('IronMan Suit','Electronics', 300000, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Thor Hammer','Mythology', 1, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Captain Shield','Military', 30000, 1)`);
    connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('Bow and Arrow','Hunting', 150, 8)`);

}