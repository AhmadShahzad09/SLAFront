<template>
  <section v-loading="loading">
    <ods-module :header="$t('reports')" class="mb-1">
      <ods-carousel :interval="3000" type="card" height="200px">
        <ods-carousel-item v-for="item in reports" :key="item.key">
          <ods-module class="card">
            <div class="son">
              <ods-icon
                :name="item.icon"
                size="100"
                color="#3d5ea3"
                style="margin-top: 10px"
              />
              <h3>{{ $t(item.name) }}</h3>

              <ods-button
                style="background-color: #3d5ea3"
                icon="ods-icon-external-link"
                class="button"
                size="medium"
                @click="handleSelectedReport(item.key)"
                >{{ $t("generateReport") }}</ods-button
              >
            </div>

            <div class="son">
              <ods-icon
                :name="item.icon"
                size="100"
                color="#ffffff"
                style="margin-top: 10px"
              />
              <h3>{{ $t(item.name) }}</h3>

              <ods-button
                style="background-color: #e1d6f3"
                type="secundary"
                icon="ods-icon-external-link"
                class="button"
                size="medium"
                @click="handleSelectedReport(item.key)"
                >{{ $t("generateReport") }}</ods-button
              >
            </div>
          </ods-module>
        </ods-carousel-item>
      </ods-carousel>
      <ReportDialog :dialogVisible="dialogVisible" :currentReport="currentReport" @cancel="handleCancel" />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import ReportDialog from "./ReportDialog.vue";


export default {
  name: "Dashboard",
  components: { ReportDialog },
  data() {
    return {
      loading: false,
      reports: [
        {
          name: "calculationResults",
          icon: "reception",
          key: "calculationResult",
        },
        {
          name: "mettersAffected",
          icon: "share",
          key: "metterAffected",
        },
      ],
      search: {},
      calculationResults: [],
      currentReport: null,
      dialogVisible: false,
    };
  },
  methods: {
    handleSelectedReport(data) {
      this.dialogVisible = true;
      this.currentReport = data
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
    handleCancel() {
      this.currentReport = null;
      this.dialogVisible = false;
    },
  },
};
</script>
<style scoped>

/** Carrousel CSS*/
.card {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.card .son {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: rgb(0, 0, 0);
  background: #e1d6f3;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 18px;
}

h3 {
  font-weight: 500;
}
.card {
  opacity: 0.9;
}

.card .son:nth-child(2) {
  color: #ffffff;
  background: #4e75c9;
  overflow: hidden;
  z-index: 2;
  transition: 0.5s;
  clip-path: polygon(60% 0, 100% 0%, 100% 100%, 60% 100%, 40% 53%);
}

.card .son:nth-child(2):hover {
  clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%, 0 50%);
}

.card .son:nth-child(1):hover ~ .son:nth-child(2) {
  clip-path: polygon(100% 0, 100% 0%, 100% 100%, 100% 100%, 100% 50%);
}

.button {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
