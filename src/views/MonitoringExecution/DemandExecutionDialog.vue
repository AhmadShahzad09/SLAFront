<template>
  <DialogFormVue
    submitText="execute"
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    title="OnDemandExecution"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('slaCalculationMethod')"
            prop="idCalculationMethods"
            :rules="[errors.required]"
          >
            <ods-select
              v-model="form.idCalculationMethods"
              placeholder=""
              clearable
              multiple
            >
              <ods-option
                v-for="item in calculationMethods"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ods-select>
          </ods-form-item>
        </ods-col>
        <ods-col :md="24" :sm="24">
          <ods-form-item
            class="mt-1"
            :label="$t('executionDate')"
            prop="executionDate"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="date"
              v-model="form.executionDate"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>
        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('plannedExecutionTime')"
            prop="plannedExecutionTime"
            :rules="[errors.required]"
          >
            <ods-time-select
              style="width: 100%"
              v-model="form.plannedExecutionTime"
              prefixIcon="ods-icon-clock"
              :pickerOptions="{
                start: '00:00',
                step: '01:00',
                end: '23:00',
              }"
            >
            </ods-time-select>
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
import CalculationMethodService from "@/services/CalculationMethod";
import ExecutionService from "@/services/Execution";
import { mapState } from "vuex";

import DialogFormVue from "../../custom-components/DialogForm.vue";
import moment from "moment";

export default {
  name: "DemandExecutionDialog",
  props: {
    dialogVisible: Boolean,
  },
  computed: {
    ...mapState({
      userData: (state) => state.user.data,
    }),
  },
  components: {
    DialogFormVue,
  },
  mounted() {
    this.getCalculationMethods();
  },
  data() {
    return {
      loading: false,
      calculationMethods: [],
      form: {},
      errors,
    };
  },
  methods: {
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
    handleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.toggleLoading();
          await _.map(this.form.idCalculationMethods, async (cm) => {
            await this.submitExecution(cm);
          });

          this.$store.commit(
            "settings/toggleSuccessAlert",
            this.$t("onDemandExecutionsCreated")
          );
          if (this.loading) this.toggleLoading();
          this.$emit("submit");
        }
      });
    },
    async submitExecution(cm) {
      const toSend = {
        calculationMethodsId: cm,
        date: moment(this.form.executionDate)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss"),
        time: this.form.plannedExecutionTime,
        userId: this.userData.id,
        email: this.userData.email,
      };
      const [error, response] = await handlePromise(
        ExecutionService.createExecution(toSend)
      );

      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
