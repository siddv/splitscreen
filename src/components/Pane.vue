<template>
 <div class="site-wrap">
    <input
      class="site-entry"
      type="text"
      placeholder="Enter website here and press 'enter'"
      @keyup.enter="fireUpdate"
      v-model="userInput">

    <iframe
      class="site"
      v-if="url"
      :src="url">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'Pane',
  props: {
    url: String,
  },
  data() {
    return {
      userInput: '',
    };
  },
  mounted() {
    this.userInput = this.url;
  },
  methods: {
    fireUpdate() {
      this.$emit('urlChanged', this.userInput);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
