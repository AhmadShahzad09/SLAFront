<template>
  <section v-loading="loading">
    <ods-table
      :data="dataTable"
      v-loading="loading"
      size="mini"
      style="width: 100%"
      @sort-change="handleSort"
      :defaultSort="{ prop: 'sla_name', order: 'ascending' }"
    >
      <ods-table-column
        prop="sla_name"
        width="150"
        :label="$t('name')"
        sortable
      />
      <ods-table-column prop="description" width="400" :label="$t('sla')" />
      <ods-table-column prop="date" width="160" :label="$t('date')" sortable>
        <template slot-scope="scope">
          {{ scope.row.sla_date }}
        </template>
      </ods-table-column>
      <ods-table-column
        prop="overall_achieved"
        width="150"
        :label="$t('overall')"
        sortable
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.overall_success == true ? 'success' : 'danger'"
          >
            {{ scope.row.overall_achieved | formatNumber }} {{ scope.row.type_uom_overall ? scope.row.type_uom_overall : '' }}
          </span>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="total_meters_overall"
        width="220"
        :label="$t('overallTotalAffected')"
        sortable
      />
      <ods-table-column prop="p1_achieved" width="150" :label="$t('p1')">
        <template slot-scope="scope">
          <span :class="scope.row.p1_success == true ? 'success' : 'danger'">
            {{ scope.row.p1_achieved | formatNumber }} {{ scope.row.type_uom_p1 ? scope.row.type_uom_p1 : '' }}
          </span>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="total_meters_p1"
        width="150"
        :label="$t('p1Affected')"
        sortable
      />
      <ods-table-column prop="p2_achieved" width="150" :label="$t('p2')">
        <template slot-scope="scope">
          <span :class="scope.row.p2_success == true ? 'success' : 'danger'">
            {{ scope.row.p2_achieved | formatNumber }} {{ scope.row.type_uom_p2 ? scope.row.type_uom_p2 : '' }}
          </span>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="total_meters_p2"
        width="160"
        :label="$t('p2Affected')"
        sortable
      />
      <ods-table-column prop="p3_achieved" width="150" :label="$t('p3')">
        <template slot-scope="scope">
          <span :class="scope.row.p3_success == true ? 'success' : 'danger'">
            {{ scope.row.p3_achieved | formatNumber }} {{ scope.row.type_uom_p3 ? scope.row.type_uom_p3 : '' }}
          </span>
        </template>
      </ods-table-column>
      <ods-table-column
        prop="total_meters_p3"
        width="160"
        :label="$t('p3Affected')"
        sortable
      />
      <ods-table-column prop="zone" width="150" :label="$t('zone')" sortable>
        <template slot-scope="scope">
          {{ scope.row.zone ? scope.row.zone : "---" }}
        </template>
      </ods-table-column>
      <ods-table-column :label="$t('audit')">
        <template slot-scope="scope">
          <ods-button
            type="primary"
            size="small"
            :circle="true"
            icon="ods-icon-audit"
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
  </section>
</template>

<script>
import _ from "lodash";

export default {
  name: "TableResult",
  props: {
    total: Number,
    data: {
      type: Array,
      default: [],
    },
    lastExecution: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      baseData: [],
      dataTable: [],
      pageSize: 10,
      pageIndex: 1,
      sort: null,
    };
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
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
  },
  watch: {
    data: function () {
      this.baseData = this.data;
      this.handleSort();
      this.dataTable = this.baseData.slice(0, this.pageSize);
      this.pageSize = 10;
      this.pageIndex = 1;
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
