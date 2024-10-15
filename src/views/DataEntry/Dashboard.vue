<template>
  <section v-loading="loading">
    <ods-module class="mt-1" :header="$t('dataEntry')">
      <ods-form :model="search" ref="form">
        <ods-row :gutter="20">
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('businessStartDate')" prop="businessDate">
              <ods-date-picker
                prefixIcon="ods-icon-calendar"
                type="date"
                v-model="search.businessDate"
                style="width: 100%"
              />
            </ods-form-item>
          </ods-col>
          <ods-col :md="6" :sm="12">
            <ods-form-item :label="$t('dataType')" prop="dataType">
              <ods-select v-model="search.dataType" placeholder="" clearable>
                <ods-option
                  v-for="item in dataTypes"
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
        @sort-change="handleSort"
        size="mini"
        style="width: 100%"
      >
        <ods-table-column
          prop="dataTypeId.name"
          :label="$t('dataType')"
          sortable
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.dataTypeId ? scope.row.dataTypeId.name : "---" }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="businessStartDate"
          :label="$t('businessStartDate')"
          width="200"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.businessStartDate | date4 }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="businessEndDate"
          :label="$t('businessEndDate')"
          width="200"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.businessEndDate | date4 }}
          </template>
        </ods-table-column>
        <ods-table-column
          prop="value"
          :label="$t('value')"
          width="100"
          sortable
        />
        <ods-table-column prop="comments" :label="$t('comments')" />
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
      <EditDataEntry
        :dialogVisible="dialogVisible"
        @cancel="toggleDialog"
        @submit="handleDialogSubmit"
        :toEdit="toEdit"
      />
      <DeleteConfirm
        :visible="deleteConfirmation"
        :loading="loading"
        @confirm="deleteItem"
        @cancel="toggleDeleteDialog()"
      />
    </ods-module>
  </section>
</template>

<script>
import _ from "lodash";
import moment from "moment-timezone";
import handlePromise from "@/utils/promise";
import EditDataEntry from "./EditDialog.vue";
import DeleteConfirm from "../../custom-components/DialogConfirmation.vue";
import DataEntryService from "@/services/DataEntry";
import DataTypeService from "@/services/DataType";

export default {
  name: "DataEntryDashboard",
  props: {
    params: Object,
  },
  data() {
    return {
      loading: false,
      search: {},
      pageSize: 10,
      pageIndex: 1,
      pageStartZero: true,
      total: 0,
      sort: null,
      deleteConfirmation: false,
      toDelete: null,
      dialogVisible: false,
      toEdit: null,
      dataTypes: [],
      data: [],
      baseData: [],
      dataTable: [],
    };
  },
  async mounted() {
    addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.getData();
      }
    });
    this.loading = true;
    await this.getDataTypes();
    await this.getData();

    this.loading = false;
  },
  components: {
    EditDataEntry,
    DeleteConfirm,
  },
  methods: {
    async getDataTypes() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        DataTypeService.getDataType()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.dataTypes = data;
    },
    async getData() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        DataEntryService.getDataEntry()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.data = data;
      if (this.search.businessDate) {
        this.data = _.filter(this.data, (d) => {
          return (
            moment(d.businessStartDate).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf() >=
            moment(this.search.businessDate).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf()
          );
        });
      }
      if (this.search.dataType) {
        this.data = _.filter(this.data, (d) => {
          return d.dataTypeId.id === this.search.dataType;
        });
      }

      this.baseData = this.data;
      this.handleSort();
      this.dataTable = this.baseData.slice(0, this.pageSize);
      this.total = this.data.length;
      this.pageSize = 10;
      this.pageIndex = 1;
    },
    download(type) {
      const toExport = _.map(this.baseData, (d) => {
        return {
          "Data type": d.dataTypeId ? d.dataTypeId.name : "",
          "Business start date": d.businessStartDate ? d.businessStartDate : "",
          "Business end date": d.businessEndDate ? d.businessEndDate : "",
          Value: d.value ? d.value : "",
          Comments: d.comments ? d.comments : "",
        };
      });
      const name = "Data entries";
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
      this.loading = !this.loading;
    },
    toggleDeleteDialog(row) {
      this.toDelete = row;
      this.deleteConfirmation = !this.deleteConfirmation;
    },
    async deleteItem() {
      this.toggleLoading();
      const [error, response] = await handlePromise(
        DataEntryService.deleteDataEntry(this.toDelete.id)
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.toggleDeleteDialog();
      this.getData();
      this.$store.commit(
        "settings/toggleSuccessAlert",
        this.$t("dataEntryDeleted")
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
