const searchInput = document.getElementById('search-text');
const searchButton = document.getElementById('search-button');

function search() {
    const searchQuery = searchInput.value;

    // The encodedURIComeponet wraps the searchQuery so that when a user searches with weird symbols like
    // &, %, $, it wouldn't break the search function and cause an error
    fetch(`/search?q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            // Redirect to searchResults.html with the search query as a URL parameter
            window.location.href = `../html/searchResult.html?q=${encodeURIComponent(searchQuery)}`;
        })
        .catch(error => {
            console.error('Error during search:', error);
        });
}

// event listener for click
searchButton.addEventListener('click', function (event) {
  search();
});

// event listener for enter
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        search();
        event.preventDefault();
    }
});


