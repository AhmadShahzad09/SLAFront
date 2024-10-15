<template>
  <DialogFormVue
    submitText="execute"
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    title="OnDemandExtraction"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="24" :sm="24">
          <ods-form-item :label="$t('startDate')" prop="startDate">
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              v-model="form.startDate"
              :rules="[errors.required]"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>
        <ods-col :md="24" :sm="24">
          <ods-form-item :label="$t('endDate')" prop="sendDate">
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              v-model="form.endDate"
              :rules="[errors.required]"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>
        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('database')"
            prop="database"
            :rules="[errors.required]"
          >
            <ods-select v-model="form.database" placeholder="" clearable>
              <ods-option
                v-for="item in databases"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ods-select>
          </ods-form-item>
        </ods-col>
      </ods-row>
    </ods-form>
    
  </DialogFormVue>
</template>

<script>
import errors from "@/config/InputErrors";
import _ from "lodash";
import moment from "moment-timezone";
import DialogFormVue from "../../custom-components/DialogForm.vue";


export default {
  name: "DemandExecutionDialog",
  props: {
    dialogVisible: Boolean,
  },
  components: {
    DialogFormVue
  },
  data() {
    return {
      loading: false,
      databases: [
        { id: "postgre", name: "PostgreSQL" },
        { id: "mongodb", name: "MongoDB" },
      ],
      form: {},
      errors,
      createConfirmation: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (
            moment(this.form.endDate).tz(`${process.env.VUE_APP_TIMEZONE}`).diff(
              moment(this.form.startDate).tz(`${process.env.VUE_APP_TIMEZONE}`),
              "months"
            ) >= 2
          ) {
            return this.$store.commit(
              "settings/toggleAlert",
              this.$t("noMoreThanTwoMothRangeAllowed")
            );
          }
          this.$emit("submit", this.form);
        }
      });
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
