// When the user profile page loads, we check to see if the user has already made a profile by
// checking our database userProfile table. If it exists, then display the data. If it doesn't, then display
// the profile creation form.
window.addEventListener("load", function () {
    console.log("checking if db user table exists");
    fetch("/checkUserProfile")
      .then(response => response.json())
      .then(result => {
        console.log("here's the results: ", result);
        if (result.success) {
          console.log("Sending data to displayUserProfile()", result.tourist_username)
          displayUserProfile(result.userProfile);
        }else{
            document.getElementById("userProfileForm").style.display = "block";
        }
      })
      .catch(error => {
        console.error("Error getting user profile:", error);
      });
  });

// The form to create profile. After the form is submitted to the database, it will hide itself
// and display the user profile
document.getElementById("userProfileForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const description = document.getElementById("description").value;
  const photo = document.getElementById("photo").files[0];

  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("description", description);
  formData.append("photo", photo);

  // Check if the user profile exists
  fetch("/checkUserProfile")
      .then(response => response.json())
      .then(result => {
          if (result.success) {
              // If the user profile exists the form submit will fetch /editUserProfile which "UPDATE" db
              fetch("/editUserProfile", {
                  method: "POST",
                  body: formData
              })
                  .then(response => response.json())
                  .then(result => {
                      if (result.success) {
                          displayUserProfile(result.data);
                          location.reload();
                          document.getElementById("userProfileDisplay").style.display = "block";
                          document.getElementById("userProfileForm").style.display = "none";
                      }
                  })
                  .catch(error => {
                      console.error("Error updating user profile:", error);
                  });
          } else if (!result.success){
              // If the user profile does not exist, create new profile by "INSERT" into db, and hide form, and display new profile
              fetch("/saveuserprofile", {
                  method: "POST",
                  body: formData
              })
                  .then(response => response.json())
                  .then(result => {
                      if (result.success) {
                          displayUserProfile(result.data);
                          location.reload();
                          document.getElementById("userProfileDisplay").style.display = "block";
                          document.getElementById("userProfileForm").style.display = "none";
                      }
                  })
                  .catch(error => {
                      console.error("Error saving user profile:", error);
                  });
          } else {
            displayUserProfile(result.data);
          }
      })
      .catch(error => {
          console.error("Error checking user profile:", error);
      });
});


// The HTML element to display the user profile data passed in
function displayUserProfile(data) {
  console.log("I AM IN DISPLAY USER PROFILE: ", data.firstName);
  const userProfileDisplay = document.getElementById("userProfileDisplay");
  userProfileDisplay.style.display = "block";

  // Decode the base64 photo data
  const profilePicture = atob(data.photo);

  const photoElement = document.createElement("img");
  photoElement.src = `data:image/jpeg;base64,${profilePicture}`;

  // Set the innerHTML of userProfileDisplay
  userProfileDisplay.innerHTML = `
    <div class="profilePicture">${photoElement.outerHTML}</div>
    <div><strong>Name: </strong>${data.firstName} ${data.lastName}</div>
    <div><strong>About Me: </strong>${data.description}</div>
    <div>
        <button type="button" class="edit-button" onclick="editProfile()">Edit</button>
    </div>`;

  
  }


function editProfile() {
    // Hide the display and show the form
    document.getElementById("userProfileForm").style.display = "block";
    document.getElementById("userProfileDisplay").style.display = "none";
  
    // Fetch the user profile data from the server
    fetch("/checkUserProfile")
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log("Success!")
        }
      })
      .catch(error => {
        console.error("Error getting user profile", error);
      });
  }
