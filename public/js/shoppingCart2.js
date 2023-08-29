const URL = '/getDesignedTour';
const availCardTemplate = document.querySelector("[data-avail-template]");
const availCardContainer = document.querySelector("[avail-cards-container]");

fetch(URL)
.then(response => response.json())
.then(data => {
   data.forEach(item => {
      const card = availCardTemplate.content.cloneNode(true).children[0];
      const img = card.querySelector("[data-img]");
      const img2 = card.querySelector("[data-img2]");
      const username = card.querySelector("[data-username]");
      const city = card.querySelector("[data-city]");
      const adults = card.querySelector("[data-adults]");
      const children = card.querySelector("[data-children]");
      const date = card.querySelector("[data-date]");
      const location = card.querySelector("[data-location]");
      const location2 = card.querySelector("[data-location2]");

      username.textContent = item.username;
      city.textContent = item.city;
      adults.textContent = item.adults;
      children.textContent = item.children;
      date.textContent = item.date;
      location.textContent = item.location;
      location2.textContent = item.location2;

      // The images for location1 and location2 are in the tourPackage table
      fetch('/getTourPackages')
        .then(response => response.json())
        .then(data => {
          const image1 = document.createElement("img");
          const image2 = document.createElement("img");

          // look for a match in json object array and location that usr selected
          const imageLocation1 = data.find(data => data.location === item.location);
          image1.src = `data:image/jpeg;base64,${imageLocation1.image}`;
          img.appendChild(image1);
          

         
          const imageLocation2 = data.find(data => data.location === item.location2);
          image2.src = `data:image/jpeg;base64,${imageLocation2.image}`;
          img2.appendChild(image2);
          //img2.removeChild(image2);        How to remove
          
        });

      availCardContainer.append(card);
   });
});

function removeDesignedTour() {
  console.log("I am in remove design tour");
  fetch("/removedesignedtour")
  .then(data => {
    // Show alert and redirect
    return Swal.fire({
      title: 'Successfully removed tour package',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: "#FF8E0A"
    });
  })
  .then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/tourselection";
    }
  })
    .catch(error => {
      console.error("Error removing designed tour:", error);
    });
}