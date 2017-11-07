
var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var colors = require('colors');


var connection = mysql.createConnection({
	host: "localhost",
  	port: 3306,
  	user: "root",
  	password: "",
  	database: "bamazon_db"
});


// begin connection to database
connection.connect(function(err) {
 	if (err) throw err;
 	console.log("You Are Connected.");
	displayData();
});

// =============================================================================
// display data for user
function displayData() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
	// creating new table header
	var table = new Table({
	    head: ['ID'.cyan, 'Product Name'.cyan, 'Department'.cyan, 'Price'.cyan, 'Quantity'.cyan]
	});
	// pushing table values
	for (var i = 0; i < res.length; i++){
		table.push(
			[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
		);
	}

	console.log(table.toString());

    inquirePrompt ();
  });
}

// =============================================================================
// asking if you are a user or an admin
function inquirePrompt (){
	inquirer
  .prompt([
    {
      type: "list",
      message: "Are You a User or an Admin?",
      choices: ["User", "Admin"],
      name: "start"
    }
  ])

  .then(function(startUser) {
	if (startUser.start == 'User') {
	    userPrompt();
	} else {
		adminPassword ();
	}
  });
}

// =============================================================================
// user function
function userPrompt (){
	// ask what function they would like to persue 
	inquirer
  .prompt([
    {
      type: "list",
      message: "User, would you like to...",
      choices: ["Purchase Item?", "Just Window Shopping?"],
      name: "start"
    }
  ])

  // if else statement for user choice
	.then(function(myInquirer) {
	    if (myInquirer.start == 'Purchase Item?') {
	      console.log("Purchase Your Item: ");
		// if yes ... add item
			inquirer
			  .prompt([
			    {
			      type: "input",
			      message: "ID of the item: ",
			      name: "item_id"
			    },
			 
			    {
			      type: "input",
			      message: "Quantity of the item: ",
			      name: "item_quantity"
			    }
			  ]) 

		.then(function(purchase){
		// pushing new inputed data into table
		 connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
		 	[ purchase.item_quantity, purchase.item_id ],

		    function(err, result) {
		      console.log(" Product Purchased!");
		      userPrompt ();
		      // Call updateProduct AFTER the INSERT completes
		    }
		  );
		});	

		} else {
	      console.log("Just Viewing Products. Thank You.");
	      connection.end();
	    }
	});

}

// =============================================================================
// admin password
function adminPassword (){
	inquirer
	  .prompt([
	    {
	      type: "password",
	      message: "Enter Your Admin Password: ",
	      name: "password"
	    }
	  ])

	.then(function(myPassword) {
	    if (myPassword.password == 'admin') {
	    	adminPrompt ();
		} else {
			console.log("Sorry, thats not the correct password.");
			inquirePrompt ();
		}
	});
}

// =============================================================================
// admin function
function adminPrompt(){
	// ask user if they would like to change the inventory
	inquirer
  .prompt([
    {
      type: "list",
      message: "Editing your inventory. Would you like to...",
      choices: ["Add Item?", "Delete Item?", "Just Viewing?"],
      name: "start"
    }
  ])

	// if else statement for yes or no choice
	.then(function(myInquirer) {
	    if (myInquirer.start == 'Add Item?') {
	      console.log("Input your item into the system.");
		// if yes ... add item
			inquirer
			  .prompt([
			    {
			      type: "input",
			      message: "Name of item: ",
			      name: "item_name"
			    },
			 
			    {
			      type: "input",
			      message: "Department name: ",
			      name: "department_name"
			    },
		
			    {
			      type: "input",
			      message: "Price of item (#): ",
			      name: "item_price"
			    },

			    {
			      type: "input",
			      message: "Quantity of item (#): ",
			      name: "item_quantity"
			    }
			   ]) 

		.then(function(answer){
		// pushing new inputed data into table
		 connection.query("INSERT INTO products SET ?",
		    {
		      product_name: answer.item_name ,
		      department_name: answer.department_name,
		      price: answer.item_price,
		      stock_quantity: answer.item_quantity 
		    },

		    function(err, result) {
		      console.log(result.affectedRows + " Product Inserted!");
		      adminPrompt();
		      // Call updateProduct AFTER the INSERT completes
		    }
		  );
		});	

		} else if (myInquirer.start == 'Delete Item?') {
	      	console.log("Delete your item from the system.");
		// if yes ... add item
			inquirer
			  .prompt([
			    {
			      type: "input",
			      message: "Item ID (#): ",
			      name: "item_id"
			    }
			   ]) 

		.then(function(deleteItem){
		// pushing new inputed data into table
		 connection.query("DELETE FROM products WHERE ?",
		    {
		      item_id: deleteItem.item_id
		    },

		    function(err, result) {
		      console.log(result.affectedRows + " Product Deleted.");
		      adminPrompt()
		      // Call updateProduct AFTER the INSERT completes
		    }
		  );
		});

		// else...
	    }  else {
	      console.log("Thanks. Come again soon.");
	      connection.end();
	    }
	});

} //end function

// =============================================================================



