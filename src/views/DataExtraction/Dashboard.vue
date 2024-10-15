<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('dataExtraction')">
      <ods-form :model="search" ref="form">
        <ods-row :gutter="20">
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
            <ods-form-item :label="$t('database')" prop="database">
              <ods-select v-model="search.database" placeholder="" clearable>
                <ods-option
                  v-for="item in databases"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
          {{ $t("OnDemandExtraction") }}
        </ods-button>
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
        <ods-table-column prop="id" label="id" />
        <ods-table-column
          prop="dbsource"
          :label="$t('database')"
          width="120"
          sortable
        />
        <ods-table-column
          prop="created_at"
          :label="$t('creationDate')"
          width="170"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.createdAt | date }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column
          prop="end_date"
          :label="$t('endDate')"
          width="170"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.endDate | date }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column
          prop="extraction_start_date"
          :label="$t('extractionStartDate')"
          width="180"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.extractionStartDate | date2 }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column
          prop="extraction_end_date"
          :label="$t('extractionEndDate')"
          width="180"
          sortable
        >
          <template slot-scope="scope">
            <div v-if="scope.row" class="">
              {{ scope.row.extractionEndDate | date2 }}
            </div>
            <div v-if="!scope.row" class="">---</div>
          </template>
        </ods-table-column>
        <ods-table-column prop="status" :label="$t('status')">
          <template slot-scope="scope">
            <ods-badge
              v-if="scope.row"
              :value="!scope.row.status ? 'NOT_OK' : scope.row.status"
              :type="
                !scope.row.status
                  ? 'danger'
                  : scope.row.status === 'FINISH_OK'
                  ? 'success'
                  : scope.row.status === 'RUNNING'
                  ? 'warning'
                  : 'danger'
              "
            />
            {{ !scope.row ? "---" : "" }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="errorMessage"
          :label="$t('errorMessage')"
          width="250"
        >
          <template slot-scope="scope">
            {{
              scope.row && scope.row.errorMessage
                ? scope.row.errorMessage
                : "---"
            }}
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
      <DemandExtractionDialogVue
        :dialogVisible="dialogVisible"
        @cancel="handleCancel"
        @submit="toggleConfirmationDialog"
      />

      <CreateConfirm
        text="createExtractionConfirmationText"
        :visible="createConfirmation"
        :loading="loading"
        @confirm="executeExtraction()"
        @cancel="closeCreateConfirmation()"
      />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import handlePromise from "@/utils/promise";
import moment from "moment-timezone";
import DataExtractionService from "@/services/DataExtraction";
import DemandExtractionDialogVue from "./DemandExtractionDialog.vue";
import CreateConfirm from "../../custom-components/DialogConfirmation.vue";

export default {
  name: "DataExtractionDashboard",
  props: {
    params: Object,
  },
  components: {
    DemandExtractionDialogVue,
    CreateConfirm,
  },
  data() {
    return {
      loading: false,
      loadingExport: false,
      search: {},
      pageSize: 10,
      pageIndex: 0,
      pageStartZero: true,
      total: 0,
      sort: null,
      dialogVisible: false,
      createConfirmation: false,
      valueToShow: null,
      demandExtractionData: null,
      databases: [
        { id: "PostgreSQL", name: "PostgreSQL" },
        { id: "MongoDB", name: "MongoDB" },
        { id: "MongoDB2days", name: "MongoDB2days" },
      ],
      statuses: [
        { id: "RUNNING", name: "Running" },
        { id: "FINISH_OK", name: "Finish ok" },
        { id: "NOT_OK", name: "Not ok" },
      ],
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
    await this.getData();
  },
  methods: {
    async handleSearch() {
      this.handlePageChange(0);
    },
    async getData() {
      let auxParams = {};

      if (this.search.status) {
        auxParams = {
          status: this.search.status,
          ...auxParams,
        };
      }

      if (this.search.database) {
        auxParams = {
          dbsource: this.search.database,
          ...auxParams,
        };
      }

      if (this.search.startDateTime) {
        auxParams = {
          startdt: moment(this.search.startDateTime).startOf("day").format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
          ...auxParams,
        };
      }

      if (this.search.endDateTime) {
        auxParams = {
          enddt: moment(this.search.endDateTime).endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
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
        page:
          this.pageIndex === 0 && this.pageStartZero ? 0 : this.pageIndex - 1,
        size: this.pageSize,
        ...auxParams,
      };

      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        DataExtractionService.getDataExtractions(params)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      this.data = data.content;
      this.total = data.totalElements;
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
    async executeExtraction() {
      const end = moment(this.demandExtractionData.endDate).tz(`${process.env.VUE_APP_TIMEZONE}`).add(1, "day");
      const toSend = {
        startDate: moment(this.demandExtractionData.startDate).tz(`${process.env.VUE_APP_TIMEZONE}`).format(
          "YYYY-MM-DD"
        ),
        endDate: end.format("YYYY-MM-DD"),
      };
      this.toggleLoading();
      const [error, response] = await handlePromise(
        DataExtractionService.createExecution(
          this.demandExtractionData.database,
          toSend.startDate,
          toSend.endDate
        )
      );
      this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("onDemandExtractionCreated")
      );
      this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("The process will begin in a few seconds.")
      );

      this.toggleConfirmationDialog();
      this.dialogVisible = false;
    },
    handleCancel() {
      this.dialogVisible = false;
    },
    closeCreateConfirmation() {
      this.createConfirmation = false;
      this.demandExtractionData = null;
    },
    async handleSubmitOnDemandExecution() {
      await this.getData();
      this.dialogVisible = false;
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
    toggleConfirmationDialog(data) {
      if (data) {
        this.demandExtractionData = data;
      } else {
        this.demandExtractionData = null;
      }
      this.createConfirmation = !this.createConfirmation;
    },
  },
};
</script>
<style scoped>
.actionContainer {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
