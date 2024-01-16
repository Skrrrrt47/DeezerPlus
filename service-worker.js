// Button Objects with their id for the scrapper
const prevButton = {
  name: "PrevButton",
  id: "previous_track_button",
};
const playButton = {
  name: "PlayButton",
  id: "play_button_pause",
  id2: "play_button_play",
};
const nextButton = {
  name: "NextButton",
  id: "next_track_button",
};

// ===============================================================================

import { click, slide, fetchTrack } from "./content.js";

// Function to execute a script in the context of the tab
function executeScript(tabId, message, f) {
  console.log("message :", message);
  chrome.scripting.executeScript({
    args: [message],
    target: { tabId: tabId }, // Tab ID of the current active tab
    function: f, // Function to be executed in the tab
  });
}

// Function to execute a script in the context of the tab and return the result
async function executeScriptWithResponse(tabId, f) {
  // async function here to get the result of the script
  var res = await chrome.scripting.executeScript({
    target: { tabId: tabId }, // Tab ID of the current active tab
    function: f, // Function to be executed in the tab
  });
  return res[0].result;
}

function getButton(name) {
  // return the button object from the name
  if (name == "prevButton") {
    return prevButton;
  } else if (name == "playButton") {
    return playButton;
  } else if (name == "nextButton") {
    return nextButton;
  } else return null;
}

// ===============================================================================

// Get the deezer tabId
chrome.tabs.query({}, function (tabArray) {
  tabArray.forEach(function (tab) {
    if (tab.url.includes("deezer")) {
      // Message sent from popup.js if the user interact with the popup
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("message received", message);
        if (message.button == "Trackinfo") {
          (async () => {
            // Get the track infos from the deezerTab and send it back to popup.js
            var track = await executeScriptWithResponse(tab.id, fetchTrack);
            sendResponse(track);
          })();

          return true;
        } else if (!!message.slider) {
          // If the user change the volume
          executeScript(tab.id, message.volume, slide);
          sendResponse("Volume changed");
        } else {
          // If the user click on a button
          executeScript(tab.id, getButton(message.button), click);
          sendResponse("Button clicked");
        }
      });

      // Action if a keyboard shortcut is pressed
      chrome.commands.onCommand.addListener((command) => {
        if (command == "play_and_pause_music") {
          executeScript(tab.id, playButton, click);
        } else if (command == "next_music") {
          executeScript(tab.id, nextButton, click);
        } else if (command == "previous_music") {
          executeScript(tab.id, prevButton, click);
        }
      });
    }
  });
});
