let isTabOpen = false;

var openContainer = document.getElementById("OpenContainer");
var openButton = document.getElementById("OpenButton");
var deezerContainer = document.getElementById("DeezerContainer");

// -------------------------------------------------------------------------------
// get on launch if the deezer tab is open
function DeezerTab(isOpen) {
  if (isOpen) {
    openContainer.style.display = "none";
    deezerContainer.style.display = "flex";
  } else {
    openContainer.style.display = "flex";
    deezerContainer.style.display = "none";
  }
}

function extractInfoFromString(inputString) {
  // Définir la regex pour le format "titre - artistes - deezer"
  const regex = /^(.*?)\s*-\s*(.*?)\s*-\s*Deezer$/;

  // Faire correspondre la regex avec la chaîne d'entrée
  const match = inputString.match(regex);

  if (match) {
    const title = match[1].trim();
    const artists = match[2].trim();

    return { title, artists };
  } else {
    console.error("Format de chaîne non valide");
    return null;
  }
}

function getTrackInfos(response) {
  console.log("response :", response);
  if (response) {
    document.getElementById("songTitle").innerHTML = response.title;
    document.getElementById("songArtist").innerHTML = response.artists;
  } else {
    console.error("No valid response received.");
  }
}

// -------------------------------------------------------------------------------

chrome.tabs.query({}, function (tabArray) {
  tabArray.forEach(function (tab) {
    if (tab.url.includes("deezer")) {
      DeezerTab(true);
    }
  });
});

openButton.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://deezer.com" });
  DeezerTab(true);
});

chrome.runtime.sendMessage({ button: "Trackinfo" }, (response) => {
  getTrackInfos(response);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab, changeInfo);
  if (tab.url.includes("deezer")) {
    var trackInfos = extractInfoFromString(tab.title);
    getTrackInfos(trackInfos);
  }
});

document.getElementById("PrevButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ button: "prevButton" }, (response) => {
    console.log(response);
  });
});
document.getElementById("PlayButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ button: "playButton" }, (response) => {
    console.log(response);
  });
});
document.getElementById("NextButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ button: "nextButton" }, (response) => {
    console.log(response);
  });
});

document.getElementById("volumeSlider").addEventListener("input", (e) => {
  chrome.runtime.sendMessage(
    { volume: e.target.value, slider: true },
    (response) => {
      console.log(response);
    }
  );
});
