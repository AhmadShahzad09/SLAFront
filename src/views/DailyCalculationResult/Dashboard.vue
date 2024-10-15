<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('dailyCalculationResults')">
      <ods-form :model="search" ref="form">
        <ods-row :gutter="20">
          <ods-col :md="8" :sm="12">
            <ods-form-item
              :label="$t('calculationMethods')"
              prop="calculationMethod"
            >
              <ods-select
                v-model="search.calculationMethod"
                placeholder=""
                filterable
                clearable
              >
                <ods-option
                  v-for="item in calculationMethods"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="8" :sm="12">
            <ods-form-item :label="$t('slaType')" prop="type">
              <ods-select v-model="search.type" placeholder="" clearable>
                <ods-option
                  v-for="item in types"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <!-- <ods-col :md="4" :sm="12">
            <ods-form-item :label="$t('p1Result')" prop="p1result">
              <ods-select v-model="search.p1result" placeholder="" clearable>
                <ods-option
                  v-for="item in results"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </ods-option>
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="4" :sm="12">
            <ods-form-item :label="$t('p2Result')" prop="p2result">
              <ods-select v-model="search.p2result" placeholder="" clearable>
                <ods-option
                  v-for="item in results"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </ods-option>
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="4" :sm="12">
            <ods-form-item :label="$t('p3Result')" prop="p3result">
              <ods-select v-model="search.p3result" placeholder="" clearable>
                <ods-option
                  v-for="item in results"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </ods-option>
              </ods-select>
            </ods-form-item>
          </ods-col> -->
          <ods-col :md="8" :sm="12">
            <ods-form-item :label="$t('zone')" prop="zone">
              <ods-select v-model="search.zone" placeholder="" clearable>
                <ods-option
                  v-for="item in zones"
                  :key="item.id"
                  :label="item.zone"
                  :value="item.zone"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('startDate')" prop="startDateTime">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="date"
                v-model="search.startDateTime"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('endDate')" prop="endDateTime">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="date"
                v-model="search.endDateTime"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-checkbox
              style="margin-top: 15px"
              v-model="search.lastExecution"
              :border="true"
              size="medium"
            >
              {{ $t("showLastExecution") }}
            </ods-checkbox>
          </ods-col>
        </ods-row>
      </ods-form>

      <div class="actionContainer">
        <ods-tooltip placement="top">
          <div slot="content">
            <ods-button
              :disabled="loadingExport"
              type="secundary"
              size="small"
              @click="download('csv')"
            >
              .CSV
            </ods-button>
            <hr />
            <ods-button
              :disabled="loadingExport"
              type="secundary"
              size="small"
              @click="download('xlsx')"
            >
              .XLSX
            </ods-button>
          </div>
          <ods-button
            :disabled="loadingExport"
            type="primary"
            class="ml-1"
            :circle="true"
            icon="ods-icon-download"
          />
        </ods-tooltip>
        <ods-button
          class="ml-1"
          type="primary"
          :circle="true"
          @click="getData(true)"
          icon="ods-icon-search"
        />
      </div>

      <TableResult
        :total="totalDaily"
        :data="dataDaily"
        :pageIndex="pageIndex"
        @sizeChange="handleSizeChange"
        @pageChange="handlePageChange"
        @handleSort="handleSort"
      />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import handlePromise from "@/utils/promise";
import moment from "moment-timezone";
import CalculationMethodService from "@/services/CalculationMethod";
import CalculationResultService from "@/services/CalculationResult";
import TableResult from "./TableResult.vue";

export default {
  name: "CalculationDashboard",
  components: {
    TableResult,
  },
  props: {
    params: Object,
  },
  data() {
    return {
      loading: false,
      loadingExport: false,
      search: {
        lastExecution: true,
        startDateTime: moment().startOf("month"),
        endDateTime: moment().endOf("month"),
      },
      types: ["Tolerance", "HES"],
      activeTab: "daily",
      results: [
        { id: "true", name: "Meet" },
        { id: "false", name: "Not Meet" },
      ],
      zones: [],
      calculationMethods: [],
      data: [],
      dataDaily: [],
      dataMonthly: [],
      totalDaily: 0,
      totalMonthly: 0,
      formatedData: [],
      pageIndex: 0,
      pageSize: 10,
    };
  },
  async mounted() {
    var self = this;
    addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.getData();
      }
    });
    this.loading = true;
    
    await this.getZones();

    await this.getCalculationMethods();

    await this.getData(true);

    this.loading = false;
  },
  methods: {
    async getZones() {
      const [error, response, data] = await handlePromise(
        CalculationResultService.getZones()
      );
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.zones = _.map(data, (z) => ({ id: z, zone: z }));
    },
    async getCalculationMethods() {
      const [error, response, data] = await handlePromise(
        CalculationMethodService.getCalculationMethods()
      );
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      this.calculationMethods = _.orderBy(
        data,
        [(d) => d.name.toLowerCase()],
        ["asc"]
      );
    },
    async getData(resetPage) {
      let auxParams = {};

      if (this.search.calculationMethod) {
        auxParams = {
          sla: this.search.calculationMethod,
          ...auxParams,
        };
      }

      if (this.search.type) {
        auxParams = {
          type: this.search.type,
          ...auxParams,
        };
      }

      if (this.search.p1result) {
        auxParams = {
          p1result: this.search.p1result,
          ...auxParams,
        };
      }

      if (this.search.p2result) {
        auxParams = {
          p2result: this.search.p2result,
          ...auxParams,
        };
      }

      if (this.search.p3result) {
        auxParams = {
          p3result: this.search.p3result,
          ...auxParams,
        };
      }

      if (this.search.startDateTime) {
        auxParams = {
          startdate: moment(this.search.startDateTime).startOf("day").format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
          ...auxParams,
        };
      }

      if (this.search.endDateTime) {
        auxParams = {
          enddate: moment(this.search.endDateTime).endOf("day").format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
          ...auxParams,
        };
      }

      if (this.search.zone) {
        auxParams = {
          zone: this.search.zone,
          ...auxParams,
        };
      }

      if (this.search.lastExecution) {
        auxParams = {
          last: 1,
          size: this.pageSize,
          ...auxParams,
        };
      }

      if (this.sort && this.sort.prop) {
        auxParams = {
          sort: `${this.sort.prop}${
            this.sort.order === "descending" ? ",desc" : ""
          }`,
          ...auxParams,
        };
      }

      let params = {
        page: resetPage
          ? 1
          : this.pageIndex === 0 && this.pageStartZero
          ? 0
          : this.pageIndex,
        size: this.pageSize,
        ...auxParams,
      };

      if (resetPage) this.pageIndex = 0;

      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationResultService.getDailyCalculationResults(params)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      this.data = data.content;
      this.totalDaily = data.totalElements;

      await this.formatData(this.data);

      this.dataDaily = this.formatedData;

      this.getDataToExport(params, data.totalElements);
    },
    async getDataToExport(params, totalElements) {
      const toSend = params;
      delete toSend.sort;
      this.loadingExport = true;
      const [error, response, data] = await handlePromise(
        CalculationResultService.getDailyCalculationResults({
          ...toSend,
          size: totalElements,
        })
      );
      if (!response.ok) {
        this.loadingExport = true;
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      await this.formatData(data.content);
      this.loadingExport = false;
    },
    formatData(data) {
      this.formatedData = [];
      for (let i = 0; i < data.length; i++) {
        let id = data[i].slaExecutionDto.id ? data[i].slaExecutionDto.id : null;
        let calculationMethodId =
          data[i].slaExecutionDto &&
          data[i].slaExecutionDto.scheduleId &&
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            ? data[i].slaExecutionDto.scheduleId.calculationMethodsId.id
            : null;
        let plannedExecutionTime =
          data[i].slaExecutionDto &&
          data[i].slaExecutionDto.scheduleId &&
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            ? data[i].slaExecutionDto.scheduleId.calculationMethodsId
                .plannedExecutionTime
            : null;
        let name = data[i].slaExecutionDto.scheduleId.calculationMethodsId.name;
        let desc =
          data[i].slaExecutionDto.scheduleId.calculationMethodsId.description;
        let date = data[i].slaExecutionDto.slaDate;
        let startDate = data[i].slaExecutionDto.startDateTime;
        let endDate = data[i].slaExecutionDto.endDateTime;
        let type =
          data[i].slaExecutionDto.scheduleId.calculationMethodsId.slaType;
        let scheduleId = data[i].slaExecutionDto.scheduleId
          ? data[i].slaExecutionDto.scheduleId.id
          : null;
        let totalObjetive = _.filter(
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "Overall" || t.type === "overall";
          }
        );
        let totalResult = data[i].slaExecutionDto.overallAchieved;
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
            : totalObjetive.length > 0 &&
              totalObjetive[0].compare === "<=" &&
              totalResult <= totalTarget
            ? true
            : totalObjetive.length > 0 &&
              totalObjetive[0].compare === ">=" &&
              totalResult >= totalTarget
            ? true
            : !!(
                totalObjetive.length > 0 &&
                totalObjetive[0].compare === "=" &&
                totalResult === totalTarget
              );
        let totalAffected = data[i].slaExecutionDto.overallMetersAffected;

        let p1Objetive = _.filter(
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p1";
          }
        );
        let p1Result = data[i].slaExecutionDto.p1Achieved;
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
            : p1Objetive.length > 0 &&
              p1Objetive[0].compare === "<=" &&
              p1Result <= p1Target
            ? true
            : p1Objetive.length > 0 &&
              p1Objetive[0].compare === ">=" &&
              p1Result >= p1Target
            ? true
            : !!(
                p1Objetive.length > 0 &&
                p1Objetive[0].compare === "=" &&
                p1Result === p1Target
              );
        let p1Affected = data[i].slaExecutionDto.p1MetersAffected;

        let p2Objetive = _.filter(
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p2";
          }
        );
        let p2Result = data[i].slaExecutionDto.p2Achieved;
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
            : p2Objetive.length > 0 &&
              p2Objetive[0].compare === "<=" &&
              p2Result <= p2Target
            ? true
            : p2Objetive.length > 0 &&
              p2Objetive[0].compare === ">=" &&
              p2Result >= p2Target
            ? true
            : !!(
                p2Objetive.length > 0 &&
                p2Objetive[0].compare === "=" &&
                p2Result === p2Target
              );
        let p2Affected = data[i].slaExecutionDto.p2MetersAffected;

        let p3Objetive = _.filter(
          data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p3";
          }
        );
        let p3Result = data[i].slaExecutionDto.p3Achieved;
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
            : p3Objetive.length > 0 &&
              p3Objetive[0].compare === "<=" &&
              p3Result <= p3Target
            ? true
            : p3Objetive.length > 0 &&
              p3Objetive[0].compare === ">=" &&
              p3Result >= p3Target
            ? true
            : !!(
                p3Objetive.length > 0 &&
                p3Objetive[0].compare === "=" &&
                p3Result === p3Target
              );
        let p3Affected = data[i].slaExecutionDto.p3MetersAffected;
        let zone =
          data[i].slaExecutionDto && data[i].slaExecutionDto.zone
            ? data[i].slaExecutionDto.zone
            : null;

        this.formatedData.push({
          name,
          desc,
          date,
          startDate,
          endDate,
          type,
          scheduleId,
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
          zone,
          id,
          calculationMethodId,
          plannedExecutionTime,
        });
      }
    },
    download(type) {
      const toExport = _.orderBy(
        _.map(this.formatedData, (d) => {
          return {
            Name: d.name ? d.name : "---",
            SLA: d.desc ? d.desc : "---",
            Date: d.date ? moment(d.date).tz(process.env.VUE_APP_TIMEZONE).tz(process.env.VUE_APP_TIMEZONE).format("DD-MM-YYYY") : "---",

            "Overall Achieved": d.totalResult ? d.totalResult : 0,
            "Overall target": d.totalTarget ? d.totalTarget : 0,
            // "Overall ok": d.totalOk ? "Meet" : "Not meet",
            "Overall total meters affected": d.totalAffected
              ? d.totalAffected
              : 0,

            "P1 Achieved": d.p1Result ? d.p1Result : 0,
            "P1 target": d.p1Target ? d.p1Target : 0,
            // "P1 ok": d.p1Ok ? "Meet" : "Not meet",
            "P1 total meters affected": d.p1Affected ? d.p1Affected : 0,

            "P2 Achieved": d.p2Result ? d.p2Result : 0,
            "P2 target": d.p2Target ? d.p2Target : 0,
            // "P2 ok": d.p2Ok ? "Meet" : "Not meet",
            "P2 total meters affected": d.p2Affected ? d.p2Affected : 0,

            "P3 Achieved": d.p3Result ? d.p3Result : 0,
            "P3 target": d.p3Target ? d.p3Target : 0,
            // "P3 ok": d.p3Ok ? "Meet" : "Not meet",
            "P3 total meters affected": d.p3Affected ? d.p3Affected : 0,
            Zone: d.zone ?? "---",
          };
        }),
        ["Name"],
        ["asc"]
      );

      const sheetName = `${
        this.search.startDateTime
          ? moment(this.search.startDateTime).tz(process.env.VUE_APP_TIMEZONE).format("DD-MM-YYYY")
          : ""
      } ${
        this.search.startDateTime && this.search.endDateTime ? " " : "Sheet"
      } ${
        this.search.endDateTime
          ? moment(this.search.endDateTime).tz(process.env.VUE_APP_TIMEZONE).format("DD-MM-YYYY")
          : ""
      } `;

      const name = "Daily Calculation results";
      this.$store.commit("exports/downloadEXCEL", {
        data: toExport,
        sheetName: sheetName,
        name: name,
        type: type,
      });
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData(true);
    },
    handlePageChange(val) {
      this.pageIndex = val;
      this.getData(false);
    },
    handleSort(val) {
      if (val) this.sort = { prop: val.prop, order: val.order };
      this.getData(false);
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

.tabLabelText {
  font-size: larger;
  font-weight: 500;
}

.tabLabelIcon {
  margin-right: 8px;
}
</style>
