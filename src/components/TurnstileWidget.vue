<template>
  <div class="turnstile-container">
    <div ref="turnstileWidget"></div>
  </div>
</template>

<script>
export default {
  name: 'TurnstileWidget',
  props: {
    siteKey: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      widgetId: null
    }
  },
  methods: {
    initTurnstile() {
      if (window.turnstile) {
        this.widgetId = window.turnstile.render(this.$refs.turnstileWidget, {
          sitekey: this.siteKey,
          theme: this.theme,
          callback: (token) => {
            this.$emit('turnstile-success', token);
          }
        });
      } else {
        // Retry after a short delay if turnstile is not loaded yet
        setTimeout(() => this.initTurnstile(), 100);
      }
    }
  },
  mounted() {
    this.initTurnstile();
  },
  beforeUnmount() {
    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
    }
  }
}
</script>

<style scoped>
.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>
