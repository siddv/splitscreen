<template>
  <div id="app">
    <div class="panes">
      <Pane
        v-for="(site, index) in sites"
        :style="{flexBasis: `${100 / sites.length}%`}"
        :key="index"
        :url="site.url"
        @urlChanged="updateSites($event, index)"
        @remove="updateSites(index)"
      />
    </div>
  </div>
</template>

<script>
import Pane from './components/Pane.vue';

export default {
  name: 'app',
  components: {
    Pane,
  },
  data() {
    return {
      sites: [
        {
          url: '',
        },
        {
          url: '',
        },
      ],
    };
  },
  mounted() {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(['sites', 'replaceNewTab', 'hasSeenUpdateAlert'], (data) => {
      if (data.sites) {
        // Migrate users from the old data structure
        if (data.sites.left !== undefined || data.sites.right !== undefined) {
          if (data.sites.left !== undefined) {
            this.updateSites(data.sites.left, 0);
          }
          if (data.sites.right !== undefined) {
            this.updateSites(data.sites.right, 1);
          }
        }

        if (Array.isArray(data.sites)) {
          data.sites.forEach((site, index) => {
            this.sites[index].url = site.url;
          });
        }
        this.addListeners();
      }

      if (!data.hasSeenUpdateAlert) {
        alert('This extension has been updated! You can now open the split view by clicking on the extension icon. You can also customize whether or not it opens in a new tab in the options page - just right click the extension icon and hit "Options"');
        chrome.storage.sync.set({hasSeenUpdateAlert: true});
      }
    });
  },
  methods: {
    /**
     * Purges headers that would prevent iframe injection
     * @param details details of the HTTP request
     * @return {object}
     */
    onHeadersReceived(details) {
      if (details.initiator !== window.location.origin) {
        return {};
      }
      const customHeaders = details.responseHeaders;
      const headerKeys = Object.keys(customHeaders);

      headerKeys.forEach((index) => {
        const header = customHeaders[index];
        if (header
          && header.name
          && (header.name.toLowerCase() === 'x-frame-options'
          || header.name.toLowerCase() === 'frame-ancestors'
          || header.name.toLowerCase() === 'content-security-policy')) {
          customHeaders.splice(index, 1);
        }
      });

      return {
        responseHeaders: customHeaders,
      };
    },

    /**
     * Adds the header listeners when the sites update
     */
    addListeners() {
      this.sites.forEach((site) => {
        if (site.url) {
          // eslint-disable-next-line no-undef
          chrome.webRequest.onHeadersReceived.addListener(
            this.onHeadersReceived,
            { urls: [site.url] },
            ['blocking', 'responseHeaders'],
          );
        }
      });
    },

    /**
     * Update the sites when changed by the user
     */
    updateSites(newUrl, index) {
      const oldUrl = this.sites[index].url;

      if (oldUrl) {
        // eslint-disable-next-line no-undef
        chrome.webRequest.onHeadersReceived.removeListener(
          this.onHeadersReceived,
          { urls: [oldUrl] },
          ['blocking', 'responseHeaders'],
        );
      }

      this.sites[index].url = newUrl;

      // eslint-disable-next-line no-undef
      chrome.storage.sync.set({
        sites: this.sites,
      }, () => {
        this.addListeners();
      });
    },
  },
};
</script>

<style>

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
}

.panes {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.site-wrap {
  display: flex;
  flex-direction: column;
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
