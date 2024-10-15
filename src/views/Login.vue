<template>
  <div v-on:keyup.enter="submitForm()">
    <ods-main-header
        headerLogoText="Onesait sla-tools"
        logoUrl="/"
    >
    </ods-main-header>
    <div class="app-wrap">
      <ods-main>
        <ods-scrollbar wrapClass="ods-scrollbar--main-content">
          <ods-row type="flex" justify="center">
            <ods-col :md="7">
              <transition name="slide-fade">
                <ods-module style="position:absolute; float:center;"  v-if="!forgotPassword">
                  <ods-form
                      class="login-form"
                      label-position="top"
                      :model="loginForm"
                      :rules="validations"
                      ref="loginForm"
                      v-loading="loading"
                  >
                    <ods-row>
                      <ods-col>
                        <ods-form-item :label="$t('email')" prop="email">
                          <ods-input v-model="loginForm.email" type="text"></ods-input>
                        </ods-form-item>
                      </ods-col>
                    </ods-row>
                    <ods-row>
                      <ods-col>
                        <ods-form-item :label="$t('password')" prop="password">
                          <ods-input v-model="loginForm.password" type="password" show-password></ods-input>
                        </ods-form-item>
                      </ods-col>
                    </ods-row>

                    <ods-row type="flex" justify="center" style="margin-bottom:10px; width: 300px;">
                      <!-- <ods-button type="text" @click="toggleForgot">
                        {{$t('forgotPassword')}}
                      </ods-button> -->
                      <ods-button type="primary"  @click="submitForm()">
                        {{$t('login')}}
                      </ods-button>
                    </ods-row>
                  </ods-form>
                </ods-module>
              </transition>
              <transition name="slide-fade">
                <ods-module  v-if="forgotPassword">
                  <ods-form
                      class="login-form"
                      label-position="top"
                      :model="loginForm"
                      :rules="validations"
                      ref="loginForm"
                      v-loading="loading"
                  >
                    <ods-row>
                      <ods-col>
                        <ods-form-item :label="$t('email')" prop="email">
                          <ods-input v-model="loginForm.email" type="text"></ods-input>
                        </ods-form-item>
                      </ods-col>
                    </ods-row>
                    <ods-row type="flex" justify="center" style="margin-bottom:10px">
                      <ods-button type="text" @click="toggleForgot">
                        {{$t('backToLogin')}}
                      </ods-button>
                      <ods-button type="primary" style="margin-right: 30px" @click="submitForm()">
                        {{$t('send')}}
                      </ods-button>
                    </ods-row>
                  </ods-form>
                </ods-module>
              </transition>
            </ods-col>
          </ods-row>
        </ods-scrollbar>
      </ods-main>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/Auth'
import handlePromise from '@/utils/promise'
import errors from '@/config/InputErrors'

export default {
  name: 'Login',
  mounted () {
    this.$store.commit('user/logout')
  },
  data () {
    return {
      loading: false,
      forgotPassword: false,
      loginForm: {},
      validations: {
        email: [errors.required, errors.email],
        password: [errors.required]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          if (!this.forgotPassword) {
            this.loading = true
            const [error, response, data] = await handlePromise(AuthService.login({
              email: this.loginForm.email, // 'admin@sauna.com',
              password: this.loginForm.password// '123456'
            }))
            this.loading = false
            if (!response.ok) return this.$store.commit('settings/toggleAlert', this.$t(error))

            this.$store.commit('user/updateUser', data)
            this.$router.push({ path: '/dailyCalculation' })
          } else {
            this.loading = true
            const [error, response] = await handlePromise(AuthService.recoverPass({
              email: this.loginForm.email
            }))
            this.loading = false
            if (!response.ok) return this.$store.commit('settings/toggleAlert', this.$t(error))
            this.toggleForgot()
            return this.$store.commit('settings/toggleSuccessAlert', this.$t('emailSended'))
          }
        }
      })
    },
    toggleForgot () {
      this.forgotPassword = !this.forgotPassword
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-form {
    margin-top: 50px;
  }

  .slide-fade-enter-active {
  transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: scaleX(-1);
    opacity: 0;
  }
</style>
