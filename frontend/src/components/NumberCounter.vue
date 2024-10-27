<template>
    <span ref="counterRef">{{ displayValue }}</span>
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
      }
    },
  
    data() {
      return {
        displayValue: 0,
        animationFrame: null,
        startTime: null,
        observer: null
      }
    },
  
    methods: {
      animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp
        const progress = timestamp - this.startTime
        
        if (progress < this.duration) {
          const value = this.easeOutQuad(progress, 0, parseFloat(this.endValue), this.duration)
          this.displayValue = Number(value).toFixed(this.decimals) + this.suffix
          this.animationFrame = requestAnimationFrame(this.animate)
        } else {
          this.displayValue = this.endValue + this.suffix
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
        this.startTime = null
        this.animationFrame = requestAnimationFrame(this.animate)
      },
  
      initObserver() {
        this.observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              this.startAnimation()
              this.observer.disconnect()
            }
          },
          { threshold: 0.1 }
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