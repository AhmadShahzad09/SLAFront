<template>
  <DialogFormVue
    :dialogVisible="dialogVisible"
    @submit="handleSubmit"
    :title="toEdit ? 'editUser' : 'createUser'"
    :loading="loading"
    @cancel="$emit('cancel')"
  >
    <ods-form class="mt-1" :model="form" ref="form" v-loading="loading">
      <ods-row :gutter="20">
        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('name')"
            prop="name"
            :rules="[errors.required]"
          >
            <ods-input v-model="form.name"></ods-input>
          </ods-form-item>
        </ods-col>

        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('lastName')"
            prop="lastName"
            :rules="[errors.required]"
          >
            <ods-input v-model="form.lastName"></ods-input>
          </ods-form-item>
        </ods-col>

        <ods-col :md="24" :sm="24">
          <ods-form-item
            :label="$t('email')"
            prop="email"
            :rules="[errors.required, errors.email]"
          >
            <ods-input v-model="form.email"></ods-input>
          </ods-form-item>
        </ods-col>

        <ods-col :md="24" :sm="24" v-if="!toEdit">
          <ods-form-item
            :label="$t('password')"
            prop="password"
            :rules="[errors.required]"
          >
            <ods-input
              v-model="form.password"
              type="password"
              show-password
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
import UserService from "@/services/User";

import DialogFormVue from "../../custom-components/DialogForm.vue";

export default {
  name: "EditUser",
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
          const toSend = {
            name: this.form.name,
            lastName: this.form.lastName,
            email: this.form.email,
          };
          this.toggleLoading();
          const [error, response] = await handlePromise(
            this.toEdit
              ? UserService.updateUser(this.toEdit.id, toSend)
              : UserService.createUser({
                  ...toSend,
                  password: this.form.password,
                })
          );
          if (this.loading) this.toggleLoading();
          if (!response.ok) {
            return this.$store.commit("settings/toggleAlert", this.$t(error));
          }
          this.$store.commit(
            "settings/toggleSuccessAlert",
            this.$t("userSaved")
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
          name: this.toEdit.name,
          lastName: this.toEdit.lastName,
          email: this.toEdit.email,
        };
      } else {
        this.form = {};
      }
    },
  },
};
</script>
