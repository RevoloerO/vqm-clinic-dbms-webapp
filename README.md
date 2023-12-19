# vqm-clinic-dbms-webapp
IST634-CSU: Create DBMS Web application for clinic to manipulate MS Access DB using NodeJS  
Programming Languages & Libraries: 
- HTML, CSS, Javascript
- NodeJS, express, cor, node-adodb
- Microsoft Access
Server Logic Explaination: 
- To connect the web app to the database, I created server with GET and POST API
- The server connect with .mdb file (Microsoft Access) by using node-adodb library
- After connecting to Microsoft Access, I crearted POST and GET API allow the web DBMS pull and manipulate data in DB.

User Manual:

1. Setting Up Server:
	1.1 Install Node.js (https://nodejs.org/en/download/current)- Required for connecting server and database
	
	1.2. Required Packages:
		- Open package.json, ensure that:
		a. "node-adodb" in the "devDependencies"
		b. "cors" and "express" in the "dependencies"
		- If the pakages missing, right click on the Solution -> Open in Terminal -> Run following command:
		a. npm install express
		b. npm install cors
		c. npm install node-adodb
		
	1.3 Check Database Connection:
		- Open server.js 
		- Change variable db_file_path to the .mdb file (.accdb is not supported at the moment) (line 8)
		** The path need to be separated by double backward slash "\\" instead of single one "\" **
		- example: "D:\\CSU\\Group11\\Web application\\Database clinic.mdb" 
		- Ensure the variable port is "process.env.PORT || 1337" (line 10)
		- If you want to change the local host port, change the variable "PORT" in server.js and "localhost" in mgm/master.js
		
	1.4 Run Server:
		- Start server by Run the debugger or start
		- The server is running on http://localhost:1337/
		- If the patient data example in the http://localhost:1337/ is [undefined]-> refresh the page 
		(This happened due to the server page is loaded faster than the server connect to the database)
		- If the console log show error of "code: -2147467259,
  		message: "The database has been placed in a state by user 'Admin'... being opened or locked."
		-> turn off microsoft access due to conflict on database access -> restart server.
		(The Microsoft Access prevents other app to connect and modify the DB, only 1 DBMS UI can connect at a time)
		
2. Run website application:
	2.1 Open index.html in any web browser
	2.2 Log in using id:"Group1" and password:"Group@1"
	2.3 Explore the Database:
		- Manager features: Showing Database table, add data, delete data
		- Patient features: single user info,  making appointment
