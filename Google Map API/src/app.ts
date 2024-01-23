// Code goes here!
import axios from "axios";
const formElement = document.querySelector("form")!;
const inputElement = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_KEY = "AIzaSyAN41hj3EuMBAUOVQKyqbZau3jxCM1jNf4";
// declare var google: any;
function submitHandler(event: Event) {
  event.preventDefault();
  const address = inputElement.value;
  console.log(address);
  axios
    .get<{
      results: { geometry: { location: { lat: number; lng: number } } }[];
      status: "OK" | "ZERO_RESULTS";
    }>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        address
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((data) => {
      if (data.data.status !== "OK") {
        throw new Error("Could not get the data");
      }
      // console.log(data.data.results[0].geometry.location);
      const geo = data.data.results[0].geometry.location;
      console.log(geo);
      let map: google.maps.Map;
      async function initMap(): Promise<void> {
        // const position = { lat: -25.344, lng: 131.031 };

        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        map = new Map(document.getElementById("map") as HTMLElement, {
          center: geo,
          zoom: 8,
          mapId: "DEMO_MAP_ID",
        });

        new AdvancedMarkerElement({
          map: map,
          position: geo,
        });
      }

      initMap();
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}
formElement.addEventListener("submit", submitHandler);
