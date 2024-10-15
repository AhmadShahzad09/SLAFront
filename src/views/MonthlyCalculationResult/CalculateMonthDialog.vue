<template>
  <DialogFormVue
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    title="calculateMonth"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col>
          <ods-form-item
            :label="$t('date')"
            prop="date"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="month"
              v-model="form.date"
              style="width: 100%"
            />
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
import CalculationResultService from "@/services/CalculationResult";
import DialogFormVue from "../../custom-components/DialogForm.vue";

export default {
  name: "CalculateMonthDialog",
  props: {
    dialogVisible: Boolean,
  },
  components: {
    DialogFormVue,
  },
  data() {
    return {
      loading: false,
      form: {},
      errors,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.toggleLoading();
          const [error, response] = await handlePromise(
            CalculationResultService.getCalculateMonth(
              moment(this.form.date).tz(`${process.env.VUE_APP_TIMEZONE}`).month() + 1,
              moment(this.form.date).tz(`${process.env.VUE_APP_TIMEZONE}`).year()
            )
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
};
</script>
