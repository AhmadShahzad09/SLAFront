<template>
  <section>
    <ods-main-header
      v-if="$route.params.token"
      headerLogoText="Onesait e-Services"
      logoUrl="/"
    >
    </ods-main-header>
    <div style="display: grid; justify-content: center">
      <ods-module
        style="width: 100%; margin-top: 30px"
        :header="
          $route.params.token ? $t('recoverPassword') : $t('changePassword')
        "
      >
        <ods-form :model="form" ref="form" v-loading="loading">
          <ods-row :gutter="20">
            <ods-col :md="24">
              <ods-form-item
                :label="
                  $route.params.token
                    ? $t('newPassword')
                    : $t('currentPassword')
                "
                prop="password"
                :rules="[errors.required]"
              >
                <ods-input v-model="form.password" type="password"></ods-input>
              </ods-form-item>
            </ods-col>
            <ods-col :md="24">
              <ods-form-item
                :label="
                  $route.params.token
                    ? $t('repeatPassword')
                    : $t('new Password')
                "
                prop="passwordConfirmation"
                :rules="[
                  errors.required,
                  { validator: validatePassword, trigger: 'blur' },
                ]"
              >
                <ods-input
                  v-model="form.passwordConfirmation"
                  type="password"
                ></ods-input>
              </ods-form-item>
            </ods-col>
          </ods-row>
          <form-buttons @submit="submitForm" cancel-to="Profile"></form-buttons>
        </ods-form>
      </ods-module>
    </div>
  </section>
</template>

<script>
import UserService from '@/services/User'
import handlePromise from '@/utils/promise'
import errors from '@/config/InputErrors'
import FormButtons from '@/custom-components/Buttons/FormButtons'

export default {
  name: 'ChangePassword',
  components: {
    FormButtons
  },
  data () {
    return {
      loading: false,
      validRecover: false,
      form: {},
      roles: [
        { id: 'ROLE_OPERATOR', name: 'ROLE_OPERATOR' },
        { id: 'ROLE_ADMIN', name: 'ROLE_ADMIN' },
        { id: 'ROLE_SUPER_ADMIN', name: 'ROLE_SUPER_ADMIN' }
      ],
      errors,
      submitErrors: null
    }
  },
  async mounted () {
    if (this.$route.params.token) {
      await this.validToken()
    }
  },
  methods: {
    async submitForm () {
      this.submitErrors = null
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true

          if (this.$route.params.token) {
            const data = {
              password: this.form.password
            }
            const [error, response] = await handlePromise(
              UserService.recoverPassword(data, this.$route.params.token)
            )
            this.loading = false
            if (!response.ok) {
              return this.$store.commit('settings/toggleAlert', error)
            }
            if (response.ok) {
              this.$store.commit(
                'settings/toggleSuccessAlert',
                this.$t('passwordChanged')
              )
              return this.$router.push({ name: 'Login' })
            }
          } else {
            const data = {
              currentPassword: this.form.password,
              newPassword: this.form.passwordConfirmation
            }
            const [error, response] = await handlePromise(
              UserService.changePassword(data)
            )
            this.loading = false
            if (!response.ok) {
              return this.$store.commit('settings/toggleAlert', error)
            }
            return this.$router.push({ name: 'Profile' })
          }
        }
      })
    },
    async validToken () {
      const [error, response, data] = await handlePromise(
        UserService.isValidToken(this.$route.params.token)
      )
      if (!response.ok) {
        return this.$store.commit('settings/toggleAlert', error)
      }
      if (data.isValid === 'false') {
        this.$router.push({ name: 'Login' })
      }
    },
    validatePassword (rule, value, callback) {
      if (value !== this.form.password && this.$route.params.token) {
        callback(new Error('passwordDontMatch'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss"></style>
