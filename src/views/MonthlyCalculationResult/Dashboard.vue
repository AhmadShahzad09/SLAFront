<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('monthlyCalculationResults')">
      <ods-form :model="search" ref="form">
        <ods-row :gutter="20">
          <ods-col :md="6" :sm="12">
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
          <ods-col :md="6" :sm="12">
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
          <ods-col :md="4" :sm="12">
            <ods-checkbox
              style="margin-top: 15px"
              v-model="search.lastExecution"
              :border="true"
              size="medium"
            >
              {{ $t("showLastExecution") }}
            </ods-checkbox>
          </ods-col>
          <ods-col :md="4" :sm="12">
            <ods-button
              style="margin-top: 17px"
              size="small"
              type="primary"
              @click="toggleDialog"
            >
              {{ $t("calculateMonth") }}
            </ods-button>
          </ods-col>
        </ods-row>
      </ods-form>

      <div class="actionContainer">
        <ods-tooltip placement="top">
          <div slot="content">
            <ods-button type="secundary" size="small" @click="download('csv')">
              .CSV
            </ods-button>
            <hr />
            <ods-button type="secundary" size="small" @click="download('xlsx')">
              .XLSX
            </ods-button>
          </div>
          <ods-button
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
          @click="getData"
          icon="ods-icon-search"
        />
      </div>

      <TableResult :total="totalMonthly" :data="dataMonthly" />
      <CalculateMonthDialog
        :dialogVisible="dialogVisible"
        @cancel="toggleDialog"
        @submit="handleDialogSubmit"
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
import CalculateMonthDialog from "./CalculateMonthDialog";
import TableResult from "./TableResult";

export default {
  name: "CalculationDashboard",
  components: {
    TableResult,
    CalculateMonthDialog,
  },
  props: {
    params: Object,
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      search: {
        lastExecution: true,
        startDateTime: moment().tz(`${process.env.VUE_APP_TIMEZONE}`).startOf("month"),
        endDateTime: moment().tz(`${process.env.VUE_APP_TIMEZONE}`).endOf("month"),
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
      dataMonthly: [],
      totalMonthly: 0,
      formatedData: [],
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

    await this.getCalculationMethods();

    await this.getData();

    this.loading = false;
  },
  methods: {
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
    async getData() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationResultService.getMonthlyCalculationResults({
          lastExecution: false,
        })
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.data = data;

      if (this.search.calculationMethod) {
        this.data = _.filter(this.data, (d) => {
          return d.sla_name === this.search.calculationMethod;
        });
      }

      if (this.search.type) {
        this.data = _.filter(this.data, (d) => {
          return d.type.toLowerCase() === this.search.type.toLowerCase();
        });
      }

      if (this.search.startDateTime) {
        this.data = _.filter(this.data, (d) => {
          return (
            moment(d.sla_date).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf() >=
            moment(this.search.startDateTime).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf()
          );
        });
      }

      if (this.search.endDateTime) {
        this.data = _.filter(this.data, (d) => {
          return (
            moment(d.sla_date).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf() <=
            moment(this.search.endDateTime).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf()
          );
        });
      }

      if (this.search.lastExecution) {
        this.data = _.uniqBy(
          _.orderBy(this.data, ["sla_date"], ["desc"]),
          _.over(["sla_name", "zone", "sla_date"])
        );
      } else {
        var aux2 = [];
        await _.map(
          _.map(_.groupBy(this.data, "sla_date"), (d) => {
            return _.uniqBy(d, _.over(["sla_name", "zone"]));
          }),
          (main) => _.map(main, (data) => aux2.push(data))
        );

        this.data = aux2;
      }

      if (this.search.zone) {
        this.data = _.filter(this.data, (d) => {
          return (
            d.zone && d.zone.toLowerCase() === this.search.zone.toLowerCase()
          );
        });
      }

      this.zones = _.filter(_.uniqBy(this.data, "zone"), (z) => {
        return z.zone;
      });

      this.dataMonthly = this.data;
      this.totalMonthly = this.data.length;
    },
    download(type) {
      const toExport = _.orderBy(
        _.map(this.data, (d) => {
          return {
            "SLA Name": d.sla_name ? d.sla_name : "---",
            Date: d.sla_date ? d.sla_date : "---",
            "Overall Achieved": d.overall_achieved ? d.overall_achieved : 0,
            "Overall total meters affected": d.total_meters_overall
              ? d.total_meters_overall
              : 0,

            "P1 Achieved": d.p1_achieved ? d.p1_achieved : 0,
            "P1 total meters affected": d.total_meters_p1
              ? d.total_meters_p1
              : 0,

            "P2 Achieved": d.p2_achieved ? d.p2_achieved : 0,
            "P2 total meters affected": d.total_meters_p2
              ? d.total_meters_p2
              : 0,

            "P3 Achieved": d.p3_achieved ? d.p3_achieved : 0,
            "P3 total meters affected": d.total_meters_p3
              ? d.total_meters_p3
              : 0,
            Zone: d.zone ?? "---",
          };
        }),
        ["SLA Name"],
        ["asc"]
      );

      const sheetName = _.head(
        _.sortBy(
          _.map(this.data, (d) => {
            return {
              date: d.sla_date,
              value: moment(d.sla_date).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf(),
            };
          }),
          ["desc"]
        )
      ).date;

      const name = "Monthly Calculation results";
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
    toggleDialog() {
      this.dialogVisible = !this.dialogVisible;
    },
    handleDialogSubmit() {
      this.getData();
      this.dialogVisible = !this.dialogVisible;
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
