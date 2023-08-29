const {
    createPool
} = require('mysql2');
const { Connection } = require('mysql2/typings/mysql/lib/Connection');

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
  });



document.querySelector('.search-bar').addEventListener('submit', function (event){
    event.preventDefault();

    const searchInput = document.querySelector('input[name="searchInput"]').value;

    console.log('Performing search for:', searchInput);
    db.query('SELECT input, results, concat_ws("", input, results) AS haystack From search_bar WHERE concat_ws("", input, results) LIKE ?', ['%' +searchInput + '%'], function (err, results) {
        if (err) {
            console.error('Error executing the query:', err);
            return;
        }

        const queryParams = new URLSearchParams({ searchInput, results: JSON.stringify(results) });
        window.location.href = 'search_results.html' + queryParams.toString();

       
    });
});
