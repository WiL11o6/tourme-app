/**
 * Registration and Login and Sessions are in here
 * 
 */
const express = require('express');
const db = require('../js/database');
const bcrypt = require('bcrypt');




exports.register = (req, res) => {
    console.log(req.body);

    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    //const ssn = req.body.ssn;
    //const dob = req.body.dob;
    //const stAddress = req.body.stAddress;
    //const city = req.body.city;
    //const state = req.body.state;
    //const zip = req.body.zip;
    
    // encrypting password
    bcrypt.hash(password, 10, (err, hash) => {
        // Tourist Registration
        db.query('INSERT INTO ApprovedTouristUser SET ?', {
            firstName: fname,
            lastName: lname,
            userName: username,
            password: hash,
            email: email
        }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
        });

        res.send(`
            <script>
            alert("You have successfully registered as a tourist. Please log in from the home page");
            window.location.href = "../html/signin.html";
            </script>
        `);
    });
};
        
    /*} else
    // Tour Guide Registration
    {
        db.query('INSERT INTO ApprovedTourGuideUser SET ?', {
            firstName: fname,
            lastName: lname,
            userName: username1,
            password: hash,
            email: email,
            ssn: ssn,
            dob: dob,
            stAddress: stAddress,
            city: city,
            state: state,
            zip: zip
        }, (err, results) => {
            if(err){
                console.log(err);
            }else {
                console.log(results);
            }
        })
        res.send(`
            <script>
            alert("You have successfully registered as a tour guide. Please log in from the home page");
            window.location.href = "/";
            </script>
        `);
        }*/
    
   

        exports.login = (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            let tourGuide_id;
    
            // Checking if username/password combination works for tourist account and creates a session
            db.query(
                "SELECT tourist_id, password FROM ApprovedTouristUser WHERE userName = ?;",
                [username],
                (err, result) => {
                    if (err){
                        res.send(err);
                    }
            
                    if (result.length > 0) {
                        bcrypt.compare(password, result[0].password, (error, response) =>{
                            if (response) {
                                req.session.username = username;
                                req.session.touristId = result[0].tourist_id;
                                console.log("TouristID is " + req.session.touristId)
                                
                                console.log("sessionid initialized in /login " + req.session.username);
                                res.send(`
                                    <script>
                                    alert("You have successfully logged in as a tourist. Click OK to continue");
                                    window.location.href = "/tourselection";
                                    </script>
                                `)
                                
                                
                            } else {
                                console.log(error)
                            }
                        })
                    } else{
                        // Checking if username/password combination works for tour guide account and creates a session
                        db.query(
                            "SELECT tourGuide_id, password FROM ApprovedTourGuideUser WHERE userName = ?;",
                            [username],
                            (err, result) => {
                                if (err){
                                    res.send(err);
                                }
                    
                                if (result.length > 0) {
                                    bcrypt.compare(password, result[0].password, (error, response) =>{
                                        if (response) {
                                            req.session.username = username;
                                            req.session.tourGuideId = result[0].tourGuide_id;
                                            console.log("TourGuideID is " + req.session.tourGuideId)
                                            console.log("sessionid initialized in /login " + req.session.username);
                                            res.send(`
                                                <script>
                                                alert("You have successfully logged in as a tour guide. Click OK to continue");
                                                window.location.href = "/guideprofile";
                                                </script>
                                            `);
                                            
                                            //tourist_id = results[0].tourist_id;
                                            //req.sessions.tourist_id = tourist_id;
                                        } else {
                                            res.send("Wrong username or password combo");
                                        }
                                    })
                                } else{
                                    res.send("No user found")
                                    
                                }
                                    
                            }
                        )
                        
                    }
                        
                }
            )
        }
    

    // Log out 
    exports.logout = (req, res) => {
        req.session.destroy((err) => {
            if (err){
                res.send("There was an error logging out")
            }
            else {
                res.redirect('/');
            }
        })
    }

    // Posting design own package
    exports.design = (req, res) => {
       
        const username = req.session.username;
        const city = req.body.city;
        const adults = req.body.adults;
        const children = req.body.children;
        const date = req.body.date;

        if (city === "location" || adults === "numAdults" || children ==="numChild" || date == '') {
                res.send(
                `<script>
                    alert("Please fill out all fields before continuing")
                    window.location.href = "/designTour";
                 </script>`
                );
          } else {
            db.query('INSERT INTO DesignTour SET ?', {
                username: username,
                city: city,
                adults: adults,
                children: children,
                date: date

            }, (err, results) => {
                if (err){
                    console.log(err)
                    res.redirect("/locationselection")
                }else {
                    res.redirect("/locationselection")
                }
            }
          )}

        console.log(city, adults, children, date)

    }

    exports.addlocation = (req, res) => {
        const username = req.session.username;
        const ggbridge = req.body.bridge;
        const fisher = req.body.fisher;
        const coit = req.body.coit;
    
        const locations = [ggbridge, fisher, coit].filter(Boolean);
        
        if (locations.length === 0) {
            console.log("No locations selected");
            return;
        }
        
        // query to make sure it's attached to same user when designing package
        db.query('SELECT location, location2 FROM DesignTour WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
    
            const currentLocations = results[0];
    
            // This array will hold all the location selections that users select in order
            const queryArray = [];
            // updateColumns will keep track of location and location2 columns in order of selection
            const updateColumns = [];
    
            let i = 0;
            while (i < locations.length && updateColumns.length < 2) {
                const location = locations[i];
    
                // Remove if the current location is already in the database and add to array maintaining same column order
                if (currentLocations.location === location) {
                    queryArray.push(null);
                    updateColumns.push('location');
                } else if (currentLocations.location2 === location) {
                    queryArray.push(null);
                    updateColumns.push('location2');
                } else if (!currentLocations.location && !updateColumns.includes('location')) {
                    queryArray.push(location);
                    updateColumns.push('location');
                } else if (!currentLocations.location2 && !updateColumns.includes('location2')) {
                    queryArray.push(location);
                    updateColumns.push('location2');
                }
    
                i++;
            }
    
            // Creating query string of location columns in db where values will be passed in, in same order with the queryArray values.
            const query = `
                UPDATE DesignTour
                SET ${updateColumns.map(locationColumn => `${locationColumn} = ?`).join(', ')}
                WHERE username = ?;
            `;
            
        
            queryArray.push(username);
    
            db.query(query, queryArray, (err, results) => {
                if (err) {
                    res.send(`
                        <script>
                        alert("You have already selected 2 locations, please continue to checkout to edit");
                        window.location.href = "/shopingcart2";
                        </script>
                    `);
                } else {
                    console.log("Added to database");
                }
            });
        });
    };


    exports.addpackage = (req, res) => {
        const username = req.session.username;
        const pack1 = req.body.package1;
        const pack2 = req.body.package2;
        const pack3 = req.body.package3;

        const locations = [pack1, pack2, pack3].filter(Boolean);

        if(locations.length === 0) {
            window.alert("No package selected");
            console.log("No Packages selected");
            return;
        }

        db.query('SELECT location, location2, location3 FROM TourPackage', (error, results) => {
            if(error) {
                console.log(error);
                return;
            }

            const currentPackages = results[0];
            const queryArray = []
            const updateColumns = []
            let item = 0;
            while (item < locations.length && updateColumns.length < 2) {
                const location = locations[i];

                if(currentPackages.location === location) {
                    queryArray.push(null);
                    updateColumns.push('package');
                } else if (currentPackages.location2 === location) {
                    queryArray.push(null);
                    updateColumns.push(`location2`);
                } else if (!currentPackages.location && !updateColumns.includes('location')) {
                    queryArray.push(location);
                    updateColumns.push('location');
                } else if (!currentPackages.location2 && !updateColumns.includes('location2')){
                    queryArray.push(location);
                    updateColumns.push('location2');
                }
                item++;
            }

            const query = `
            UPDATE TourPackage
            SET ${updateColumns.map(locationColumn => `${locationColumn} = ?`).join(', ')}
            WHERE username = ?;`;

            queryArray.push(username);

            db.query(query, queryArray, (error, results) => {
                if (err) {
                    res.send(`
                    <script>
                    alert("You have already selected 2 locations, please continue to checkout to edit");
                    window.location.href = "/shopingcart2";
                    </script>
                    `);
                } else {
                    console.log("Package added to database");
                }
            });
        });
    };
    
        
