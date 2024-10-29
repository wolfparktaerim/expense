<template>
    <span ref="counterRef" :class="{ 'number-highlight': isAnimating, 'number-final': isCompleted }">
      {{ displayValue }}
    </span>
  </template>
  
  <script>
  export default {
    name: 'NumberCounter',
    
    props: {
      endValue: {
        type: [Number, String],
        required: true
      },
      duration: {
        type: Number,
        default: 2000
      },
      decimals: {
        type: Number,
        default: 1
      },
      suffix: {
        type: String,
        default: ''
      },
      delay: {
        type: Number,
        default: 0
      }
    },
  
    data() {
      return {
        displayValue: 0,
        animationFrame: null,
        startTime: null,
        observer: null,
        isAnimating: false,
        isCompleted: false
      }
    },
  
    methods: {
      animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp
        const progress = timestamp - this.startTime
        
        if (progress < this.duration) {
          const value = this.easeOutQuad(progress, 0, parseFloat(this.endValue), this.duration)
          this.displayValue = Number(value).toFixed(this.decimals) + this.suffix
          this.isAnimating = true
          this.animationFrame = requestAnimationFrame(this.animate)
        } else {
          this.displayValue = this.endValue + this.suffix
          this.isAnimating = false;
          this.isCompleted = true;
        }
      },
  
      easeOutQuad(t, b, c, d) {
        t /= d
        return -c * t * (t - 2) + b
      },
  
      startAnimation() {
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame)
        }
        setTimeout(() => {
          this.startTime = null;
          this.isCompleted = false;
          this.animationFrame = requestAnimationFrame(this.animate)
        }, this.delay)
      },
  
      initObserver() {
        this.observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              this.startAnimation()
              this.observer.disconnect()
            }
          },
          { 
            threshold: 0.5,  // Increased threshold to start earlier
            rootMargin: '50px' // Start animation slightly before element comes into view
          }
        )
  
        if (this.$refs.counterRef) {
          this.observer.observe(this.$refs.counterRef)
        }
      }
    },
  
    watch: {
      endValue() {
        this.startAnimation()
      }
    },
  
    mounted() {
      this.initObserver()
    },
  
    beforeUnmount() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
      }
      if (this.observer) {
        this.observer.disconnect()
      }
    }
  }
  </script>
  
  <style scoped>
  .number-highlight {
    transition: color 0.3s ease;
    color: #b995f7; /* Purple color when animating */
  }
  .number-final {
    color: #7c3aed; /* Purple color for final state */
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  </style>