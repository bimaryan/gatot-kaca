var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");
var videoContainer = document.getElementById("video-results");
var trendingButton = document.getElementById("trending-button");

searchButton.addEventListener("click", function () {
    var searchQuery = searchInput.value;
    searchVideos(searchQuery);
});

trendingButton.addEventListener("click", function () {
    searchVideos("trending");
});

function searchVideos(query) {
    // Clear previous results
    videoContainer.innerHTML = "";

    var apiKey = "AIzaSyC6tjN2s6SfdOF-iyGUOaQXtpfE1-hJvhQ";
    var url;

    if (query === "trending") {
        url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&key=" + apiKey;
    } else {
        url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=" + encodeURIComponent(query) + "&key=" + apiKey;
    }

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return response.json();
        })
        .then(function (data) {
            displayVideos(data.items);
        })
        .catch(function (error) {
            console.log("Error:", error);
        });
}

function displayVideos(videos) {
    var videoResults = document.getElementById("video-results");
    videoResults.innerHTML = ""; // Menghapus hasil video sebelumnya (jika ada)

    videos.forEach(function (video) {
        var videoElement = document.createElement("div");
        videoElement.classList.add("video");

        var videoIframe = document.createElement("iframe");
        videoIframe.src = "https://www.youtube.com/embed/" + video.id.videoId;
        videoIframe.width = "560";
        videoIframe.height = "315";
        videoIframe.allowFullscreen = true;

        var titleElement = document.createElement("h5");
        titleElement.textContent = video.snippet.title;

        var downloadButton = document.createElement("a");
        downloadButton.textContent = "Download";
        downloadButton.href = "https://www.ssyoutube.com/embed/" + video.id.videoId; // Ubah dengan URL pengunduhan yang sesuai

        videoElement.appendChild(videoIframe);
        videoElement.appendChild(titleElement);
        videoElement.appendChild(downloadButton);

        videoResults.appendChild(videoElement);
    });
}

function getVideoId(url) {
    var videoId = "";
    var matches = url.match(/[?&]v=([^&]+)/i);
    if (matches && matches.length > 1) {
        videoId = matches[1];
    }
    return videoId;
}