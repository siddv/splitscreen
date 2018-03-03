<template>
  <div id="app">

    <div class="site-wrap">
      <input
        class="site-entry"
        type="text"
        placeholder="Enter website here and press 'enter'"
        @keyup.enter="updateSites"
        v-model="userInput.left">

      <iframe 
        class="site"
        v-if="sites.left"
        :src="sites.left">
      </iframe>
    </div>

    <div class="site-wrap">
      <input
        class="site-entry"
        type="text"
        placeholder="Enter website here and press 'enter'"
        @keyup.enter="updateSites"
        v-model="userInput.right">

      <iframe
        class="site"
        v-if="sites.right"
        :src="sites.right">
      </iframe>
    </div>

  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      userInput: {
        left: '',
        right: ''
      },
      sites: {
        left: '',
        right: ''
      }
    }
  },
  mounted () {
    
    chrome.storage.sync.get('sites', (data) => {

      if(data.sites) {

        this.sites.left = data.sites.left;
        this.userInput.left = data.sites.left;
  
        this.sites.right = data.sites.right;
        this.userInput.right = data.sites.right;

        this.addListeners();

      }

    })

  },
  methods: {
    /**
     * Nullifies x-frame-options headers to allow iframe injection
     * @param details details of the HTTP request
     */
    onHeadersReceived (details) {

      if(details.initiator != window.location.origin) {
        return;
      }

      for (let index in details.responseHeaders) {

        let header = details.responseHeaders[index];

        if (header.name.toLowerCase() == 'x-frame-options' ||
            header.name.toLowerCase() == 'frame-ancestors') {

          details.responseHeaders.splice(index, 1);
          return {
            responseHeaders: details.responseHeaders
          };
        }
      }
    },

    /**
     * Adds the header listeners when the sites update
     */
    addListeners () {

      for (let site in this.sites) {
        if(this.sites[site]) {
          chrome.webRequest.onHeadersReceived.addListener(
            this.onHeadersReceived,
            { urls: [this.sites[site]] },
            [ "blocking", "responseHeaders" ]
          );
        }
      }
    },

    /**
     * Update the sites when changed by the user
     */
    updateSites (event) {

      event.preventDefault();

      for (let site in this.sites) {
        if(this.sites[site]) {
          chrome.webRequest.onHeadersReceived.removeListener(
            this.onHeadersReceived,
            { urls: [this.sites[site]] },
            [ "blocking", "responseHeaders" ]
          );
        }
      }

      chrome.storage.sync.set({
        sites: {
          left: this.userInput.left,
          right: this.userInput.right
        },
      }, (data) => {
  
        this.sites.left = this.userInput.left;
        this.sites.right = this.userInput.right;

        this.addListeners();
  
      });

    }
  }
}
</script>

<style>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.site-wrap {
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
}

.site-entry {
  font-size: 16px;
  padding: 8px;
}

.site {
  border: 0;
  flex-grow: 1;
}
</style>
