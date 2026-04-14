import { register } from "register-service-worker";
import { Workbox } from "workbox-window";

register(`${import.meta.env.BASE_URL}service-worker.js`, {
  ready() {
    console.log("Service worker is active.");
  },
  registered(registration) {
    console.log("Service worker has been registered.");
    const wb = new Workbox("/service-worker.js");
    wb.addEventListener("activated", () => {
      console.log("Service worker activated.");
    });
    wb.register();
  },
  cached() {
    console.log("Content has been cached for offline use.");
  },
  updatefound() {
    console.log("New content is downloading.");
  },
  updated(registration) {
    console.log("New content is available.");
    const answer = window.confirm(
      "A new version of the app is available. Do you want to update?"
    );
    if (answer && registration.waiting) {
      registration.waiting.postMessage("skipWaiting");
    }
  },
  offline() {
    console.log("No internet connection found. App is running in offline mode.");
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});
