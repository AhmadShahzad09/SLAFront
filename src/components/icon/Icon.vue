<template>
    <span data-name="OdsIcon" v-if="name === 'logo'" class="ods-icon-logo">
      <svg width="22px" height="34px" viewBox="0 0 26 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="logo" stroke-width="2">
            <g transform="translate(1.000000, 2.000000)">
              <polygon id="p2" stroke="#87BEE6" points="16 23.3184982 16 28 0 32 0 0 16 4 16 7.93394856"></polygon>
              <polygon id="p1" stroke="#2E6C99" points="24 23.3184982 24 28 8 32 8 0 24 4 24 7.93394856"></polygon>
            </g>
          </g>
        </g>
      </svg>
    </span>
    <span data-name="OdsIcon" v-else :class="'ods-icon-' + name" :style="{'font-size': size + 'px', 'color': color}"></span>
</template>

<style>
    .ods-menu-item:hover #p1,
    .ods-menu-item.is-active #p1 {
        stroke: #FFFFFF;
    }
</style>

<script>
export default {
  name: 'OdsIcon',
  version: '2.0.0',
  category: 'basic',
  lastDate: '13/04/2020',
  syncStatus: 'not-applicable',
  props: {
    name: String,
    size: String,
    color: String
  }
}
</script>
