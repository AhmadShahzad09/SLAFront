<template>
  <DialogFormVue
    width="30%"
    submitText="download"
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    :title="
      currentReport === 'calculationResult'
        ? 'calculationResults'
        : 'mettersAffected'
    "
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="24" :sm="24">
          <ods-form-item
            class="mt-1"
            :label="$t('startDate')"
            prop="startDate"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="date"
              v-model="form.startDate"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>
        <ods-col :md="24" :sm="24">
          <ods-form-item
            class="mt-1"
            :label="$t('endDate')"
            prop="endDate"
            :rules="[errors.required]"
          >
            <ods-date-picker
              prefixIcon="ods-icon-calendar"
              type="date"
              v-model="form.endDate"
              style="width: 100%"
            />
          </ods-form-item>
        </ods-col>
      </ods-row>
    </ods-form>
  </DialogFormVue>
</template>

<script>
import CalculationResultService from "@/services/CalculationResult";
import handlePromise from "@/utils/promise";
import errors from "@/config/InputErrors";
import _ from "lodash";
import moment from "moment-timezone";
import DialogFormVue from "../../custom-components/DialogForm.vue";
import logo from "../../assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  name: "ReportDialog",
  props: {
    dialogVisible: Boolean,
    currentReport: String,
  },
  components: {
    DialogFormVue,
  },
  data() {
    return {
      loading: false,
      data: {},
      calculationResults: [],
      form: {},
      logo: logo,
      errors,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          await this.getCalculationResults();
          await this.buildReport();
          if (this.loading) this.toggleLoading();
          this.$emit("cancel");
        }
      });
    },
    async getCalculationResults() {
      this.toggleLoading();
      let params = {
        last: false,
        page: 0,
        size: 100,
      };

      if (this.form.startDate) {
        params = {
          ...params,
          startdate: moment(this.form.startDate)
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss"),
        };
      }

      if (this.form.endDate) {
        params = {
          ...params,
          enddate: moment(this.form.endDate)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss"),
        };
      }

      const [error, response, data] = await handlePromise(
        CalculationResultService.getCalculationResultsReport(params)
      );

      if (!response.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error));
      }

      if (data.totalElements) {
        params = { ...params, size: data.totalElements };
      }

      const [error2, response2, data2] = await handlePromise(
        CalculationResultService.getCalculationResultsReport(params)
      );
      this.toggleLoading();
      if (!response2.ok) {
        return this.$store.commit("settings/toggleAlert", this.$t(error2));
      }
      this.calculationResults = data2.content;
    },
    async buildReport() {
      this.data = this.calculationResults;
      // if (this.form.startDate) {
      //   this.data = _.filter(this.data, (d) => {
      //     return (
      //       moment(d.slaExecutionDto.slaDate).valueOf() >=
      //       moment(this.form.startDate).valueOf()
      //     );
      //   });
      // }

      // if (this.form.endDate) {
      //   this.data = _.filter(this.data, (d) => {
      //     return (
      //       moment(d.slaExecutionDto.slaDate).valueOf() <=
      //       moment(this.form.endDate).valueOf()
      //     );
      //   });
      // }
      if (this.data.length === 0) {
        return this.$store.commit(
          "settings/toggleAlert",
          this.$t("noReportData")
        );
      }
      let formattedData = [];

      for (let i = 0; i < this.data.length; i++) {
        let name =
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId.name;
        let desc =
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .description;
        let date = moment(this.data[i].slaExecutionDto.slaDate)
          .tz(`${process.env.VUE_APP_TIMEZONE}`)
          .valueOf();
        let startDate = moment(this.data[i].slaExecutionDto.startDateTime)
          .tz(`${process.env.VUE_APP_TIMEZONE}`)
          .valueOf();
        let endDate = moment(this.data[i].slaExecutionDto.endDateTime)
          .tz(`${process.env.VUE_APP_TIMEZONE}`)
          .valueOf();
        let type =
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId.slaType;

        let totalObjetive = _.filter(
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "overall";
          }
        );
        let totalResult = this.data[i].slaExecutionDto.overallAchieved;
        let totalTarget =
          totalObjetive.length > 0 ? totalObjetive[0].target : null;
        let totalUM =
          totalObjetive.length > 0 ? totalObjetive[0].targetUOM : null;
        let totalOk =
          totalObjetive.length > 0 &&
          totalObjetive[0].compare === "<" &&
          totalResult < totalTarget
            ? true
            : totalObjetive.length > 0 &&
              totalObjetive[0].compare === ">" &&
              totalResult > totalTarget
            ? true
            : false;
        let totalAffected = this.data[i].slaExecutionDto.overallMetersAffected;

        let p1Objetive = _.filter(
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p1";
          }
        );
        let p1Result = this.data[i].slaExecutionDto.p1Achieved;
        let p1Target = p1Objetive.length > 0 ? p1Objetive[0].target : null;
        let p1UM = p1Objetive.length > 0 ? p1Objetive[0].targetUOM : null;
        let p1Ok =
          p1Objetive.length > 0 &&
          p1Objetive[0].compare === "<" &&
          p1Result < p1Target
            ? true
            : p1Objetive.length > 0 &&
              p1Objetive[0].compare === ">" &&
              p1Result > p1Target
            ? true
            : false;
        let p1Affected = this.data[i].slaExecutionDto.p1MetersAffected;

        let p2Objetive = _.filter(
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p2";
          }
        );
        let p2Result = this.data[i].slaExecutionDto.p2Achieved;
        let p2Target = p2Objetive.length > 0 ? p2Objetive[0].target : null;
        let p2UM = p2Objetive.length > 0 ? p2Objetive[0].targetUOM : null;
        let p2Ok =
          p2Objetive.length > 0 &&
          p2Objetive[0].compare === "<" &&
          p2Result < p2Target
            ? true
            : p2Objetive.length > 0 &&
              p2Objetive[0].compare === ">" &&
              p2Result > p2Target
            ? true
            : false;
        let p2Affected = this.data[i].slaExecutionDto.p2MetersAffected;

        let p3Objetive = _.filter(
          this.data[i].slaExecutionDto.scheduleId.calculationMethodsId
            .slaCalculationMethodObjectiveDtos,
          (t) => {
            return t.type === "p3";
          }
        );
        let p3Result = this.data[i].slaExecutionDto.p3Achieved;
        let p3Target = p3Objetive.length > 0 ? p3Objetive[0].target : null;
        let p3UM = p3Objetive.length > 0 ? p3Objetive[0].targetUOM : null;
        let p3Ok =
          p3Objetive.length > 0 &&
          p3Objetive[0].compare === "<" &&
          p3Result < p3Target
            ? true
            : p3Objetive.length > 0 &&
              p3Objetive[0].compare === ">" &&
              p3Result > p3Target
            ? true
            : false;
        let p3Affected = this.data[i].slaExecutionDto.p3MetersAffected;

        formattedData.push({
          name,
          desc,
          date,
          startDate,
          endDate,
          type,
          totalResult,
          totalTarget,
          totalUM,
          totalOk,
          totalAffected,
          p1Result,
          p1Target,
          p1UM,
          p1Ok,
          p1Affected,
          p2Result,
          p2Target,
          p2UM,
          p2Ok,
          p2Affected,
          p3Result,
          p3Target,
          p3UM,
          p3Ok,
          p3Affected,
        });
      }
      this.data = _.orderBy(formattedData, ["name", "date"], ["asc"]);

      if (this.data.length > 0) {
        let rows = [];
        let head = [];

        const doc = new jsPDF("p", "mm", "a3");

        var img = new Image();
        img.src = logo;

        if (this.currentReport === "calculationResult") {
          rows = _.map(this.data, (d) => {
            return [
              d.name ? d.name : "---",
              d.desc ? d.desc : "---",
              d.date
                ? moment(d.date).tz(`${process.env.VUE_APP_TIMEZONE}`).format("DD/MM/YYYY")
                : "---",

              d.totalResult ? d.totalResult : 0,
              d.totalTarget ? d.totalTarget : 0,

              d.p1Result ? d.p1Result : 0,
              d.p1Target ? d.p1Target : 0,

              d.p2Result ? d.p2Result : 0,
              d.p2Target ? d.p2Target : 0,

              d.p3Result ? d.p3Result : 0,
              d.p3Target ? d.p3Target : 0,
            ];
          });

          head = [
            [
              {
                content: "Name",
              },
              {
                content: "Description",
              },
              {
                content: "SLA Date",
              },
              {
                colSpan: 2,
                content: "Overall",
              },
              {
                colSpan: 2,
                content: "Priority 1",
              },
              {
                colSpan: 2,
                content: "Priority 2",
              },
              {
                colSpan: 2,
                content: "Priority 3",
              },
            ],
            [
              "-",
              "-",
              "-",
              "Value",
              "Objective",
              "Value",
              "Objective",
              "Value",
              "Objective",
              "Value",
              "Objective",
            ],
          ];

          autoTable(doc, {
            head: head,
            body: rows,
            // horizontalPageBreak: true,
            // horizontalPageBreakRepeat: 0,
            styles: {
              lineColor: [44, 62, 80],
              lineWidth: 0.1,
            },
            headStyles: {
              fillColor: [52, 152, 235],
              fontSize: 10,
            },
            theme: "grid",
            margin: { top: 27, left: 5 },
            didDrawPage: function (data) {
              doc.setFontSize(18);
              doc.addImage(img, "png", data.settings.margin.left, 10);
              doc.setFontSize(12);
              doc.text(
                "Calculation results:",
                data.settings.margin.left + 50,
                18
              );
            },
          });
        } else {
          rows = _.map(this.data, (d) => {
            return [
              d.name ? d.name : "---",
              d.desc ? d.desc : "---",
              d.date
                ? moment(d.date).tz(`${process.env.VUE_APP_TIMEZONE}`).format("DD/MM/YYYY")
                : "---",
              d.totalAffected ? d.totalAffected : 0,
              d.p1Affected ? d.p1Affected : 0,
              d.p2Affected ? d.p2Affected : 0,
              d.p3Affected ? d.p3Affected : 0,
            ];
          });

          head = [
            [
              {
                content: "Name",
              },
              {
                content: "Description",
              },
              {
                content: "SLA Date",
              },
              {
                colSpan: 4,
                content: "Metters Affected",
              },
            ],
            [
              "-",
              "-",
              "-",
              "Overall",
              "Priority 1",
              "Priority 2",
              "Priority 3",
            ],
          ];

          autoTable(doc, {
            head: head,
            body: rows,
            // horizontalPageBreak: true,
            // horizontalPageBreakRepeat: "name",
            styles: {
              lineColor: [44, 62, 80],
              lineWidth: 0.1,
            },
            headStyles: {
              fillColor: [52, 152, 235],
              fontSize: 10,
            },
            theme: "grid",
            margin: { top: 27, left: 5 },
            didDrawPage: function (data) {
              doc.setFontSize(18);
              doc.addImage(img, "png", data.settings.margin.left, 10);
              doc.setFontSize(12);
              doc.text("Metters affected:", data.settings.margin.left + 50, 18);
            },
          });
        }

        doc.save(
          this.currentReport === "calculationResult"
            ? "Calculation Results.pdf"
            : "Metters affected.pdf"
        );
      }
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
