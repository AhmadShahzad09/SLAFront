<template>
  <section v-loading="loading">
    <ods-table
      :data="dataTable"
      v-loading="loading"
      size="mini"
      style="width: 100%"
    >
      <ods-table-column prop="name" width="150" :label="$t('name')" />
      <ods-table-column prop="desc" width="400" :label="$t('sla')" />
      <ods-table-column prop="date" width="160" :label="$t('date')">
        <template slot-scope="scope">
          {{ scope.row.date | date2 }}
        </template>
      </ods-table-column>
      <ods-table-column prop="totalResult" width="150" :label="$t('overall')">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row">
            <span :class="scope.row.totalOk ? 'success' : 'danger'">
              {{ scope.row.totalResult ? scope.row.totalResult : 0 }}
              {{ scope.row.totalUM }}
            </span>

            <span style="display: flex; flex-direction: row">
              <p style="color: #047dba">
                {{
                  scope.row.totalTarget ? "/" + scope.row.totalTarget : "/" + 0
                }}
                {{ scope.row.totalUM }}
              </p>
            </span>
          </div>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="totalAffected"
        width="220"
        :label="$t('overallTotalAffected')"
      />
      <ods-table-column prop="p1Result" width="150" :label="$t('p1')">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row">
            <span :class="scope.row.p1Ok ? 'success' : 'danger'">
              {{ scope.row.p1Result ? scope.row.p1Result : 0 }}
              {{ scope.row.p1UM }}
            </span>

            <span style="display: flex; flex-direction: row; color: #047dba">
              <p style="color: #047dba">
                {{ scope.row.p1Target ? "/" + scope.row.p1Target : "/" + 0 }}
                {{ scope.row.p1UM }}
              </p>
            </span>
          </div>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="p1Affected"
        width="150"
        :label="$t('p1Affected')"
      />
      <ods-table-column prop="p2Result" width="150" :label="$t('p2')">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row">
            <span :class="scope.row.p2Ok ? 'success' : 'danger'">
              {{ scope.row.p2Result ? scope.row.p2Result : 0 }}
              {{ scope.row.p2UM }}
            </span>

            <span style="display: flex; flex-direction: row; color: #047dba">
              <p style="color: #047dba">
                {{ scope.row.p2Target ? "/" + scope.row.p2Target : "/" + 0 }}
                {{ scope.row.p2UM }}
              </p>
            </span>
          </div>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="p2Affected"
        width="160"
        :label="$t('p2Affected')"
      />
      <ods-table-column prop="p3Result" width="150" :label="$t('p3')">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row">
            <span :class="scope.row.p3Ok ? 'success' : 'danger'">
              {{ scope.row.p3Result ? scope.row.p3Result : 0 }}
              {{ scope.row.p3UM }}
            </span>

            <span style="display: flex; flex-direction: row; color: #047dba">
              <p style="color: #047dba">
                {{ scope.row.p3Target ? "/" + scope.row.p3Target : "/" + 0 }}
                {{ scope.row.p3UM }}
              </p>
            </span>
          </div>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="p3Affected"
        width="160"
        :label="$t('p3Affected')"
      />
      <ods-table-column prop="zone" width="150" :label="$t('zone')">
        <template slot-scope="scope">
          {{ scope.row.zone ? scope.row.zone : "---" }}
        </template>
      </ods-table-column>
      <ods-table-column :label="$t('audit')">
        <template slot-scope="scope">
          <ods-button
            @click="toggleConfirmationAudith(scope.row)"
            type="primary"
            size="small"
            :circle="true"
            icon="ods-icon-audit"
          />
        </template>
      </ods-table-column>
      <ods-table-column width="150" :label="$t('nonCompliant')">
        <template slot-scope="scope">
          <ods-button
            @click="toggleConfirmationNonCompliant(scope.row)"
            type="primary"
            size="small"
            :circle="true"
            icon="ods-icon-stethoscope"
          />
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
    <ConfirmationDialog
      text="auditConfirmationText"
      :visible="showAuditConfirmation"
      alertTextBoxType="info"
      :loading="loading"
      @confirm="audith()"
      @cancel="toggleConfirmationAudith()"
    />
    <ConfirmationDialog
      text="nonCompliantConfirmationText"
      :visible="showNonCompliantConfirmation"
      alertTextBoxType="info"
      :loading="loading"
      @confirm="nonCompliant()"
      @cancel="toggleConfirmationNonCompliant()"
    />
  </section>
</template>

<script>
import _ from "lodash";
import moment from "moment-timezone";
import handlePromise from "@/utils/promise";
import ExecutionService from "@/services/Execution";
import CalculationResultService from "@/services/CalculationResult";
import ConfirmationDialog from "../../custom-components/DialogConfirmation.vue";
import Vue from "vue";
import * as XLSX from 'xlsx';

export default {
  name: "TableResult",
  props: {
    total: Number,
    data: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    pageIndex: {
      default: 1,
    },
    lastExecution: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      loading: false,
      dataTable: [],
      pageSize: 10,
      sort: null,
      currentAudit: null,
      currentNonCompliant: null,
      showAuditConfirmation: false,
      showNonCompliantConfirmation: false,
      toExport: null,
    };
  },
  methods: {
    async downloadExcel(formattedData, sheetName, name) {
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${name}.xlsx`);
      console.log("Archivo descargado:", name);
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handlePageChange(val) {
      this.$emit("pageChange", val);
    },
    // handleSort(val) {
    //   this.$emit("handleSort", val);
    // },
    async toggleConfirmationAudith(row) {
      if (row) {
        this.currentAudit = row;
      } else {
        this.currentAudit = null;
      }
      this.showAuditConfirmation = !this.showAuditConfirmation;
    },
    async audith() {
      if (!this.loading) this.toggleLoading();
      const toSend = {
        calculationMethodsId: this.currentAudit.calculationMethodId,
        date: moment(this.currentAudit.date).tz(`${process.env.VUE_APP_TIMEZONE}`).format(),
        isAudit: true,
      };
      const [error, response] = await handlePromise(
        ExecutionService.createExecution(toSend)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.showAuditConfirmation = false;
      return this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("onDemandExecutionCreated")
      );
    },
    async toggleConfirmationNonCompliant(row) {
      if (row) {
        this.currentNonCompliant = row;
      } else {
        this.currentNonCompliant = null;
      }
      this.showNonCompliantConfirmation = !this.showNonCompliantConfirmation;
    },
    async nonCompliant() {
      if (!this.loading) this.toggleLoading();
      const [error, response] = await handlePromise(
        CalculationResultService.getNonCompliantData(
          this.currentNonCompliant.id
        )
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.toExport = response.data;
      await this.download();
      this.showNonCompliantConfirmation = false;
      return this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("File downloaded")
      );
    },
    async download() {
      const batchSize = 50000; // Tamaño del lote
      const totalRecords = this.toExport.length;
      const sheetNamePrefix = Vue.filter("date4")(this.currentNonCompliant.date);
      const namePrefix = `${this.currentNonCompliant.name ?? ""} Failed SLAs - Batch`;
      const workbook = XLSX.utils.book_new();

      for (let startIndex = 0; startIndex < totalRecords; startIndex += batchSize) {
        const endIndex = Math.min(startIndex + batchSize, totalRecords);
        const batchData = this.toExport.slice(startIndex, endIndex);
        let sheetName = `${sheetNamePrefix} - Batch ${Math.ceil((endIndex / batchSize))}`;

        const formattedData = batchData.map(d => ({
          "Init time": d?.inittime ? moment(d.inittime).tz(process.env.VUE_APP_TIMEZONE).format("DD-MM-YYYY HH:mm") : "---",
          "Finish time": d?.finishtime ? moment(d.finishtime).tz(process.env.VUE_APP_TIMEZONE).format("DD-MM-YYYY HH:mm") : "---",
          "Organization": d?.organization || '---',
          "Order name": d?.order_name || "---",
          "Order status": d?.order_status || "---",
          Priority: d?.priority || "---",
          "Serial number": d?.serial_number || "---",
          Status: d?.status || 0,
          Zone: d?.zone || "---",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      XLSX.writeFile(workbook, `${namePrefix}.xlsx`);
      console.log("Archivo descargado:", `${namePrefix}.xlsx`);
    }
  },
  watch: {
    data: function () {
      this.dataTable = this.data;
    },
  },
};
</script>
<style scoped>
.danger {
  color: red;
}

.success {
  color: green;
}
</style>
