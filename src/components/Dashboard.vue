<template>
  <div class="my-5 d-flex flex-column">
    <b-card class="dark-card shadow">
      <b-card-text class="text-secondary">
        <b-row class="justify-content-between">
          <b-col :sm="3"  class="my-1 text-center">
            <div class="d-flex">
              <div @click.prevent="activeTab = 'browse'" :class="['tab-title flex-fill', activeTab === 'browse' ? 'active' : '']">Browse</div>
              <div @click.prevent="activeTab = 'saved'" :class="['tab-title flex-fill', activeTab === 'saved' ? 'active' : '']">Saved</div>
            </div>
          </b-col>
          <b-col :sm="3" class="mt-md-1 my-2 align-self-center">
            <b-input-group class="shadow-sm mx-1">
              <b-input-group-prepend>
                <b-button @click="applyFilters" class="px-2 py-0" variant="primary">
                  <b-icon-search class="mt-1" scale="0.75" variant-white></b-icon-search>
                </b-button>
              </b-input-group-prepend>
              <b-input
                size="sm"
                class="bg-white w-25"
                id="search"
                debounce="500"
                v-on:keyup.enter="applyFilters"
                v-model="vars.id"
                placeholder="Search by asteroid id"
              ></b-input>
            </b-input-group>
          </b-col>
          <b-col :sm="6" class="mt-md-1 my-2 align-self-center">
            <div class="d-flex justify-content-center">
              <b-form-datepicker placeholder="From" size="sm" id="from-date" v-model="vars.startDate"></b-form-datepicker>
              <div class="mx-1 align-self-center">-</div>
              <b-form-datepicker placeholder="To" :disabled="!vars.startDate" :min="vars.startDate" :max="getMaxDate" size="sm" id="to-date" v-model="vars.endDate"></b-form-datepicker>
            </div>
          </b-col>
        </b-row>
        <b-row class="my-4">
          <b-col v-if="loading" xs="12">
            <div class="m-5 d-flex justify-content-center" v-if="loading">
              <span class="text-white font-20">Loading updated results</span>
              <b-spinner class="mx-3"></b-spinner>
            </div>
          </b-col>
          <b-col v-else-if="!isRangeCorrect && vars.startDate && vars.endDate" xs="12">
            <div class="m-5 d-flex justify-content-center">
              <span class="text-white font-20">Incorrect Range. Maximum range allowed is 7 days</span>
            </div>
          </b-col>
          <b-col v-else :sm="12" class="px-3">
            <div class="d-flex mb-4">
              <b-table
                class="main-table table-clean table-borderless"
                responsive
                sticky-header="500px"
                id="asteroids-table"
                :per-page="activeTab === 'saved' ? limit : ''"
                :current-page="activeTab === 'saved' ? page : ''"
                :items="browseTable"
                :fields="fields"
                show-empty
              >
                <!-- <template v-slot:cell(actions)="row">
                  <div class="text-center d-flex">
                    <b-button
                      v-if="false"
                      :disabled="true"
                      size="sm"
                      class="my-1 bg-light"
                      variant="outline-secondary"
                      >ADD QTY</b-button
                    >
                    <b-button
                      @click="row.toggleDetails"
                      size="sm"
                      class="my-1"
                      variant="link"
                    >
                      <b-icon-chevron-down
                        scale="0.65"
                        variant="light"
                        class="rounded-circle bg-light text-muted"
                      ></b-icon-chevron-down>
                    </b-button>
                  </div>
                </template>
                <template v-slot:cell(status)="data">
                  <div class="d-flex align-items-center">
                    <b-icon :class="[getVariant(data.item.status), 'status-circle']"></b-icon>
                    <span>{{ data.item.status }}</span>
                  </div>
                </template>
                <template v-slot:row-details="row">
                  <b-row class="info-tables mb-2">
                    <b-col sm="6">
                      <div class="text-muted font-15 font-weight-bold mb-1 text-uppercase">Lot Numbers</div>
                      <div v-for="(num,i) in row.item.lot_numbers" :key="num" class="font-weight-bold font-info d-inline-flex">
                        <div>
                          {{ num }}
                          <span v-if="i !== row.item.lot_numbers.length-1">, </span>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </template> -->
                <template v-slot:cell(view_details)="row">
                  <div class="text-center d-flex">
                    <b-button
                      @click="row.toggleDetails"
                      size="sm"
                      class="my-1"
                      variant="link"
                    >
                      <b-icon
                        :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                        scale="0.65"
                        variant="dark"
                        class="rounded-circle bg-white"
                      ></b-icon>
                    </b-button>
                  </div>
                </template>
                <template v-slot:cell(is_potentially_hazardous_asteroid)="data">
                  <div class="d-flex align-items-center">
                    <span>{{ data.item.is_potentially_hazardous_asteroid ? 'Dangerous' : 'No Danger' }}</span>
                  </div>
                </template>
                <template v-slot:cell(is_sentry_object)="data">
                  <div class="d-flex align-items-center">
                    <span>{{ data.item.is_sentry_object ? 'Yes' : 'No' }}</span>
                  </div>
                </template>
                <template v-slot:empty="">
                  <div class="text-center font-montserrat">
                    <span>No Asteroids found!</span>
                  </div>
                </template>
                <template v-slot:row-details="row">
                  <b-row class="info-tables mb-2">
                    <b-col sm="12" md="3">
                      <div class="font-15 mb-1 text-uppercase">Magnitude</div>
                      <div class="font-weight-bold font-info d-inline-flex">{{ row.item.absolute_magnitude_h }}</div>
                    </b-col>
                    <b-col sm="12" md="3">
                      <div class="font-15 mb-1 text-uppercase">NASA JPL Url</div>
                      <div class="font-weight-bold font-info d-inline-flex">
                        <b-link class="text-white" target="_black" rel="noreferrer noopener" :href="row.item.nasa_jpl_url">Visit</b-link>
                      </div>
                    </b-col>
                    <b-col sm="12" md="3">
                      <div class="font-15 mb-1 text-uppercase">First Observation</div>
                      <div class="font-weight-bold font-info d-inline-flex">
                        {{ row.item.orbital_data.first_observation_date ? row.item.orbital_data.first_observation_date : 'Not Available' }}
                      </div>
                    </b-col>
                    <b-col sm="12" md="3">
                      <div class="font-15 mb-1 text-uppercase">Last Observation</div>
                      <div class="font-weight-bold font-info d-inline-flex">
                        {{ row.item.orbital_data.last_observation_date ? row.item.orbital_data.last_observation_date : 'Not Available' }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row class="info-tables justify-content-end mt-4 mx-5">
                    <b-button
                      @click="saveAsteroid(row.item.id)"
                      size="sm"
                      class="mr-4 text-uppercase" 
                      variant="primary">
                      {{ isAlreadySaved(row.item.id) ? 'Unsave' : 'Save' }}
                    </b-button>
                    <b-button size="sm" class="text-uppercase" variant="primary" :to="{ name: 'asteroid-detail', params: { id: row.item.id }}">View All Details</b-button>
                  </b-row>
                </template>
              </b-table>
            </div>
            <b-pagination
              :total-rows="totalRows"
              hide-ellipsis
              hide-goto-end-buttons
              class="table-pagination"
              v-model="page"
              :per-page="limit"
              aria-controls="asteroids-table"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { asteroidsCollection, auth } from '../../firebase'
export default {
  data: () => ({
    activeTab: 'browse',
    page: 1,
    limit: 10,
    totalRows: null,
    totalPages: null,
    vars: {
      id: '',
      startDate: '',
      endDate: ''
    },
    loading: false,
    isRangeCorrect: false,
    browseTable: [],
    fields: [
      { key: 'id', label: 'Id' },
      { key: 'name', label: 'Name' },
      { key: 'is_potentially_hazardous_asteroid', label: 'Danger'},
      { key: 'designation', label: 'Designation' },
      { key: 'is_sentry_object', label: 'Sentry Object'},
      { key: 'view_details', label: 'Details'}
    ]
  }),
  mounted () {
    this.loading = true
    this.getBrowseData()
  },
  watch: {
    'vars.id': function (newVal) {
      if (newVal.length >= 7) {
        this.applyFilters()
      } else {
        this.loading = true
        this.getBrowseData()
      }
    },
    'vars.startDate': function (newVal) {
      if (this.vars.endDate && newVal) {
        this.isRangeCorrect = this.getDifference()
      } else {
        this.vars.endDate = ''
        this.isRangeCorrect = false
        this.isRangeCorrect ? this.getIntervalData() : null
      }
    },
    'vars.endDate': function (newVal) {
      if (this.vars.startDate && newVal) {
        this.isRangeCorrect = this.getDifference()
        this.isRangeCorrect ? this.getIntervalData() : null
      } else {
        this.isRangeCorrect = false
      }
    },
    isRangeCorrect: function (newVal) {
      if (newVal) {
        this.getIntervalData()
      } else {
        this.vars.endDate = ''
      }
    },
    activeTab: function (newVal) {
      this.loading = true
      if (newVal === 'saved') {
        this.browseTable = []
        this.getSavedData()
      } else {
        this.getBrowseData()
      }
    },
    previouslySavedAsteroids: function (newVal) {
      if (this.activeTab === 'saved' && newVal) {
        this.getSavedData()
      }
    },
    page: function (newVal) {
      if (this.activeTab === 'browse' && newVal) {
        this.getBrowseData()
      }
    }
  },
  computed: mapState({
    previouslySavedAsteroids (state) {
      return state.savedAsteroids || []
    },
    getMaxDate () {
      if (this.vars.startDate) {
        let maxDate = new Date(this.vars.startDate)
        maxDate.setDate(maxDate.getDate()+7)
        return maxDate
      } else {
        return new Date(8640000000000000)
      }
    }
  }),
  methods: {
    getBrowseData () {
      this.$http.get(`${process.env.VUE_APP_NASA_API}/neo/browse?page=${this.page-1}&size=${this.limit}&api_key=${process.env.VUE_APP_NASA_DEMO_KEY}`)
      .then(res => {
        this.page = res.data.page.number+1
        this.totalPages = res.data.page.total_pages
        this.totalRows = this.totalPages * this.limit
        this.browseTable = res.data.near_earth_objects
        this.loading = false
      }).catch (err => {
        console.log(err)
        this.loading = false
      })
    },
    getSpeed (item) {
      if (item.relative_velocity && item.relative_velocity.kilometers_per_second ) {
        return parseFloat(item.relative_velocity.kilometers_per_second).toFixed(2)
      }
      return 'Not Available'
    },
    applyFilters () {
      this.loading = true
      this.$http.get(`${process.env.VUE_APP_NASA_API}/neo/${this.vars.id}?api_key=${process.env.VUE_APP_NASA_DEMO_KEY}`)
        .then(res => {
          this.browseTable = [res.data]
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.$bvToast.toast('Something went wrong', {
            toaster: 'b-toaster-top-right',
            solid: true,
            variant: 'danger'
          })
        })
    },
    async saveAsteroid (id) {
      try {
        if (this.isAlreadySaved(id)) {
          const savedAsteroidsData = await asteroidsCollection.where('id', '==', id).get()
          let delId = savedAsteroidsData.docs[0].id
          this.$store.dispatch('unsaveAsteroid', id)
          let res = await asteroidsCollection.doc(delId)
          res.delete()
        } else {
          this.$store.dispatch('saveAsteroid', id)
          await asteroidsCollection.add({
            id,
            userId: auth.currentUser.uid
          })
        }
      } catch (err) {
        console.log(err)
        this.$bvToast.toast('Something went wrong', {
          toaster: 'b-toaster-top-right',
          solid: true,
          variant: 'danger'
        })
      }
    },
    isAlreadySaved (id) {
      return Boolean(this.previouslySavedAsteroids.find(item => item === id))
    },
    getIntervalData () {
      this.loading = true
      this.$http.get(`${process.env.VUE_APP_NASA_API}/feed?start_date=${this.vars.startDate}&end_date=${this.vars.endDate}&detailed=true&api_key=${process.env.VUE_APP_NASA_DEMO_KEY}`)
        .then(res => {
          this.browseTable = Object.values(res.data.near_earth_objects).flat()
          this.loading = false
        }).catch(err => {
          console.log(err)
        })
    },
    getDifference () {
      const start = new Date(this.vars.startDate)
      const end = new Date(this.vars.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    },
    async getSavedData () {
      this.loading = true
      this.browseTable = []
      this.previouslySavedAsteroids.map(item => {
        this.$http.get(`${process.env.VUE_APP_NASA_API}/neo/${item}?api_key=${process.env.VUE_APP_NASA_DEMO_KEY}`)
          .then(res => {
            this.loading = false
            this.browseTable.push(res.data)
          })
      })
      this.page = 1
      this.totalPages = this.previouslySavedAsteroids.length % this.limit
      this.totalRows = this.previouslySavedAsteroids.length
      this.loading = false
    }
  } 
}
</script>
<style lang="scss" scoped>
  .tab-title {
   font-size: 16px;
   line-height: 25px;
   letter-spacing: 0.7px;
   font-family: $poppins;
   color: white;
   text-transform: uppercase;
   cursor: pointer;
   text-align: center;
   padding: 0.75rem 0;
   &.active {
     font: bold 16px/25px Poppins;
     opacity: 1;
     border-right: none;
     border-bottom: 3px solid $primary;
   }
 }
</style>