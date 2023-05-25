var searchInput = document.getElementById("search-input");
var includeImagesCheckbox = document.getElementById("image-checkbox");
var resultsContainer = document.getElementById("results");
var prevButton = document.getElementById("prev-button");
var nextButton = document.getElementById("next-button");

var searchQuery = "";
var currentPage = 1;
var totalResults = 0;
var resultsPerPage = 10;

function search() {
    searchQuery = searchInput.value;
    currentPage = 1;
    performSearch();
}

function performSearch() {
    var includeImages = includeImagesCheckbox.checked;
    var startIndex = (currentPage - 1) * resultsPerPage + 1;

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Perform search
    performSearchRequest(searchQuery, includeImages, startIndex)
        .then(function(data) {
            displayResults(data);
            updateNavigationButtons();
        })
        .catch(function(error) {
            console.log("Error:", error);
        });
}

function performSearchRequest(query, includeImages, startIndex) {
    var apiKey = "AIzaSyAZmRMINN9hMq7U_8FdwFP4rxPn8rutpzs"; // Ganti dengan API key Google Custom Search Anda
    var searchEngineId = "177d3948ae59447e9"; // Ganti dengan ID mesin pencarian Google Anda

    var url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&start=${startIndex}`;

    if (includeImages) {
        url += "&searchType=image";
    }

    return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return response.json();
        });
}

function displayResults(data) {
    if (data.items) {
        data.items.forEach(function(item) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = item.link;
            a.textContent = item.title;
            li.appendChild(a);

            if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
                var img = document.createElement("img");
                img.src = item.pagemap.cse_image[0].src;
                li.appendChild(img);
            }

            var p = document.createElement("p");
            p.textContent = item.snippet;
            li.appendChild(p);

            resultsContainer.appendChild(li);
        });
    }

    if (data.queries && data.queries.request && data.queries.request.length > 0) {
        totalResults = parseInt(data.queries.request[0].totalResults);
    } else {
        totalResults = 0;
    }
}

function updateNavigationButtons() {
    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if ((currentPage * resultsPerPage) >= totalResults) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function prevPage() {
    currentPage--;
    performSearch();
}

function nextPage() {
    currentPage++;
    performSearch();
}