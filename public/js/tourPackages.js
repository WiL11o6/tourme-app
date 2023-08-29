const URL = `/getTourPackages`
const availCardTemplate = document.querySelector("[data-avail-template]");
const availCardContainer = document.querySelector("[avail-cards-container]");
const cardContainer = document.getElementById('available-cards')

// to format the mysql DATE because it returns as Date: 2023-07-20T07:00:00.000Z format
// we want a 07-20-2023 format. Source Google Stackoverflow
function formatDate(dateString) {
   const date = new Date(dateString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${month}-${day}-${year}`;
 }

 // to format the mysql TIME() because it returns as Time: 14:30:00 military time to  return as
 // 2:30 pm format.  Source Google Stackoverflow
 function formatTime(timeString) {
   const [hour, minute] = timeString.split(':');
   const formattedHour = (hour % 12) || 12;
   const period = hour < 12 ? 'AM' : 'PM';
   return `${formattedHour}:${minute} ${period}`;
 }

// When availableTours.html page loads, it will fetch(/getTourPackage) url from routes/index.js with a GET request to the back end
// The router.get('/getTourPackages', (req, res) => function will return a response here. We will grab the data from the reponse
// JSON object to populate the front end with TourPackage data
fetch(URL)
.then(response => response.json())
.then(data => {
   data.forEach(item => {
      const card = availCardTemplate.content.cloneNode(true).children[0];
      const img = card.querySelector("[data-img]");
      const name = card.querySelector("[data-name]");
      const time = card.querySelector("[data-time]");
      const date = card.querySelector("[data-date]");
      const numTourists = card.querySelector("[data-num-tourists]");
      const location = card.querySelector("[data-location]");
      const accomodations = card.querySelector("[data-accomodations]");
      const duration = card.querySelector("[data-duration]");
      const price = card.querySelector("[data-price]");

      
      const formattedDate = formatDate(item.date);
      const formattedTime = formatTime(item.time);
         
      name.textContent = "Tour Package: " + item.tourPackageName;
      time.textContent = "Time: " + formattedTime;
      date.textContent = "Date: " + formattedDate;
      numTourists.textContent = "Number of Tourists: " + item.numTourists;
      location.textContent = "Location: " + item.location;
      accomodations.textContent = "Accomodations: " + item.accomodations;
      duration.textContent = "Duration: " + item.duration;
      price.textContent = "Price: $" + item.price;

      const imageElement = document.createElement("img");
      imageElement.src = `data:image/jpeg;base64,${item.image}`;
      img.append(imageElement);

      availCardContainer.append(card);
   })
   

})