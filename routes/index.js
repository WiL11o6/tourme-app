const express = require('express');
const path = require("path");
const router = express.Router();
const db = require('../js/database');
const multer = require('multer');
const upload = multer();




// Checks if tourist is logged in
async function checkLoggedInTourist(req, res, next) {
    let sessionID =  await req.session.username;
    if (sessionID && req.session.touristId) {
      console.log("sessionid check in app.js " + sessionID)
      console.log("tourist ID " + req.session.touristId)
      next()
    } else {
      console.log("sessionid check in app.js " + sessionID)
      res.send(`
        <script>
        alert("You have to be registered and logged in");
        window.location.href = "/";
        </script>
      `);
    }
  }

  // Checks if tour guide is logged in

  async function checkLoggedInTourGuide(req, res, next) {
    let sessionID =  await req.session.username;
    if (sessionID && req.session.tourGuideId) {
      console.log("sessionid check in app.js " + sessionID)
      console.log("tourguideId " + req.session.tourGuideId)
      next()
    } else {
      console.log("sessionid check in app.js " + sessionID)
      res.send(`
        <script>
        alert("You have to be registered and logged in");
        window.location.href = "/";
        </script>
      `);
    }
  }
  

// All logged in tourist routes
router.get('/tourselection', checkLoggedInTourist, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'tourselection.html'))
});

router.get('/register', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'registration.html'))
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'signin.html'))
});

router.get('/local', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'js', 'local.js'))
});

router.get('/userprofile', checkLoggedInTourist, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'userProfile.html'))
});

router.get('/designtour', checkLoggedInTourist, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'desginTour.html'))
});

router.get('/availablepackages', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'availiablePackages.html'))
});

router.get('/packageconfirmation', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'packageConformation.html'))
});

router.get('/locationselection', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'locationSelection.html'))
});

router.get('/shopingcart', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'shopingCart.html'))
});

router.get('/shopingcart2', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'shopingCart2.html'))
});

router.get('/touristcheckout', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'checkout.html'))
});

router.get('/touristconfirmation', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'confirmations.html'))
});

router.get('/tourschedule', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'tourSchedule.html'))
});

router.get('/tourguideselection', checkLoggedInTourist, (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'tourguideselections.html'))
});



// All logged in tour guide routes
router.get('/availabletours', checkLoggedInTourGuide, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'availiableTours.html'))
});
  
router.get('/guideprofile', checkLoggedInTourGuide, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'guideprofile.html'))
});
  
router.get('/scheduledtours', checkLoggedInTourGuide, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'scheduledtours.html'))
});

router.get('/confirmations', checkLoggedInTourGuide, (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'confirmations.html'))
});







// gets data from TourPackage table and responds with JSON objects
router.get('/getTourPackages', (req, res) => {
  const username = req.session.username;
  db.query('SELECT * FROM TourPackage', (err, results) => {
    if (err) {
      console.log(err);
    }
    const allResults = results.map(result => ({
      username: result.username,
      tourPackageId: result.tourPackage_id,
      tourPackageName: result.tourPackageName,
      image: result.image.toString('base64'),
      location: result.location,
      image2: result.image2.toString('base64'),
      location2: result.location2,
      //image3: result.image3.toString('base64'),
      //location3: result.location3,
      date: result.date,
      time: result.time,
      accomodations: result.accomodations,
      numTourists: result.numTourists,
      duration: result.duration,
      price: result.price,
    }));
    res.json(allResults);
  });
});

// gets data from desingtour table and responds with JSON objects
router.get('/getDesignedTour', (req, res) => {
  const username = req.session.username;
  db.query('SELECT * FROM DesignTour WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.log(err);
    }
    const allResults = results.map(result => ({
      username: result.username,
      city: result.city,
      adults: result.adults,
      children: result.children,
      date: result.date,
      location: result.location,
      location2: result.location2
    }));
    res.json(allResults);
  });
});

router.get('/search', (req, res) => {
  const searchQuery = req.query.q; // Get the search query from searchResult.js

  const queryString = `
    SELECT * FROM TourPackage
    WHERE tourPackageName LIKE ?
  `;

  const searchTerm = `%${searchQuery}%`; // Add '%' to search for any matches

  db.query(queryString, searchTerm, (err, results) => {
    if (err) {
      console.log(err);
    }
    const allResults = results.map(result => ({
      tourPackageName: result.tourPackageName,
      time: result.time,
      date: result.date,
      numTourists: result.numTourists,
      location: result.location,
      accomodations: result.accomodations,
      duration: result.duration,
      price: result.price,
      image: result.image.toString('base64') // convert from BLOB file
    }));

    console.log(allResults);
    res.json(allResults);
  });
});

// At the beginning of every refresh of /userprofile, it will check whether profile already exists in database
// and return to client to display.
router.get('/checkUserProfile', (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM userProfile WHERE tourist_username = ? LIMIT 1', [username], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const userProfile = result[0];
      if (userProfile) {
        // If user profile data exists, return true and the data object
        
        res.json({
          success: true,
          userProfile: {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            description: userProfile.description,
            photo: userProfile.photo.toString('base64')
          }
        });
      } else {
        res.json({ success: false, message: 'User profile not found.' });
      }
    }
  });
});


// saves create profile form data to database
router.post('/saveUserProfile', upload.single("photo"), (req, res) => {
  const username = req.session.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const description = req.body.description;
  const photo = req.file.buffer.toString('base64');

  db.query('INSERT INTO userProfile (tourist_username, firstName, lastName, description, photo) VALUES (?, ?, ?, ?, ?)', 
  [username, firstName, lastName, description, photo], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const allResults = { firstName, lastName, description, photo };
      res.json({ success: true, data: allResults });
    }
  });
});

// Allows user to edit profile
router.post('/editUserProfile', upload.single("photo"), (req, res) => {
  const username = req.session.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const description = req.body.description;
  const photo = req.file.buffer.toString('base64');

  // Update the userProfile table with the edited data
  db.query(
    'UPDATE userProfile SET firstName = ?, lastName = ?, description = ?, photo = ? WHERE tourist_username = ?',
    [firstName, lastName, description, photo, username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ success: false, message: 'error updating user profile.' });
      } else {
        const updatedData = { firstName, lastName, description, photo };
        res.json({ success: true, data: updatedData });
      }
    }
  );
});

router.get('/getUserProfilePhoto', (req, res) => {
  const username = req.session.username;

  db.query('SELECT photo FROM userProfile WHERE tourist_username = ? LIMIT 1', [username], (err, result) => {
    if (err) {
      console.log(err);
      res.json({ success: false, message: 'Error getting photo.' });
    } else {
      if (result.length > 0 && result[0].photo) {
        res.json(
          { success: true, 
            photo: result[0].photo.toString('base64') }
          );
      } else {
        res.json({ success: false, message: 'User profile photo not found.' });
      }
    }
  });
});

router.get('/removedesignedtour', (req, res) => {
  const username = req.session.username;

  db.query('SELECT * FROM DesignTour WHERE username = ? LIMIT 1', [username], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const designedTour = result[0];
      if (designedTour) {
        // If designedTour exists, remove tour, 
        
        db.query('DELETE FROM DesignTour WHERE username = ?', [username], (err, result) => {
          if (err) {
            console.log(err);
          }else {
            res.send("deleted successfully")
          }
        })
        
      } else {
        res.json({ success: false, message: 'User profile not found.' });
      }
    }
  });
});

/*document.querySelector('.search-bar').addEventListener('submit', function (event){
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
});*/

/*
router.get('/search', (req,res,next) => {
    let searchWord = req.query.search;
    if(!searchWord){
        res.send({
            resultsStatus: "info",
            message:"no search word given",
            results: []
        });
    }else{
        let baseSQL = "select * from search_bar \
        having input like ? or results like ?;";
        let sqlReadySearchWord = "%"+searchWord+"%";
        db.execute(baseSQL, [sqlReadySearchWord])
        .then(([results, fields]) => {
            if(results && results.length){
                res.sendFile(path.join(__dirname, '..', 'public', 'html', 'search.html'))
                res.send({
                    resultsStatus: "info",
                    message: `${results.length} results found`,
                    results: results
                })
            }else{
                db.query('select * from search_bar DESC LIMIT 10',[])
                .then(([results, fields]) => {
                    res.send({
                        resultsStatus:"info",
                        message:"no results found for you search, but here are your recent searches",
                        results: results
                    });
                })
            }
        })
        .catch((err) => next(err))
    }
})*/
    

module.exports = router;