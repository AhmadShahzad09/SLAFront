<template>
  <section>
    <ods-module>
      <div class="actionContainer">
        <h1 style="margin-right: auto; font-size: 135%; font-weight: 500">
          {{ $t("users") }}
        </h1>
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
      </div>
      <ods-table
        :data="data"
        v-loading="loading"
        @sort-change="handleSort"
        size="mini"
        style="width: 100%"
      >
        <ods-table-column prop="email" :label="$t('email')" sortable />
        <ods-table-column prop="name" :label="$t('name')" sortable />
        <ods-table-column prop="lastName" :label="$t('lastName')" sortable />
        <!-- <ods-table-column prop="enabled" :label="$t('enabled')">
          <template slot-scope="scope">
            <ods-icon name="checkmark-2" v-if="scope.row.enabled"></ods-icon>
            <ods-icon name="close" v-if="!scope.row.enabled"></ods-icon>
          </template>
        </ods-table-column> -->

        <!-- <ods-table-column prop="username" :label="$t('username')" /> -->
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

      <EditUser
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
import UserService from "@/services/User";
import handlePromise from "@/utils/promise";
import DeleteConfirm from "../../custom-components/DialogConfirmation.vue";
import EditUser from "./EditDialog.vue";
import { mapState } from "vuex";

export default {
  name: "UsersDashboard",
  components: {
    DeleteConfirm,
    EditUser,
  },
  computed: {
    ...mapState({
      userRole: (state) => state.userRoles.data,
    }),
  },
  mounted() {
    var self = this;
    addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        self.getData();
      }
    });
    this.getData();
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
      toDelete: null,
      dialogVisible: false,
      toEdit: null,
    };
  },
  methods: {
    async getData() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        UserService.getUsers()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.data = data;
      this.baseData = this.data;
      this.handleSort();
      this.dataTable = this.baseData.slice(0, this.pageSize);
      this.total = this.data.length;
      this.pageSize = 10;
      this.pageIndex = 1;
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
      if(val)  this.sort = { prop: val.prop, order: val.order };
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
    download(type) {
      const toExport = _.map(this.baseData, (d) => {
        return {
          Name: d.name ? d.name : "",
          Lastname: d.lastName ? d.lastName : "",
          Email: d.email ? d.email : "",
        };
      });
      const name = "Users";
      this.$store.commit("exports/downloadEXCEL", {
        data: toExport,
        name: name,
        type: type,
      });
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
    toggleDeleteDialog(row) {
      this.toDelete = row;
      this.deleteConfirmation = !this.deleteConfirmation;
    },
    async deleteItem() {
      this.toggleLoading();
      const [error, response] = await handlePromise(
        UserService.deleteUser(this.toDelete.id)
      );
      this.deleteLoading = false;
      if (!response.ok)
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      this.toggleDeleteDialog();
      this.getData();
      this.$store.commit("settings/toggleSuccessAlert", this.$t("userDeleted"));
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
  margin-top: 15px;
}
</style>
