// const mysql = require('mysql');
const app = require('./config/express-custom')();
const port = 3001;

// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'gabriel00',
//     database : 'nodejs2'
//   });


  

app.listen(port,function(){
    console.log(`Server card is running on port ${port}!`)
})