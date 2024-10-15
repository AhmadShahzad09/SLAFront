<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('monitoringExecution')">
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
            <ods-form-item :label="$t('users')" prop="user">
              <ods-select v-model="search.user" placeholder="" clearable>
                <ods-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.email"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('status')" prop="status">
              <ods-select v-model="search.status" placeholder="" clearable>
                <ods-option
                  v-for="item in statuses"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('result')" prop="result">
              <ods-select v-model="search.result" placeholder="" clearable>
                <ods-option
                  v-for="item in results"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
        </ods-row>
        <ods-row :gutter="20">
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('audit')" prop="audit">
              <ods-select v-model="search.audit" placeholder="">
                <ods-option
                  v-for="item in audits"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </ods-select>
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('slaDate')" prop="slaDate">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="date"
                v-model="search.slaDate"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('startDateTime')" prop="startDateTime">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="datetime"
                v-model="search.startDateTime"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('endDateTime')" prop="endDateTime">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="datetime"
                v-model="search.endDateTime"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>

          <ods-col :md="6" :sm="12">
            <ods-checkbox
              v-model="search.lastMonth"
              :border="true"
              size="medium"
            >
              {{ $t("showCurrentMonthOnly") }}
            </ods-checkbox>
          </ods-col>
        </ods-row>
      </ods-form>

      <div class="actionContainer">
        <ods-button
          style="margin-right: auto"
          @click="dialogVisible = true"
          size="medium"
          type="success"
          icon="ods-icon-info"
        >
          {{ $t("OnDemandExecution") }}
        </ods-button>
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
          @click="handleSearch"
          icon="ods-icon-search"
        />
      </div>

      <ods-table
        :data="data"
        v-loading="loading"
        size="mini"
        style="width: 100%"
        @sort-change="handleSort"
      >
        <ods-table-column
          prop="slaName"
          :label="$t('slaName')"
          width="100"
          sortable
        />
        <ods-table-column prop="user" :label="$t('user')" width="150">
          <template slot-scope="scope">
            {{ scope.row && scope.row.email ? scope.row.email : "---" }}
          </template>
        </ods-table-column>
        <ods-table-column prop="status" :label="$t('status')">
          <template slot-scope="scope">
            <ods-badge
              v-if="scope.row"
              :value="!scope.row.status ? 'error' : scope.row.status"
              :type="
                !scope.row.status
                  ? 'danger'
                  : scope.row.status === 'done'
                  ? 'success'
                  : scope.row.status === 'pending'
                  ? 'secondary'
                  : 'warning'
              "
            />
            {{ !scope.row ? "---" : "" }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="slaDate"
          :label="$t('slaDate')"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.slaDate | date2 }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column
          prop="startDateTime"
          :label="$t('startDateTime')"
          width="175"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.startDateTime }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column
          prop="endDateTime"
          :label="$t('endDateTime')"
          width="175"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.endDateTime }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column prop="zone" :label="$t('zone')" width="125">
          <template slot-scope="scope">
            {{ scope.row && scope.row.zone ? scope.row.zone : "---" }}
          </template>
        </ods-table-column>
        <ods-table-column prop="result" :label="$t('result')">
          <template slot-scope="scope">
            <ods-badge
              v-if="scope.row && scope.row.executionResult"
              :value="scope.row.executionResult === 'ok' ? 'OK' : 'NOT OK'"
              :type="scope.row.executionResult === 'ok' ? 'success' : 'danger'"
            />
            {{ !scope.row ? "---" : "" }}
          </template>
        </ods-table-column>
        <ods-table-column prop="audit" :label="$t('audit')">
          <template slot-scope="scope">
            {{ scope.row.audit ? "true" : "false" }}
          </template>
        </ods-table-column>
        <ods-table-column :label="$t('details')">
          <template slot-scope="scope">
            <div v-show="scope.row && !scope.row.audit">
              <ods-popover
                transition="ods-zoom-in-center"
                :ref="scope.row.id"
                placement="top-start"
                width="220"
                trigger="hover"
              >
                <div>
                  <span class="font-weight-bold">
                    {{ $t("overallArchieved") }} :
                    {{
                      scope.row && scope.row.overallAchieved
                        ? scope.row.overallAchieved
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("overallMetersAffected") }} :
                    {{
                      scope.row && scope.row.overallMetersAffected
                        ? scope.row.overallMetersAffected
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p1Achieved") }} :
                    {{
                      scope.row && scope.row.p1Achieved
                        ? scope.row.p1Achieved
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p1MetersAffected") }} :
                    {{
                      scope.row.p1MetersAffected
                        ? scope.row.p1MetersAffected
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p2Achieved") }} :
                    {{
                      scope.row && scope.row.p2Achieved
                        ? scope.row.p2Achieved
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p2MetersAffected") }} :
                    {{
                      scope.row && scope.row.p2MetersAffected
                        ? scope.row.p2MetersAffected
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p3Achieved") }} :
                    {{
                      scope.row && scope.row.p3Achieved
                        ? scope.row.p3Achieved
                        : "---"
                    }}
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{ $t("p3MetersAffected") }} :
                    {{
                      scope.row && scope.row.p3MetersAffected
                        ? scope.row.p3MetersAffected
                        : "---"
                    }}
                  </span>
                </div>
              </ods-popover>
              <ods-button
                size="mini"
                type="primary"
                icon="ods-icon-eye"
                v-popover="scope.row.id"
              />
            </div>
            <div
              v-show="
                scope.row &&
                scope.row.audit &&
                scope.row.status === 'done' &&
                scope.row.executionResult === 'ok'
              "
            >
              <ods-button
                size="mini"
                type="primary"
                icon="ods-icon-download"
                @click="downloadAudit(scope.row.id)"
              />
            </div>
            <div v-if="!scope.row">---</div>
          </template>
        </ods-table-column>
      </ods-table>
      <div class="block">
        <ods-pagination
          :total="total"
          :page-size="pageSize"
          :current-page.sync="pageIndex"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          layout="prev, pager, next, jumper, sizes, ->, total"
        >
        </ods-pagination>
      </div>
      <DemandExecutionDialogVue
        :dialogVisible="dialogVisible"
        @cancel="handleCancel"
        @submit="handleSubmitOnDemandExecution"
      />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import handlePromise from "@/utils/promise";
import moment from "moment-timezone";
import ExecutionService from "@/services/Execution";
import DemandExecutionDialogVue from "./DemandExecutionDialog.vue";
import CalculationMethodService from "@/services/CalculationMethod";
import UserService from "@/services/User";
import storage from "../../utils/storage";
import axios from "axios";

export default {
  name: "MonitoringExecutionDashboard",
  props: {
    params: Object,
  },
  components: {
    DemandExecutionDialogVue,
  },
  data() {
    return {
      loading: false,
      loadingExport: false,
      search: {
        lastMonth: true,
        audit: "false",
      },
      pageSize: 10,
      pageIndex: 0,
      pageStartZero: true,
      total: 0,
      sort: null,
      dialogVisible: false,
      valueToShow: null,
      user: null,
      audits: [
        { id: "false", name: "False" },
        { id: "true", name: "True" },
      ],
      results: [
        { id: "ok", name: "Ok" },
        { id: "Not ok", name: "Not ok" },
      ],
      statuses: [
        { id: "pending", name: "Pending" },
        // { id: "inProgress", name: "In progress" },
        { id: "done", name: "Done" },
      ],
      calculationMethods: [],
      users: [],
      data: [],
      dataToExport: [],
    };
  },
  async mounted() {
    var self = this;
    addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.getData();
      }
    });

    this.getCalculationMethods();

    this.getUsers();

    await this.getData();
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
    async getUsers() {
      const [error, response, data] = await handlePromise(
        UserService.getUsers()
      );
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      this.users = data;
    },
    async handleSearch() {
      this.handlePageChange(0);
    },
    async getData() {
      let auxParams = {};

      if (this.search.calculationMethod) {
        auxParams = {
          sla: this.search.calculationMethod,
          ...auxParams,
        };
      }

      if (this.search.user) {
        auxParams = {
          userId: this.search.user,
          ...auxParams,
        };
      }

      if (this.search.status) {
        auxParams = {
          status: this.search.status,
          ...auxParams,
        };
      }

      if (this.search.result) {
        auxParams = {
          result: this.search.result,
          ...auxParams,
        };
      }

      if (this.search.audit) {
        auxParams = {
          audit: this.search.audit,
          ...auxParams,
        };
      }

      if (this.search.slaDate) {
        auxParams = {
          date: moment(this.search.slaDate)
            .tz(`${process.env.VUE_APP_TIMEZONE}`)
            .format("YYYY-MM-DD"),
          ...auxParams,
        };
      }

      if (this.search.startDateTime) {
        auxParams = {
          startdate: moment(this.search.startDateTime)
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss"),
          ...auxParams,
        };
      }

      if (this.search.endDateTime) {
        auxParams = {
          enddate: moment(this.search.endDateTime)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss"),
          ...auxParams,
        };
      }

      if (this.search.lastMonth) {
        auxParams = {
          lastmonth: 1,
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
        page: this.pageIndex === 0 && this.pageStartZero ? 0 : this.pageIndex,
        size: this.pageSize,
        ...auxParams,
      };

      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        ExecutionService.getExecutions(params)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      this.data = data.content;
      this.total = data.totalElements;

      this.getDataToExport(params, data.totalElements);
    },
    async getDataToExport(params, totalElements) {
      const toSend = params;
      delete toSend.sort;
      delete toSend.page;
      this.loadingExport = true;
      const [error, response, data] = await handlePromise(
        ExecutionService.getExecutions({
          ...toSend,
          size: totalElements,
          page: 0,
        })
      );
      if (!response.ok) {
        this.loadingExport = true;
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.dataToExport = data.content;
      this.loadingExport = false;
    },
    async downloadAudit(executionId) {
      this.loading = true;
      const [error, response, data] = await handlePromise(
        ExecutionService.getExecutionAudit(executionId)
      );
      if (!response.ok) {
        this.loading = false;
        if (response.status === 404) {
          return this.$store.commit(
            "settings/toggleAlert",
            "File no longer available, try a new execution in audit mode"
          );
        } else {
          return this.$store.commit("settings/toggleAlert", this.$t(error));
        }
      }

      await this.axiosApiCall(executionId);
      this.loading = false;
    },
    async axiosApiCall(executionId) {
      const accessToken = _.get(storage.get(), "user.data.token");
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}administration/audit/${executionId}`,
          {
            headers: {
              Accept: "application/zip",
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "audit.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
    },

    download(type) {
      const toExport = _.map(this.dataToExport, (d) => {
        return {
          "SLA name": d && d.slaName ? d.slaName : "---",
          User: d && d.email ? d.email : "---",
          Status: d && d.status ? d.status : "---",
          "SLA date": d && d.slaDate ? d.slaDate : "---",
          "SLA start datetime": d && d.startDateTime ? d.startDateTime : "---",
          "SLA end datetime": d && d.endDateTime ? d.endDateTime : "---",
          Zone: d && d.zone ? d.zone : "---",
          Result: d && d.executionResult ? d.executionResult : "---",
          "Overall archieved": d && d.overallAchieved ? d.overallAchieved : 0,
          "Overall meters affected":
            d && d.overallMetersAffected ? d.overallMetersAffected : 0,
          "P1 Achieved": d && d.p1Achieved ? d.p1Achieved : 0,
          "P1 Meters Affected":
            d && d.p1MetersAffected ? d.p1MetersAffected : 0,
          "P2 Achieved": d && d.p2Achieved ? d.p2Achieved : 0,
          "P2 Meters Affected":
            d && d.p2MetersAffected ? d.p2MetersAffected : 0,
          "P3 Achieved": d && d.p3Achieved ? d.p3Achieved : "",
          "P3 Meters Affected":
            d && d.p3MetersAffected ? d.p3MetersAffected : 0,
        };
      });
      const name = "Executions";
      this.$store.commit("exports/downloadEXCEL", {
        data: toExport,
        name: name,
        type: type,
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handlePageChange(val) {
      this.pageIndex = val;
      this.getData();
    },
    handleSort(val) {
      if (val) this.sort = { prop: val.prop, order: val.order };
      this.getData();
      // if (this.sort && this.sort.prop && this.sort.order) {
      //   this.baseData = _.orderBy(
      //     this.data,
      //     [this.sort.prop],
      //     [this.sort.order === "ascending" ? "asc" : "desc"]
      //   );
      //   this.dataTable = this.baseData.slice(
      //     (this.pageIndex - 1) * this.pageSize,
      //     this.pageIndex * this.pageSize
      //   );
      // } else {
      //   this.dataTable = this.data.slice(
      //     (this.pageIndex - 1) * this.pageSize,
      //     this.pageIndex * this.pageSize
      //   );
      // }
    },
    handleCancel() {
      this.dialogVisible = false;
    },
    async handleSubmitOnDemandExecution() {
      await this.getData();
      this.dialogVisible = false;
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
<style scoped>
.actionContainer {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
