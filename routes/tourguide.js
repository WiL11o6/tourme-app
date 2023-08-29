const express = require('express');
const router = express.Router();
const db = require('../js/database');

router.get('/selectTourGuide', (req, res) => {
    db.query('SELECT * FROM TourMeDB.ApprovedTourGuideUser', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        const tourGuides = results;

        res.render('selectTourGuide', { tourGuides });
    });
});

router.post('/selectTourGuide', (req, res) => {
    const { tourGuideId } = req.body;

    db.query(
        'INSERT INTO DesignTour (tour_guide_id, tour_guide_name, years_with_tour_me, joined_date, tour_guide_details) VALUES (?, ?, ?, ?, ?)',
        [tourGuideId, tourGuideName, yearsWithTourMe, joinedDate, tourGuideDetails],
        (err, result) => {
            if (err) {
                console.error('Error selecting tour guide:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('Tour guide selected and saved to the database.');
            res.sendStatus(200);
        }
    );

    req.session.selectedTourGuideId = tourGuideId;

    res.redirect('/tourguideselections.html');
});

module.exports = router;