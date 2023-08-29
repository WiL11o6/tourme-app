const mysql = require('mysql2');
const fs = require('fs');

 const {
    createPool
} = require('mysql2');

const db = createPool({
    host: 'tourmetoday.co',    
    user: 'myuser',       
    password: 'mypass', 
    database: 'TourMeDB',   
  });

  db.getConnection((err) => {
    if(err){
      console.log(err);
    } else{
      console.log("Database Connected");
    }
  })

  module.exports = db;
  
  /*db.query(`select * from ApprovedTourGuideUser`, (err, result, field)=>{
    if(err){
      return console.log(err);
    }
    return console.log(result);
  })*/

  /*const imagePath = 'public\\images\\palace.jpg';


fs.readFile(imagePath, (err, imageData) => {
  if (err) {
    console.error('Error reading image:', err);
    return;
  }

  
  const sql = `UPDATE TourPackage SET image = ? WHERE tourPackage_id = 4`;

  
  db.query(sql, [imageData], (err, result) => {
    if (err) {
      console.error('Error updating image:', err);
    } else {
      console.log('Image updated successfully.');
    }
    
  
  });
});*/