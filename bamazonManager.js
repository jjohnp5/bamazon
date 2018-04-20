const mysql = require("mysql");
const inquire = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();
let currentTableData = [];
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PASSWORD,
  database: "bamazon"
});
viewProducts();

function startApp(){
    inquire.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'todo'
        }
    ]).then(res=>{
        switch(res.todo){
            case 'View Products':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
        }
    })
}

function viewProducts(){
    showProducts(startApp)
        
    
    
}
function viewLowInventory(){
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, (err, data)=>{
        if(err) throw err;
        let table = cTable.getTable(data);
        console.log('\n           PRODUCTS FOR SALE \n\n',table);
        startApp();
    })
}
function addToInventory(){
    inquire.prompt([
        {
            type: 'input',
            message: 'Enter the Item ID of the product you want to re-stock',
            name: 'item'
        },
        {
            type: 'input',
            message: 'How many would you want to add?',
            name: 'quantity'
        }
    ]).then(res=>{
        currentTableData.forEach(d=>{
            if(d.item_id === parseInt(res.item)){
                connection.query(`UPDATE products set stock_quantity=${d.stock_quantity + parseInt(res.quantity)} WHERE item_id='${res.item}'`, (err, response)=>{
                    if(err) throw err;
                    console.log('Item has been updated.')
                    showProducts(inqAddToInv)
                        
                    
                        
                })
            }
        })
        
    })
}
function addNewProduct(){
    inquire.prompt([
        {
            type: 'input',
            message: 'Product Name:',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Department:',
            name: 'dept'
        },
        {
            type: 'input',
            message: 'Price:',
            name: 'price'
        },
        {
            type: 'input',
            message: 'Quantity:',
            name: 'quantity'
        }
    ]).then(res => {
        connection.query(`insert into products (product_name, department_name, price, stock_quantity) values('${res.name}','${res.dept}','${res.price}','${res.quantity}')`, (err, r)=>{
            if(err) throw err;
            console.log('Item Added to Inventory.')
            showProducts(inqAddNewProd)
                
            

        });
    })
}


function showProducts(fn){
    connection.query(`SELECT * FROM products`, (err, data)=>{
        if(err) throw err;
        currentTableData = data;
        let table = cTable.getTable(data);
        console.log('\n           PRODUCTS FOR SALE \n\n',table);
        fn();
    })
}

function inqAddToInv(){
    inquire.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            choices: ['Back to main menu', 'Add another inventory'],
            name: 'ch'
        }
    ]).then(r => {
        if(r.ch === 'Back to main menu')
        {
            startApp();
        }else{
            addToInventory();
        }
    })
}

function inqAddNewProd(){
    inquire.prompt([
        {
            type: 'list',
            message: 'What would you want to do?',
            choices: ['Back to Main Menu', 'Add another item'],
            name: 'ch'
        }
    ]).then(res => {
        if(res.ch === 'Back to Main Menu'){
            startApp();
        }else{
            addNewProduct();
        }
    })
}