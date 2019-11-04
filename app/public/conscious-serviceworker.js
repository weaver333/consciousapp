const CACHE = "conscious-cache";
const precacheFiles = [
  /* Add an array of files to precache for your app */
  /* all styles */
  '/assets/css/login.css',
  '/assets/css/main.css',
  '/assets/css/styles.css',
  /* all fonts*/
  '/assets/fonts/manrope/manrope-bold.woff',
  '/assets/fonts/manrope/manrope-extrabold.woff',
  '/assets/fonts/manrope/manrope-light.woff',
  '/assets/fonts/manrope/manrope-medium.woff',
  '/assets/fonts/manrope/manrope-regular.woff',
  '/assets/fonts/manrope/manrope-semibold.woff',
  '/assets/fonts/manrope/manrope-thin.woff',
  '/assets/fonts/icon/icon.woff',
  /* all images */
  '/assets/images/achievements-icon.png',
  '/assets/images/anger.png',
  '/assets/images/anxiety.png',
  '/assets/images/banner1.jpg',
  '/assets/images/bg-map.jpg',
  '/assets/images/blake.png',
  '/assets/images/breath.png',
  '/assets/images/fac.png',
  '/assets/images/fit.png',
  '/assets/images/google.png',
  '/assets/images/heart.svg',
  '/assets/images/icon-back.png',
  '/assets/images/icon-build.png',
  '/assets/images/icon-monitor.png',
  '/assets/images/icon-shop.png',
  '/assets/images/indianawave.jpg',
  '/assets/images/insomnia.png',
  '/assets/images/logo.png',
  '/assets/images/LogoBlue.png',
  '/assets/images/Meditation-bg.jpg',
  '/assets/images/nav-logo.png',
  '/assets/images/Particle Asset.png',
  '/assets/images/Particles@2x.png',
  '/assets/images/pattern.png',
  '/assets/images/pattern@2x.png',
  '/assets/images/pay-per-click.svg',
  '/assets/images/profile-pic.jpg',
  '/assets/images/protection.svg',
  '/assets/images/question-icon.png',
  '/assets/images/revolution-icon.png',
  '/assets/images/stats-icon.png',
  '/assets/images/step-2-image.png',
  '/assets/images/stress.png',
  '/assets/images/subscribe-bg.jpg',
  '/assets/images/worlwide.svg',
  /*js*/
  '/assets/js/lib/opencv4.1.1.js',
  '/assets/js/after-session.js',
  '/assets/js/auth.js',
  '/assets/js/billing.js',
  '/assets/js/dashboard.js',
  '/assets/js/forgot-password.js',
  '/assets/js/heart-monitor.js',
  '/assets/js/login-confirm.js',
  '/assets/js/monitor.js',
  '/assets/js/notifications.js',
  '/assets/js/plan.js',
  '/assets/js/session-new.js',
  '/assets/js/session-stats.js',
  '/assets/js/session.js',
  '/assets/js/sign-in.js',
  '/assets/js/sign-up.js',
  '/assets/js/stats.js',
  '/assets/js/subscribe.js',
  '/assets/js/user.js',
  '/assets/js/welcome.js',
  /* haar cascades for detection */
  '/haarcascade_frontalface_default.xml'
];

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "/";

const networkFirstPaths = [
  /* Add an array of regex of paths that should go network first */
  // Example: /\/api\/.*/
];

const avoidCachingPaths = [
  /* Add an array of regex of paths that shouldn't be cached */
  // Example: /\/api\/.*/
];

function pathComparer(requestUrl, pathRegEx) {
  return requestUrl.match(new RegExp(pathRegEx));
}

function comparePaths(requestUrl, pathsArray) {
  if (requestUrl) {
    for (let index = 0; index < pathsArray.length; index++) {
      const pathRegEx = pathsArray[index];
      if (pathComparer(requestUrl, pathRegEx)) {
        return true;
      }
    }
  }

  return false;
}

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");

      return cache.addAll(precacheFiles).then(function () {
        if (offlineFallbackPage === "ToDo-replace-this-name.html") {
          return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
        }

        return cache.add(offlineFallbackPage);
      });
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  if (comparePaths(event.request.url, networkFirstPaths)) {
    networkFirstFetch(event);
  } else {
    cacheFirstFetch(event);
  }
});

function cacheFirstFetch(event) {
  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            // The following validates that the request was for a navigation to a new document
            if (event.request.destination !== "document" || event.request.mode !== "navigate") {
              return;
            }

            console.log("[PWA Builder] Network request failed and no cache." + error);
            // Use the precached offline page as fallback
            return caches.open(CACHE).then(function (cache) {
              cache.match(offlineFallbackPage);
            });
          });
      }
    )
  );
}

function networkFirstFetch(event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));
        return response;
      })
      .catch(function (error) {
        console.log("[PWA Builder] Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
}

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return error page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  if (!comparePaths(request.url, avoidCachingPaths)) {
    return caches.open(CACHE).then(function (cache) {
      return cache.put(request, response);
    });
  }

  return Promise.resolve();
}
