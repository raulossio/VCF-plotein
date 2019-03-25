<template>

    <div >
        <div  class="input-group">
              <range-slider
                class="slider"
                :min="population.min"
                :max="population.max"
                :step="population.step"
                
                v-on:change="setCurrentValue($event)">
              </range-slider>
        </div>
        <div  class="input-group">
          <span class="valueRange">{{population.value}}</span> 
        </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import RangeSlider from 'vue-range-slider'
  import 'vue-range-slider/dist/vue-range-slider.css'

  export default {
      computed: {
        ...mapGetters({
        myPopulation: 'getPopulation',
        }),
        population(){
          return this.myPopulation
        }
      },
      components: {
        RangeSlider
      },
      methods: {
        ...mapActions({
          setPopulationValue: 'setRangePopulation'
        }),
        setCurrentValue(value){
          debugger;
         this.setPopulationValue(value)
        }
     }
}

</script>

<style lang="scss">
$slider-height: 20px !default;
$slider-width: 335px !default;
$rail-height: 4px !default;
$knob-size: 16px !default;
$rail-color: #adb5bd !default;
$rail-fill-color: #ff6b00 !default;
$knob-color: #fff !default;
$knob-border: 1px solid #f5f5f5 !default;
$knob-shadow: 0.3px 0.3px rgba(0, 0, 0, 0.5) !default;
.range-slider {
  display: inline-block;
  padding: 0 ($knob-size+3 / 2);
  height: $slider-height;
  width: $slider-width;
}
.range-slider.disabled {
  opacity: 0.5;
}
.range-slider-inner {
  display: inline-block;
  position: relative;
  height: 100%;
  width: 100%;
}
.range-slider-rail,
.range-slider-fill {
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  height: $rail-height;
  border-radius: $rail-height / 2;
  transform: translateY(-50%);
}
.range-slider-rail {
  width: 100%;
  background-color: $rail-color;
}
.range-slider-fill {
  background-color: $rail-fill-color;
}
.range-slider-knob {
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  box-sizing: border-box;
  height: $knob-size;
  width: $knob-size;
  border: $knob-border;
  border-radius: 50%;
  background-color: $knob-color;
  box-shadow: $knob-shadow;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.range-slider-hidden {
  display: none;
}
.valueRange{
  margin: 0 auto;
}
</style>