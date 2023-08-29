const availCardTemplate = document.querySelector("[data-avail-template]");
const availCardContainer = document.querySelector("[avail-cards-container]");
const cardContainer = document.getElementById('available-cards')
const searchQuery = new URLSearchParams(window.location.search).get('q');

// to format the mysql DATE because it returns as Date: 2023-07-20T07:00:00.000Z format
// we want a 07-20-2023 format. Found on stackoverflow
function formatDate(dateString) {
   const date = new Date(dateString);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${month}-${day}-${year}`;
 }

 // to format the mysql TIME() because it returns as Time: 14:30:00 military time to  return as
 // 2:30 pm format. Found from on stackoverflow
 function formatTime(timeString) {
   const [hour, minute] = timeString.split(':');
   const formattedHour = (hour % 12) || 12;
   const period = hour < 12 ? 'AM' : 'PM';
   return `${formattedHour}:${minute} ${period}`;
 }


fetch(`/search?q=${searchQuery}`)
.then(response => response.json())
.then(data => {
    console.log(data);
     if (data.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Sorry, no were results found';
      noResultsMessage.classList.add('no-results');
      availCardContainer.appendChild(noResultsMessage);
    } else {
      // Loop through each found object from db and add values to the HTML template from searchResults.html
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
}
   

})