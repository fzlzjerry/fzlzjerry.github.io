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
    },
    retry: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      widgetId: null,
      retryCount: 0
    }
  },
  methods: {
    initTurnstile() {
      if (this.retryCount >= this.retry) {
        this.$emit('turnstile-error', 'Failed to load Turnstile after multiple attempts');
        return;
      }

      if (window.turnstile) {
        try {
          this.widgetId = window.turnstile.render(this.$refs.turnstileWidget, {
            sitekey: this.siteKey,
            theme: this.theme,
            callback: (token) => {
              this.$emit('turnstile-success', token);
            },
            'error-callback': () => {
              this.$emit('turnstile-error', 'Verification failed');
            },
            'timeout-callback': () => {
              this.$emit('turnstile-error', 'Verification timed out');
              this.resetWidget();
            }
          });
        } catch (error) {
          this.$emit('turnstile-error', error.message);
        }
      } else {
        this.retryCount++;
        setTimeout(() => this.initTurnstile(), 500);
      }
    },
    resetWidget() {
      if (this.widgetId && window.turnstile) {
        window.turnstile.reset(this.widgetId);
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
  width: 100%;
}
</style>
