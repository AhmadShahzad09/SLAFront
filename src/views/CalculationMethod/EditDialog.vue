<template>
  <DialogFormVue
    :disabledSubmit="disabledSubmit"
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    width="60%"
    :title="toEdit ? 'editCalculationMethod' : 'createCalculationMethod'"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('name')"
            prop="name"
            :rules="[errors.required]"
          >
            <ods-input v-model="form.name" :disabled="toEdit ? true : false"></ods-input>
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('type')"
            prop="slaType"
            :rules="[errors.required]"
          >
            <ods-select v-model="form.slaType" placeholder="">
              <ods-option
                v-for="item in types"
                :key="item"
                :label="item"
                :value="item"
              />
            </ods-select>
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
          <ods-form-item
            :label="$t('calculationModule')"
            prop="calculationModuleId"
            :rules="[errors.required]"
          >
            <ods-select v-model="form.calculationModuleId" placeholder="">
              <ods-option
                v-for="item in modules"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ods-select>
          </ods-form-item>
        </ods-col>

        <ods-col :md="12" :sm="24">
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
                start: '01:00',
                step: '01:00',
                end: '24:00',
              }"
            >
            </ods-time-select>
          </ods-form-item>
        </ods-col>

        <ods-col :md="24" :sm="24">
          <ods-form-item :label="$t('description')" prop="description">
            <ods-input
              v-model="form.description"
              v-bind:autosize="true"
              type="textarea"
            ></ods-input>
          </ods-form-item>
        </ods-col>
        <hr />
        <fieldset>
          <legend>{{ $t("objetives") }}</legend>
          <ods-col :md="24" :sm="24">
            <div
              class="actionContainer"
              v-if="
                !form.slaCalculationMethodsObjectives ||
                form.slaCalculationMethodsObjectives.length == 0
              "
            >
              <p class="title">{{ $t("noObjetives") }}</p>
              <ods-button
                type="primary"
                :circle="true"
                icon="ods-icon-plus"
                @click="handleTabsEdit('p1', 'add')"
              />
            </div>
            <ods-tabs
              v-if="
                form.slaCalculationMethodsObjectives &&
                form.slaCalculationMethodsObjectives.length > 0
              "
              v-model="tabIndex"
              type="card"
              :editable="objetivetypes.length > 0"
              @edit="handleTabsEdit"
            >
              <ods-tab-pane
                v-for="(item, index) in form.slaCalculationMethodsObjectives"
                :key="item.type"
                :label="item.type"
                :name="item.type"
              >
                <ods-row :gutter="20">
                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('type')"
                      :rules="[errors.required]"
                    >
                      <ods-select
                        v-model="
                          form.slaCalculationMethodsObjectives[index].type
                        "
                        placeholder=""
                        @change="
                          handleOnChangeType(
                            form.slaCalculationMethodsObjectives[index].type
                          )
                        "
                      >
                        <ods-option
                          v-for="item in objetivetypes"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ods-select>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('target')"
                      :rules="[errors.required]"
                    >
                      <ods-input
                        type="number"
                        v-model="
                          form.slaCalculationMethodsObjectives[index].target
                        "
                      >
                      </ods-input>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('targetUOM')"
                      :rules="[errors.required]"
                    >
                      <ods-select
                        v-model="
                          form.slaCalculationMethodsObjectives[index].targetUOM
                        "
                        placeholder=""
                      >
                        <ods-option
                          v-for="item in targetUOMs"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ods-select>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('compare')"
                      :rules="[errors.required]"
                    >
                      <ods-select
                        v-model="
                          form.slaCalculationMethodsObjectives[index].compare
                        "
                        placeholder=""
                      >
                        <ods-option
                          v-for="item in compares"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ods-select>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('limitTime')"
                      :rules="[errors.required]"
                    >
                      <ods-input
                        type="number"
                        v-model="
                          form.slaCalculationMethodsObjectives[index].limitTimes
                        "
                      ></ods-input>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('numberOfTimes')"
                      :rules="[errors.required]"
                    >
                      <ods-input
                        type="number"
                        v-model="
                          form.slaCalculationMethodsObjectives[index]
                            .numberOfTimes
                        "
                      >
                      </ods-input>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('evaluationTime')"
                      :rules="[errors.required]"
                    >
                      <ods-input
                        type="number"
                        v-model="
                          form.slaCalculationMethodsObjectives[index]
                            .evaluationTimes
                        "
                      >
                      </ods-input>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('evaluationTimeUM')"
                      :rules="[errors.required]"
                    >
                      <ods-select
                        v-model="
                          form.slaCalculationMethodsObjectives[index]
                            .evaluationTimesUOM
                        "
                        placeholder=""
                      >
                        <ods-option
                          v-for="item in onlyMonths"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ods-select>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('consecutiveTimes')"
                      :rules="[errors.required]"
                    >
                      <ods-input
                        type="number"
                        v-model="
                          form.slaCalculationMethodsObjectives[index]
                            .consecutiveTimes
                        "
                      >
                      </ods-input>
                    </ods-form-item>
                  </ods-col>

                  <ods-col :md="12" :sm="24">
                    <ods-form-item
                      :label="$t('consecutiveTimesUM')"
                      :rules="[errors.required]"
                    >
                      <ods-select
                        v-model="
                          form.slaCalculationMethodsObjectives[index]
                            .consecutiveTimesUOM
                        "
                        placeholder=""
                      >
                        <ods-option
                          v-for="item in onlyMonths"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ods-select>
                    </ods-form-item>
                  </ods-col>
                </ods-row>
              </ods-tab-pane>
            </ods-tabs>
          </ods-col>
        </fieldset>
      </ods-row>
    </ods-form>
  </DialogFormVue>
</template>

<script>
import errors from "@/config/InputErrors";
import _ from "lodash";
import handlePromise from "@/utils/promise";
import CalculationMethodService from "@/services/CalculationMethod";
import CalculationModuleService from "@/services/CalculationModule";
import DialogFormVue from "../../custom-components/DialogForm.vue";
import ObjetiveVue from "./Objetive.vue";

export default {
  name: "EditCalculationMethodDialog",
  props: {
    calculationMethods: {
      type: Array,
      default: [],
    },
    dialogVisible: Boolean,
    disabledSubmit: {
      type: Boolean,
      default: false,
    },
    toEdit: {
      type: Object,
      default: null,
    },
  },
  components: {
    DialogFormVue,
    ObjetiveVue,
  },
  mounted() {
    this.getCalculationModules();
  },
  data() {
    return {
      loading: false,
      modules: [],
      types: ["Tolerance", "HES"],
      form: {
        slaCalculationMethods: {},
        slaCalculationMethodsObjectives: {},
      },
      errors,
      tabIndex: "p1",
      targetUOMs: ["%", "hrs", "min", "sec", "Kbit/s"],
      objetivetypes: ["p1", "p2", "p3", "Overall"],
      compares: ["<", "<=", "=", ">=", ">"],
      times: ["Months", "Days", "hrs", "min"],
      onlyMonths: ["Months"],
    };
  },
  methods: {
    async getCalculationModules() {
      if (!this.loading) this.toggleLoading();
      const [error, response, data] = await handlePromise(
        CalculationModuleService.getCalculationModules()
      );
      if (this.loading) this.toggleLoading();
      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }
      this.modules = this.modules = _.orderBy(
        data,
        [(d) => d.name.toLowerCase()],
        ["asc"]
      );
    },
    handleOnChangeType(value) {
      this.preventDuplicatedTypes();
      this.tabIndex = value;
    },
    preventDuplicatedTypes() {
      this.objetivetypes = ["p1", "p2", "p3", "Overall"];
      this.objetivetypes = _.filter(this.objetivetypes, (t) => {
        return !_.find(this.form.slaCalculationMethodsObjectives, { type: t });
      });
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        if (this.form.slaCalculationMethodsObjectives) {
          this.form.slaCalculationMethodsObjectives.push({
            type: this.objetivetypes[0],
          });
          this.tabIndex = this.objetivetypes[0];
        } else {
          this.form = {
            ...this.form,
            slaCalculationMethodsObjectives: [
              {
                type: this.objetivetypes[0],
              },
            ],
          };
          this.tabIndex = this.objetivetypes[0];
        }
      }
      if (action === "remove") {
        if (this.tabIndex === targetName) {
          this.form.slaCalculationMethodsObjectives.forEach((tab, index) => {
            if (tab.type === targetName) {
              let nextTab =
                this.form.slaCalculationMethodsObjectives[index + 1] ||
                this.form.slaCalculationMethodsObjectives[index - 1];
              if (nextTab) {
                this.tabIndex = nextTab.type;
              }
            }
          });
        }
        this.form.slaCalculationMethodsObjectives =
          this.form.slaCalculationMethodsObjectives.filter(
            (tab) => tab.type !== targetName
          );
      }
      this.preventDuplicatedTypes();
    },
    handleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const toSend = {
            slaCalculationMethods: {
              calculationModuleId: this.form.calculationModuleId,
              slaType: this.form.slaType,
              name: this.form.name,
              description: this.form.description,
              plannedExecutionTime: this.form.plannedExecutionTime,
            },
            slaCalculationMethodsObjectives:
              this.form.slaCalculationMethodsObjectives,
          };
          if(_.find(this.calculationMethods, (cm) => cm.name === this.form.name) && !this.toEdit){
            return this.$store.commit("settings/toggleAlert", this.$t("calculationMethodNameAlreadyTaken"));
          }
          this.toggleLoading();
          const [error, response, data] = await handlePromise(
            this.toEdit
              ? CalculationMethodService.updateCalculationMethod(
                  this.toEdit.id,
                  toSend
                )
              : CalculationMethodService.createCalculationMethod(toSend)
          );
          if (this.loading) this.toggleLoading();
          if (!response.ok) {
            return this.$store.commit("settings/toggleAlert", this.$t(error));
          }
          this.$emit("submit");

          this.$store.commit(
            "settings/toggleSuccessAlert",
            this.$t("calculationMethodSaved")
          );
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
          calculationModuleId: this.toEdit.calculationModuleId.id,
          slaType: this.toEdit.slaType,
          name: this.toEdit.name,
          description: this.toEdit.description,
          plannedExecutionTime: this.toEdit.plannedExecutionTime,
          slaCalculationMethodsObjectives:
            this.toEdit.slaCalculationMethodObjectiveDtos,
        };
        this.preventDuplicatedTypes();
      } else {
        this.form = {};
      }
    },
  },
};
</script>
<style scoped>
fieldset {
  margin: 10px;
  border: 1px solid silver;
  padding: 8px;
  border-radius: 4px;
}

legend {
  font-size: larger;
  font-weight: 500;
  padding: 5px;
}

.actionContainer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.title {
  color: rgb(133, 130, 130);
  font-size: larger;
  margin-top: 5px;
}
</style>
