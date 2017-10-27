console.debug(`I'm a service worker`);

this.addEventListener(`install`, event => {
  console.debug(`install event`);
});

this.addEventListener(`activate`, event => {
  console.debug(`activate event`);
});

this.addEventListener(`fetch`, event => {
  let { url } = event.request;

  console.debug(`fetch event, fetching ${url}`);
});
