<template>
  <div class="my-5">
    <b-container>
      <b-card v-if="loading" class="dark-card">
        <div class="m-5 d-flex justify-content-center">
          <span class="text-white font-20">Loading Asteroid Data</span>
          <b-spinner class="mx-3"></b-spinner>
        </div>
      </b-card>
      <b-card v-else class="dark-card">

        <b-button class="text-white font-20 text-uppercase" variant="black" block v-b-toggle.collapse-description>
          Description
          <b-icon
            icon="caret-down-fill"
            scale="0.55"
            variant="white"
          ></b-icon>
        </b-button>
        <b-collapse visible id="collapse-description" class="mt-2">
          <b-card class="dark-card">
            <b-row>
              <b-col class="my-3" v-for="dataKey in Object.keys(orbitClass)" :key="dataKey">
                <div class="font-10 mb-1 text-uppercase">
                  {{ dataKey.replace('orbit_class_', '') }}
                </div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ orbitClass[dataKey] }}
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>


        <b-button class="text-white font-20 text-uppercase" variant="black" block v-b-toggle.collapse-general>
          General Information 
          <b-icon
            icon="caret-down-fill"
            scale="0.55"
            variant="white"
          ></b-icon>
        </b-button>
        <b-collapse visible id="collapse-general" class="mt-2">
          <b-card class="dark-card">
            <b-row>
              <b-col sm="12" md="3" class="my-2">
                  <div class="font-15 mb-1 text-uppercase">Name</div>
                  <div class="font-weight-bold font-info d-inline-flex">
                    {{ asteroidData.name }}
                  </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                  <div class="font-15 mb-1 text-uppercase">ID</div>
                  <div class="font-weight-bold font-info d-inline-flex">
                    {{ asteroidData.id }}
                  </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                  <div class="font-15 mb-1 text-uppercase">Magnitude</div>
                  <div class="font-weight-bold font-info d-inline-flex">
                    {{ asteroidData.absolute_magnitude_h }}
                  </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                  <div class="font-15 mb-1 text-uppercase">Designation</div>
                  <div class="font-weight-bold font-info d-inline-flex">
                    {{ asteroidData.designation }}
                  </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                  <div class="font-15 mb-1 text-uppercase">Neo Reference Id</div>
                  <div class="font-weight-bold font-info d-inline-flex">
                    {{ asteroidData.neo_reference_id }}
                  </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">NASA JPL Url</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  <b-link class="text-white" target="_black" rel="noreferrer noopener" :href="asteroidData.nasa_jpl_url">Visit</b-link>
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Danger</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ asteroidData.is_potentially_hazardous_asteroid ? 'Dangerous' : 'No Danger' }}
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Sentry Object</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ asteroidData.is_sentry_object ? 'Yes' : 'No' }}
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>


        <b-button class="text-white font-20 text-uppercase" variant="black" block v-b-toggle.collapse-approach>
          Approach Data 
          <b-icon
            icon="caret-down-fill"
            scale="0.55"
            variant="white"
          ></b-icon>
        </b-button>
        <b-collapse visible id="collapse-approach" class="mt-2">
          <b-card class="dark-card">
            <b-row>
              <b-col sm="12" md="3" class="my-2">
                <div class="font-15 mb-1 text-uppercase">Close Approach Date</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ getCloseApproachDate }}
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Approach Time(UTC)</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ getCloseApproachTime }}
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Miss Distance(Miles)</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  <div>{{ parseFloat(getMissDistance.miles).toFixed(2) }}</div>
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Orbiting Body</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ getOrbitingBody }}
                </div>
              </b-col>
              <b-col sm="12" md="3" class="my-3">
                <div class="font-15 mb-1 text-uppercase">Relative Velocity(Miles/H)</div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ parseFloat(getRelativeVelocity).toFixed(2) }}
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>


        <b-button class="text-white font-20 text-uppercase" variant="black" block v-b-toggle.collapse-orbital>
          Orbital Data 
          <b-icon
            icon="caret-down-fill"
            scale="0.55"
            variant="white"
          ></b-icon>
        </b-button>
        <b-collapse visible id="collapse-orbital" class="mt-2">
          <b-card class="dark-card">
            <b-row>
              <b-col sm="12" md="3" class="my-3" v-for="dataKey in Object.keys(orbitalData)" :key="dataKey">
                <div class="font-10 mb-1 text-uppercase">
                  {{ dataKey.split('_').join(' ') }}
                </div>
                <div class="font-weight-bold font-info d-inline-flex">
                  {{ orbitalData[dataKey] }}
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>

      </b-card>
    </b-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      asteroidId: this.$route.params.id,
      loading: true,
      asteroidData: null,
      orbitalData: null,
      orbitClass: null
    }
  },
  computed: {
    getCloseApproachDate () {
      try {
        return this.asteroidData.close_approach_data[0].close_approach_date
      } catch (err) {
        console.log(err)
        return 'Not Available'
      }
    },
    getCloseApproachTime () {
      try {
        let newDate = new Date(this.asteroidData.close_approach_data[0].close_approach_date_full)
        return newDate.getHours()+':'+newDate.getMinutes()
      } catch (err) {
        console.log(err)
        return 'Not Available'
      }
    },
    getMissDistance () {
      try {
        return this.asteroidData.close_approach_data[0].miss_distance
      } catch (err) {
        console.log(err)
        return 'Not Available'
      }
    },
    getRelativeVelocity () {
      try {
        return this.asteroidData.close_approach_data[0].relative_velocity.miles_per_hour
      } catch (err) {
        console.log(err)
        return 'Not Available'
      }
    },
    getOrbitingBody () {
      try {
        return this.asteroidData.close_approach_data[0].orbiting_body
      } catch (err) {
        console.log(err)
        return 'Not Available'
      }
    }
  },
  beforeMount () {
    this.$http.get(`${process.env.VUE_APP_NASA_API}/neo/${this.asteroidId}?api_key=${process.env.VUE_APP_NASA_DEMO_KEY}`)
      .then(res => {
        this.asteroidData = res.data
        let orbitalData = Object.assign({},res.data.orbital_data)
        delete orbitalData.orbit_class
        this.orbitClass = res.data.orbital_data.orbit_class
        this.orbitalData = orbitalData
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        if (this.orbitalData) {
          this.loading = false
        }
      })
  }
}
</script>