<template>
  <DialogFormVue
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    :title="toEdit ? 'editDataEntry' : 'createDataEntry'"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('value')"
            prop="value"
            :rules="[errors.required]"
          >
            <ods-input v-model="form.value" type="number"></ods-input>
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('dataType')"
            prop="dataTypeId"
            :rules="[errors.required]"
          >
            <ods-select v-model="form.dataTypeId" placeholder="" clearable>
              <ods-option
                v-for="item in dataTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ods-select>
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('businessStartDate')"
            prop="businessStartDate"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="date"
              v-model="form.businessStartDate"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('businessEndDate')"
            prop="businessEndDate"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="date"
              v-model="form.businessEndDate"
              style="width: 100%"
              :picker-options="{ disabledDate: disabledDateTo }"
            />
          </ods-form-item>
        </ods-col>

        <ods-col :md="24" :sm="24">
          <ods-form-item :label="$t('comments')" prop="comments">
            <ods-input
              v-model="form.comments"
              v-bind:autosize="true"
              type="textarea"
            ></ods-input>
          </ods-form-item>
        </ods-col>
      </ods-row>
    </ods-form>
  </DialogFormVue>
</template>

<script>
import errors from "@/config/InputErrors";
import _ from "lodash";
import handlePromise from "@/utils/promise";
import moment from "moment-timezone";
import DataEntryService from "@/services/DataEntry";
import DataTypeService from "@/services/DataType";
import Vue from "vue";
import DialogFormVue from "../../custom-components/DialogForm.vue";

export default {
  name: "EditDataEntryDialog",
  props: {
    dialogVisible: Boolean,
    toEdit: {
      type: Object,
      default: null,
    },
  },
  components: {
    DialogFormVue,
  },
  mounted() {
    this.getDataTypes();
  },
  data() {
    return {
      loading: false,
      dataTypes: [],
      form: {},
      errors,
    };
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
    disabledDateTo(date) {
      if (this.form.businessStartDate) {
        return moment(this.form.businessStartDate)
          .tz(`${process.env.VUE_APP_TIMEZONE}`)
          .isAfter(date, "day");
      }
    },
    handleSubmit() {
      if (
        moment(this.form.businessStartDate).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf() >
        moment(this.form.businessEndDate).tz(`${process.env.VUE_APP_TIMEZONE}`).valueOf()
      ) {
        return this.$store.commit(
          "settings/toggleAlert",
          this.$t("invalidDates")
        );
      }
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const toSend = {
            businessEndDate: moment(this.form.businessEndDate)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            businessStartDate: moment(this.form.businessStartDate)
              .startOf("day")
              .format("YYYY-MM-DDTHH:mm:ss"),
            comments: this.form.comments,
            dataTypeId: this.form.dataTypeId,
            value: this.form.value,
          };
          this.toggleLoading();
          const [error, response] = await handlePromise(
            this.toEdit
              ? DataEntryService.updateDataEntry(this.toEdit.id, toSend)
              : DataEntryService.createDataEntry(toSend)
          );
          if (this.loading) this.toggleLoading();
          if (!response.ok) {
            return this.$store.commit("settings/toggleAlert", this.$t(error));
          }
          this.$store.commit(
            "settings/toggleSuccessAlert",
            this.$t("dataEntrySaved")
          );
          this.$emit("submit");
        }
      });
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
  watch: {
    dialogVisible: function () {
      if (this.toEdit) {
        this.form = {
          businessEndDate: Vue.filter("date3")(this.toEdit.businessEndDate),
          businessStartDate: Vue.filter("date3")(this.toEdit.businessStartDate),
          comments: this.toEdit.comments,
          dataTypeId: this.toEdit.dataTypeId.id,
          value: this.toEdit.value,
        };
      } else {
        this.form = {};
      }
    },
  },
};
</script>
