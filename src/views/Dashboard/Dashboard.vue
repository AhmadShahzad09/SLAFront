<template>
  <section v-loading="loading">
    <ods-module :header="$t('dashboard')" class="mb-1">
      <div class="actionContainer">
        <ods-select
          style="margin-right: auto; width: 300px"
          v-model="search.calculationMethod"
          :placeholder="$t('selectSLA')"
          clearable
        >
          <ods-option
            v-for="item in calculationMethods"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </ods-select>
        <ods-button
          type="primary"
          :circle="true"
          @click="buildGraphs"
          icon="ods-icon-search"
        />
      </div>
    </ods-module>

    <ods-module :header="$t('slaEvolution')" class="mb-1" />

    <ods-row :gutter="20">
      <ods-col :md="12" v-if="p1SlaEvolution && p1SlaEvolution.length > 0">
        <ods-module header="P1" class="mb-1">
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateEvolution(p1SlaEvolution, p1YAxisName)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>

      <ods-col :md="12" v-if="p2SlaEvolution && p2SlaEvolution.length > 0">
        <ods-module header="P2" class="mb-1">
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateEvolution(p2SlaEvolution, p2YAxisName)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
    </ods-row>

    <ods-row :gutter="20">
      <ods-col :md="12" v-if="p3SlaEvolution && p3SlaEvolution.length > 0">
        <ods-module header="P3" class="mb-1">
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateEvolution(p3SlaEvolution, p3YAxisName)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>

      <ods-col
        :md="12"
        v-if="overallSlaEvolution && overallSlaEvolution.length > 0"
      >
        <ods-module header="Overall" class="mb-1">
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateEvolution(overallSlaEvolution, overallYAxisName)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
    </ods-row>

    <ods-module :header="$t('slaSuccecion')" class="mb-1" />
    <ods-row :gutter="20">
      <ods-col :md="6">
        <ods-module
          header="P1"
          class="mb-1"
          v-if="successDataP1 && successDataP1.length > 0"
        >
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateSuccess(successDataP1)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module
          header="P2"
          class="mb-1"
          v-if="successDataP2 && successDataP2.length > 0"
        >
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateSuccess(successDataP2)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module
          header="P3"
          class="mb-1"
          v-if="successDataP3 && successDataP3.length > 0"
        >
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateSuccess(successDataP3)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module
          header="Overall"
          class="mb-1"
          v-if="successDataOverall && successDataOverall.length > 0"
        >
          <v-chart
            ref="vchart"
            style="width: 100%"
            :options="generateSuccess(successDataOverall)"
            autoresize="autoresize"
          />
        </ods-module>
      </ods-col>
    </ods-row>

    <ods-module :header="$t('mettersAffected')" class="mb-1" />
    <ods-row :gutter="20">
      <ods-col :md="6">
        <ods-module class="mb-1" v-if="p1MetersAffected !== null">
          <div class="box-top">
            {{ p1MetersAffected | formatNumber }}
          </div>
          <div class="box">
            <ods-button
              type="secundary"
              size="medium"
              icon="ods-icon-terminal"
              circle
              disabled
              style="
                color: gray;
                border-color: rgb(116, 141, 252);
                margin-top: -5px;
              "
            />
          </div>
          <div class="box-bottom">
            <p>P1</p>
          </div>
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module class="mb-1" v-if="p2MetersAffected !== null">
          <div class="box-top">
            {{ p2MetersAffected | formatNumber }}
          </div>
          <div class="box">
            <ods-button
              type="secundary"
              size="medium"
              icon="ods-icon-terminal"
              circle
              disabled
              style="
                color: gray;
                border-color: rgb(116, 141, 252);
                margin-top: -5px;
              "
            />
          </div>
          <div class="box-bottom">
            <p>P2</p>
          </div>
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module class="mb-1" v-if="p3MetersAffected !== null">
          <div class="box-top">
            {{ p3MetersAffected | formatNumber }}
          </div>
          <div class="box">
            <ods-button
              type="secundary"
              size="medium"
              icon="ods-icon-terminal"
              circle
              disabled
              style="
                color: gray;
                border-color: rgb(116, 141, 252);
                margin-top: -5px;
              "
            />
          </div>
          <div class="box-bottom">
            <p>P3</p>
          </div>
        </ods-module>
      </ods-col>
      <ods-col :md="6">
        <ods-module class="mb-1" v-if="overallMetersAffected !== null">
          <div class="box-top">
            {{
              overallMetersAffected ? overallMetersAffected : 0 | formatNumber
            }}
          </div>
          <div class="box">
            <ods-button
              type="secundary"
              size="medium"
              icon="ods-icon-terminal"
              circle
              disabled
              style="
                color: gray;
                border-color: rgb(116, 141, 252);
                margin-top: -5px;
              "
            />
          </div>
          <div class="box-bottom">
            <p>Overall</p>
          </div>
        </ods-module>
      </ods-col>
    </ods-row>
  </section>
</template>

<script>
import handlePromise from "@/utils/promise";
import _ from "lodash";
import moment from "moment-timezone";
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/map";
import CalculationMethodService from "@/services/CalculationMethod";
import CalculationResultService from "@/services/CalculationResult";

export default {
  name: "Dashboard",
  components: {
    "v-chart": ECharts,
  },
  data() {
    return {
      loading: false,
      search: {},
      calculationMethods: [],
      baseData: {},
      data: {},
      chart1: {},
      p1SlaEvolution: [],
      p2SlaEvolution: [],
      p3SlaEvolution: [],
      overallSlaEvolution: [],
      p1YAxisName: "",
      p2YAxisName: "",
      p3YAxisName: "",
      overallYAxisName: "",
      chart2: {},
      successDataP1: null,
      successDataP2: null,
      successDataP3: null,
      successDataOverall: null,
      p1MetersAffected: null,
      p2MetersAffected: null,
      p3MetersAffected: null,
      overallMetersAffected: null,
      colors: [
        "#2a39c7",
        "#2a66c7",
        "#2a7bc7",
        "#2a88c7",
        "#05b1f5",
        "#05cdf5",
      ],
    };
  },
  mounted() {
    this.getCalculationMethods();
    this.getGraphs();
  },
  methods: {
    async getCalculationMethods() {
      this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationMethodService.getCalculationMethods()
      );
      this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.calculationMethods = data;
    },
    async getGraphs() {
      this.toggleLoading();

      const params = {
        size: -1,
      };

      const [error, response, data] = await handlePromise(
        CalculationResultService.getDailyCalculationResults(params)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.baseData = data;
      this.data = data;
      this.buildGraphs();
    },
    async buildGraphs() {
      this.data = this.baseData;

      this.p1SlaEvolution = [];
      this.p2SlaEvolution = [];
      this.p3SlaEvolution = [];
      this.overallSlaEvolution = [];
      this.p1YAxisName = "";
      this.p2YAxisName = "";
      this.p3YAxisName = "";
      this.overallYAxisName = "";

      this.chart2 = {};
      this.successDataP1 = null;
      this.successDataP2 = null;
      this.successDataP3 = null;
      this.successDataOverall = null;
      this.p1MetersAffected = null;
      this.p2MetersAffected = null;
      this.p3MetersAffected = null;
      this.overallMetersAffected = null;

      if (this.search.calculationMethod) {
        this.data = _.filter(this.data, (d) => {
          return d.slaExecutionDto.slaName === this.search.calculationMethod;
        });
        if (this.data.length === 0) return;
        let formattedData = [];

        for (let i = 0; i < this.data.length; i++) {
          let name =
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId.name;
          let desc =
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .description;
          let date = moment(this.data[i].slaExecutionDto.slaDate).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf();
          let startDate = moment(
            this.data[i].slaExecutionDto.startDateTime
          ).tz(process.env.VUE_APP_TIMEZONE).valueOf();
          let endDate = moment(
            this.data[i].slaExecutionDto.endDateTime
          ).tz(process.env.VUE_APP_TIMEZONE).valueOf();
          let type =
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .slaType;

          let totalObjetive = _.filter(
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .slaCalculationMethodObjectiveDtos,
            (t) => {
              return t.type === "overall";
            }
          );
          let totalResult = this.data[i].slaExecutionDto.overallAchieved;
          let totalTarget =
            totalObjetive.length > 0 ? totalObjetive[0].target : null;
          let totalUM =
            totalObjetive.length > 0 ? totalObjetive[0].targetUOM : null;
          let totalOk =
            totalObjetive.length > 0 &&
            totalObjetive[0].compare === "<" &&
            totalResult < totalTarget
              ? true
              : totalObjetive.length > 0 &&
                totalObjetive[0].compare === ">" &&
                totalResult > totalTarget
              ? true
              : false;
          let totalAffected =
            this.data[i].slaExecutionDto.overallMetersAffected;

          let p1Objetive = _.filter(
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .slaCalculationMethodObjectiveDtos,
            (t) => {
              return t.type === "p1";
            }
          );
          let p1Result = this.data[i].slaExecutionDto.p1Achieved;
          let p1Target = p1Objetive.length > 0 ? p1Objetive[0].target : null;
          let p1UM = p1Objetive.length > 0 ? p1Objetive[0].targetUOM : null;
          let p1Ok =
            p1Objetive.length > 0 &&
            p1Objetive[0].compare === "<" &&
            p1Result < p1Target
              ? true
              : p1Objetive.length > 0 &&
                p1Objetive[0].compare === ">" &&
                p1Result > p1Target
              ? true
              : false;
          let p1Affected = this.data[i].slaExecutionDto.p1MetersAffected;

          let p2Objetive = _.filter(
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .slaCalculationMethodObjectiveDtos,
            (t) => {
              return t.type === "p2";
            }
          );
          let p2Result = this.data[i].slaExecutionDto.p2Achieved;
          let p2Target = p2Objetive.length > 0 ? p2Objetive[0].target : null;
          let p2UM = p2Objetive.length > 0 ? p2Objetive[0].targetUOM : null;
          let p2Ok =
            p2Objetive.length > 0 &&
            p2Objetive[0].compare === "<" &&
            p2Result < p2Target
              ? true
              : p2Objetive.length > 0 &&
                p2Objetive[0].compare === ">" &&
                p2Result > p2Target
              ? true
              : false;
          let p2Affected = this.data[i].slaExecutionDto.p2MetersAffected;

          let p3Objetive = _.filter(
            this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
              .slaCalculationMethodObjectiveDtos,
            (t) => {
              return t.type === "p3";
            }
          );
          let p3Result = this.data[i].slaExecutionDto.p3Achieved;
          let p3Target = p3Objetive.length > 0 ? p3Objetive[0].target : null;
          let p3UM = p3Objetive.length > 0 ? p3Objetive[0].targetUOM : null;
          let p3Ok =
            p3Objetive.length > 0 &&
            p3Objetive[0].compare === "<" &&
            p3Result < p3Target
              ? true
              : p3Objetive.length > 0 &&
                p3Objetive[0].compare === ">" &&
                p3Result > p3Target
              ? true
              : false;
          let p3Affected = this.data[i].slaExecutionDto.p3MetersAffected;

          formattedData.push({
            name,
            desc,
            date,
            startDate,
            endDate,
            type,
            totalResult,
            totalTarget,
            totalUM,
            totalOk,
            totalAffected,
            p1Result,
            p1Target,
            p1UM,
            p1Ok,
            p1Affected,
            p2Result,
            p2Target,
            p2UM,
            p2Ok,
            p2Affected,
            p3Result,
            p3Target,
            p3UM,
            p3Ok,
            p3Affected,
          });
        }
        this.data = formattedData;

        this.successDataP1 = [
          {
            value: _.filter(formattedData, ["p1Ok", true]).length,
            name: "Success",
            itemStyle: { color: "#2a66c7" },
          },
          {
            value: _.filter(formattedData, ["p1Ok", false]).length,
            name: "Not Successs",
            itemStyle: { color: "#05b1f5" },
          },
        ];

        this.successDataP2 = [
          {
            value: _.filter(formattedData, ["p2Ok", true]).length,
            name: "Success",
            itemStyle: { color: "#2a66c7" },
          },
          {
            value: _.filter(formattedData, ["p2Ok", false]).length,
            name: "Not Successs",
            itemStyle: { color: "#05b1f5" },
          },
        ];

        this.successDataP3 = [
          {
            value: _.filter(formattedData, ["p3Ok", true]).length,
            name: "Success",
            itemStyle: { color: "#2a66c7" },
          },
          {
            value: _.filter(formattedData, ["p3Ok", false]).length,
            name: "Not Successs",
            itemStyle: { color: "#05b1f5" },
          },
        ];

        this.successDataOverall = [
          {
            value: _.filter(formattedData, ["totalOk", true]).length,
            name: "Success",
            itemStyle: { color: "#2a66c7" },
          },
          {
            value: _.filter(formattedData, ["totalOk", false]).length,
            name: "Not Successs",
            itemStyle: { color: "#05b1f5" },
          },
        ];

        this.p1MetersAffected = _.sumBy(this.data, "p1Affected");

        this.p2MetersAffected = _.sumBy(this.data, "p2Affected");

        this.p3MetersAffected = _.sumBy(this.data, "p3Affected");

        this.overallMetersAffected = _.sumBy(this.data, "totalAffected");

        this.p1SlaEvolution.push({
          name: "P1 result",
          type: "line",
          smooth: true,
          itemStyle: { color: "#2a7bc7" },
          data: _.map(this.data, (d) => {
            return [moment(d.date).tz(process.env.VUE_APP_TIMEZONE).valueOf(), d.p1Result];
          }),
        });

        this.p2SlaEvolution.push({
          name: "P2 result",
          type: "line",
          smooth: true,
          itemStyle: { color: "#2a7bc7" },
          data: _.map(this.data, (d) => {
            return [moment(d.date).tz(process.env.VUE_APP_TIMEZONE).valueOf(), d.p2Result];
          }),
        });

        this.p3SlaEvolution.push({
          name: "P3 result",
          type: "line",
          smooth: true,
          itemStyle: { color: "#2a7bc7" },
          data: _.map(this.data, (d) => {
            return [moment(d.date).tz(process.env.VUE_APP_TIMEZONE).valueOf(), d.p3Result];
          }),
        });

        this.overallSlaEvolution.push({
          name: "Overall result",
          type: "line",
          smooth: true,
          itemStyle: { color: "#2a7bc7" },
          data: _.map(this.data, (d) => {
            return [moment(d.date).tz(process.env.VUE_APP_TIMEZONE).valueOf(), d.totalResult];
          }),
        });

        this.p1YAxisName = `${
          this.data[0].p1UM ? this.data[0].p1UM : "-"
        } - Target: ${this.data[0].p1Target ? this.data[0].p1Target : "-"}${
          this.data[0].p1UM ? this.data[0].p1UM : "-"
        }`;
        this.p2YAxisName = `${
          this.data[0].p2UM ? this.data[0].p2UM : "-"
        } - Target: ${this.data[0].p2Target ? this.data[0].p2Target : "-"}${
          this.data[0].p2UM ? this.data[0].p2UM : "-"
        }`;
        this.p3YAxisName = `${
          this.data[0].p3UM ? this.data[0].p3UM : "-"
        } - Target: ${this.data[0].p3Target ? this.data[0].p3Target : "-"}${
          this.data[0].p3UM ? this.data[0].p3UM : "-"
        }`;
        this.overallYAxisName = `${
          this.data[0].totalUM ? this.data[0].totalUM : "-"
        } - Target: ${
          this.data[0].totalTarget ? this.data[0].totalTarget : "-"
        }${this.data[0].totalUM ? this.data[0].totalUM : "-"}`;
      }
    },
    generateEvolution(data, yAxisName) {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        xAxis: [
          {
            name: "Date",
            type: "time",
            boundaryGap: false,
            axisLabel: {
              formatter: function (value) {
                return moment(new Date(Number(`${value}`))).tz(process.env.VUE_APP_TIMEZONE).format(
                  "DD/MM/YYYY"
                );
              },
            },
          },
        ],
        yAxis: [
          {
            name: yAxisName,
            type: "value",
          },
        ],
        series: data,
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
            filterMode: "none",
          },
          {
            start: 0,
            end: 100,
            filterMode: "none",
          },
        ],
      };
    },
    generateSuccess(data) {
      return {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Verified requests",
            type: "pie",
            radius: ["60%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 50,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };
    },
    popRandomColor() {
      var rand = Math.random();
      var color = this.colors[Math.floor(rand * this.colors.length)];
      this.colors.splice(Math.floor(rand * this.colors.length), 1);
      return color;
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
<style scoped>
.actionContainer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.box {
  width: 100%;
  height: 20px;
  border-bottom: 1px solid rgb(184, 181, 181);
  text-align: center;
}
.box-top {
  margin-top: 20px;
  font-weight: 450;
  font-size: 320%;
  text-align: center;
}
.box-bottom {
  margin-top: 30px;
  text-align: center;
  font-size: 120%;
}
</style>
