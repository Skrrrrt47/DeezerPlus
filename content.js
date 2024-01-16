// Scrape the function to find the button and click it
export function click(button) {
  const but = document.querySelector(`[data-testid="${button.id}"]`);
  if (but) {
    but.click();
  } else {
    const button2 = document.querySelector(`[data-testid="${button.id2}"]`);
    if (button2) {
      button2.click();
    }
  }
}

// Scrape the function to find the slider volume and slide it
export async function slide(volume, buttonId, volumeSlider) {
  const buttonElement = document.querySelector(`[data-testid="${buttonId}"]`);
  if (buttonElement) {
    buttonElement.dispatchEvent(
      new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    await setTimeout(() => {}, 100);
    console.log("volume", volume);
    console.log(
      "test : ",
      document.querySelector(`[data-testid="${volumeSlider}"]`).value
    );
    document.querySelector(`[data-testid="${volumeSlider}"]`).value = volume;
    const volumeSliderElement = document.querySelector(
      `[data-testid="${volumeSlider}"]`
    );
    volumeSliderElement.dispatchEvent(new Event("change", { bubbles: true }));
    await setTimeout(() => {}, 100);
    buttonElement.dispatchEvent(
      new MouseEvent("mouseout", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  } else {
    console.error(`Button with ID '${buttonId}' not found.`);
  }
}

// Scrape the function to find the track infos and return it
export function fetchTrack() {
  const trackTitle = document.querySelector(
    "#page_player > div > div.css-w7wtb1 > div.css-dsap3z > div > div.css-70qvj9 > div > div > div > p > a"
  );
  const trackArtists = document.querySelector(
    "#page_player > div > div.css-w7wtb1 > div.css-dsap3z > div > div.marquee > div > div > p > a"
  );
  return {
    title: trackTitle.innerText,
    artists: trackArtists.innerText,
  };
}
