<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('calculationMethods')">
      <ods-form :model="search" ref="form">
        <ods-row :gutter="20">
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('name')" prop="name">
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
            <ods-form-item
              :label="$t('calculationModule')"
              prop="calculationModule"
            >
              <ods-select
                v-model="search.calculationModule"
                placeholder=""
                clearable
              >
                <ods-option
                  v-for="item in modules"
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
          type="primary"
          class="ml-1"
          :circle="true"
          @click="toggleDialog()"
          icon="ods-icon-plus"
        />
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
          type="primary"
          class="ml-1"
          :circle="true"
          @click="getData"
          icon="ods-icon-search"
        />
      </div>

      <ods-table
        :data="dataTable"
        v-loading="loading"
        size="mini"
        style="width: 100%"
        @sort-change="handleSort"
      >
        <ods-table-column
          prop="name"
          :label="$t('name')"
          width="100"
          sortable
        />
        <ods-table-column
          prop="description"
          :label="$t('description')"
          width="420"
        />
        <ods-table-column
          prop="slaType"
          :label="$t('type')"
          width="100"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.slaType ? scope.row.slaType : "---" }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="plannedExecutionTime"
          :label="$t('plannedExecutionTime')"
          width="180"
          sortable
        >
          <template slot-scope="scope">
            {{
              scope.row.plannedExecutionTime
                ? scope.row.plannedExecutionTime
                : "---"
            }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="calculationModuleId"
          :label="$t('calculationModule')"
        >
          <template slot-scope="scope">
            {{
              scope.row.calculationModuleId
                ? scope.row.calculationModuleId.name
                : "---"
            }}
          </template>
        </ods-table-column>
        <ods-table-column :label="$t('actions')" width="200">
          <template slot-scope="scope">
            <ods-button
              size="mini"
              type="warning"
              icon="ods-icon-pencil"
              @click="toggleDialog(scope.row)"
            />
            <ods-button
              size="mini"
              type="danger"
              icon="ods-icon-delete"
              @click="toggleDeleteDialog(scope.row)"
            />
          </template>
        </ods-table-column>
      </ods-table>
      <div class="block">
        <ods-pagination
          :total="total"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :current-page.sync="pageIndex"
          @current-change="handlePageChange"
          layout="prev, pager, next, jumper, sizes, ->, total"
        >
        </ods-pagination>
      </div>
      <EditCalculationMethod
        :dialogVisible="dialogVisible"
        :calculationMethods="calculationMethods"
        @cancel="toggleDialog"
        @submit="handleDialogSubmit"
        :toEdit="toEdit"
      />
      <DeleteConfirm
        :visible="deleteConfirmation"
        :loading="loading"
        @confirm="handleDeleteItem"
        @cancel="toggleDeleteDialog()"
      />
      <DeleteConfirm
        text="deleteCalculationMethodConfirmation"
        :visible="doubleDeleteConfirmation"
        :loading="loading"
        @confirm="deleteItem()"
        @cancel="closeDoubleDeleteDialog()"
      />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import handlePromise from "@/utils/promise";
import CalculationMethodService from "@/services/CalculationMethod";
import CalculationModuleService from "@/services/CalculationModule";
import ExecutionService from "@/services/Execution";
import DeleteConfirm from "../../custom-components/DialogConfirmation.vue";
import EditCalculationMethod from "./EditDialog.vue";

export default {
  name: "CalculationDashboard",
  props: {
    params: Object,
  },
  data() {
    return {
      loading: false,
      search: {},
      data: [],
      baseData: [],
      dataTable: [],
      pageSize: 10,
      pageIndex: 1,
      pageStartZero: true,
      total: 0,
      sort: null,
      deleteConfirmation: false,
      doubleDeleteConfirmation: false,
      toDelete: null,
      dialogVisible: false,
      toEdit: null,
      modules: [],
      calculationMethods: [],
    };
  },
  async mounted() {
    this.getCalculationModules();
    var self = this;
    addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.getData();
      }
    });
    this.loading = false;

    this.getCalculationMethods();

    await this.getData();

    this.loading = false;
  },
  components: {
    EditCalculationMethod,
    DeleteConfirm,
  },
  methods: {
    async getData() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationMethodService.getCalculationMethods()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.data = data;
      if (this.search.calculationMethod) {
        this.data = _.filter(this.data, (d) => {
          return d.name === this.search.calculationMethod;
        });
      }

      if (this.search.calculationModule) {
        this.data = _.filter(this.data, (d) => {
          return d.calculationModuleId.id === this.search.calculationModule;
        });
      }

      this.baseData = this.data;
      this.handleSort();
      this.dataTable = this.baseData.slice(0, this.pageSize);
      this.total = this.data.length;
      this.pageSize = 10;
      this.pageIndex = 1;
    },
    async getCalculationMethods() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationMethodService.getCalculationMethods()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.calculationMethods = _.orderBy(
        data,
        [(d) => d.name.toLowerCase()],
        ["asc"]
      );
    },
    async getCalculationModules() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationModuleService.getCalculationModules()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.modules = _.orderBy(data, [(d) => d.name.toLowerCase()], ["asc"]);
    },
    download(type) {
      const toExport = _.map(this.baseData, (d) => {
        return {
          Name: d.name ? d.name : "---",
          Description: d.description ? d.description : "---",
          Type: d.slaType ? d.slaType : "---",
          "Planned execution time": d.plannedExecutionTime
            ? d.plannedExecutionTime
            : "---",
          "Calculation module": d.calculationModuleId
            ? d.calculationModuleId.name
            : "---",
        };
      });
      const name = "Calculation methods";
      this.$store.commit("exports/downloadEXCEL", {
        data: toExport,
        name: name,
        type: type,
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.dataTable = this.baseData.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    },
    handlePageChange(val) {
      this.dataTable = this.baseData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    handleSort(val) {
      if (val) this.sort = { prop: val.prop, order: val.order };
      if (this.sort && this.sort.prop && this.sort.order) {
        this.baseData = _.orderBy(
          this.data,
          [this.sort.prop],
          [this.sort.order === "ascending" ? "asc" : "desc"]
        );
        this.dataTable = this.baseData.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize
        );
      } else {
        this.dataTable = this.data.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize
        );
      }
    },
    toggleLoading() {
      this.loading = false;
    },
    toggleDeleteDialog(row) {
      if (row) {
        this.toDelete = row;
      }

      this.deleteConfirmation = !this.deleteConfirmation;
    },
    closeDoubleDeleteDialog() {
      this.deleteConfirmation = false;
      this.doubleDeleteConfirmation = false;
    },
    async handleDeleteItem() {
      const params = {
        page: 0,
        audit: false,
        size: 1,
        sla:  this.toDelete.name
      }

      if (!this.loading) this.toggleLoading();
      const [error2, response2, data] = await handlePromise(
        ExecutionService.getExecutions(params)
      );
      if (this.loading) this.toggleLoading();
      if (!response2.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error2));
      }

      const execution = _.find(
        _.filter(data.content, (d) => d.status === "done"),
        (e) => {
          return (
            e.scheduleId.calculationMethodsId.calculationModuleId.id ===
            this.toDelete.calculationModuleId.id
          );
        }
      );

      if (execution && execution.id) {
        this.toggleDeleteDialog();
        this.doubleDeleteConfirmation = true;
      } else {
        await this.deleteItem();
      }
    },
    async deleteItem() {
      this.toggleLoading();
      const [error, response] = await handlePromise(
        CalculationMethodService.deleteCalculationMethod(this.toDelete.id)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.deleteConfirmation = false;
      this.doubleDeleteConfirmation = false;
      this.getData();
      this.getCalculationMethods();
      this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("calculationMethodDeleted")
      );
    },
    toggleDialog(row) {
      if (row) {
        this.toEdit = row;
      } else {
        this.toEdit = null;
      }
      this.dialogVisible = !this.dialogVisible;
    },
    handleDialogSubmit() {
      this.toEdit = null;
      this.getData();
      this.getCalculationMethods();
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
</style>
