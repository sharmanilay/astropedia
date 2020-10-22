<template>
  <div class="app-wrapper" id="app">
    <div class="app">
      <main-header v-if="isUserLoggedIn"></main-header>
      <router-view></router-view>
      <main-footer></main-footer>
    </div>
    <canvas class="canvas" id="background"></canvas>
  </div>
</template>

<script>
import Star from './classes/star'
import ShootingStar from './classes/shootingStar'
import MainHeader from './components/Header'
import MainFooter from './components/Footer'
import { mapState } from 'vuex'

export default {
  name: 'App',
  data: () => ({
    interval: null,
  }),
  mounted () {
    this.meteorShower()
    window.addEventListener('resize', () => {
      clearInterval(this.interval)
      this.meteorShower()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      console.log('removing resize event listner')
    })
  },
  methods: {
    meteorShower () {
      let background = document.getElementById("background"),
        bgCtx = background.getContext("2d"),
        width = window.innerWidth,
        height = window.innerHeight;

      background.width = width;
      background.height = height;

      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0,0,width,height);

      let entities = [];
      // init the stars
      this.initializeStars(entities, height, width)

      this.interval = setInterval(() => {
        this.animate(bgCtx, entities, height, width,requestAnimationFrame)
      }, 20)
    },
    animate (bgCtx, entities, height, width) {
      bgCtx.fillStyle = '#000000';
      bgCtx.fillRect(0,0,width,height);
      bgCtx.fillStyle = '#ffffff';
      bgCtx.strokeStyle = '#ffffff';

      let entLen = entities.length;

      while(entLen--){
        if (entities[entLen].type === 'shooting') {
          entities[entLen].update(bgCtx, height, width);
        } else if (entities[entLen].type === 'star') {
          entities[entLen].update(bgCtx);
        }
      }
    },
    initializeStars (entities, height, width) {
      for(let i=0; i < height; i++){
        entities.push(new Star({x:Math.random()*width, y:Math.random()*height}));
        if ( i% 145 === 0) {
          entities.push(new ShootingStar(width));
        }
      }
    }
  },
  computed: mapState({
    isUserLoggedIn: function (state) {
      if (!state.userData || !state.userData.name) {
        this.$router.push({ name: 'login'})
      }
      return state.userData && state.userData.name
    }
  }),
  components: {
    MainHeader,
    MainFooter
  }
}
</script>

