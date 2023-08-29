function executeSearch() {
    let searchWord = document.getElementById('search-text').value;
    if(!searchWord){
        location.replace('file:///Users/andrelavilla/Desktop/csc648-848-01-sw-engineering-ummer-2023-T03/application/prototypes/horizontalPrototype/HomePage/index.html');
        return;
    }
    let mainPage = document.getElementById('main-page');
    let searchURL = `file:///Users/andrelavilla/Desktop/csc648-848-01-sw-engineering-ummer-2023-T03/application/prototypes/horizontalPrototype/HomePage/routes/index.js/search?search=${searchWord}`;
    fetch(searchURL)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => console.log(err));
    location.replace(searchURL);
    
}


let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}