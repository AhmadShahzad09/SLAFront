<template>
  <section>
    <ods-module>
      <template slot="header">
        <list-header :title="$t('Profile')" :btn-label="$t('changePassword')" url-key="UserChangePassword" />
      </template>
      <ods-form class="login-form" label-position="top" :model="profileForm" :rules="validations" ref="profileForm"
        v-loading="loading">
        <ods-row :gutter="24"
          style="align-items: center;align-content: center;display: flex;justify-content: center;flex-direction: column;">
          <ods-avatar size="xlarge">
            <img :src="profileForm.avatar ? profileForm.avatar : defaultProfilePicture" alt="user avatar">
          </ods-avatar>
          <br>
          <ods-button size="small" @click="toggleDialog()" type="primary">{{ $t('changeProfilePicture') }}</ods-button>
        </ods-row>
        <br>
        <ods-row :gutter="24">
          <ods-col :md="12">
            <ods-form-item label="Name" prop="name">
              <ods-input v-model="profileForm.name"></ods-input>
            </ods-form-item>
          </ods-col>
          <ods-col :md="12">
            <ods-form-item :label="$t('lastName')" prop="lastName">
              <ods-input v-model="profileForm.lastName"></ods-input>
            </ods-form-item>
          </ods-col>
        </ods-row>

        <ods-row :gutter="24">
          <ods-col :md="12">
            <ods-form-item label="Email" prop="email">
              <ods-input v-model="profileForm.email" type="email"></ods-input>
            </ods-form-item>
          </ods-col>

          <ods-col :md="12">
            <ods-form-item :label="$t('fixLine')" prop="fixLine">
              <ods-input v-model="profileForm.fixLine"></ods-input>
            </ods-form-item>
          </ods-col>
        </ods-row>

        <ods-row :gutter="24">
          <ods-col :md="12">
            <ods-form-item :label="$t('mobile')" prop="mobile">
              <ods-input v-model="profileForm.mobile"></ods-input>
            </ods-form-item>
          </ods-col>
          <ods-col :md="12">
            <ods-form-item :label="$t('notes')" prop="notes">
              <ods-input v-model="profileForm.notes" v-bind:autosize="true" type="textarea"></ods-input>
            </ods-form-item>
          </ods-col>
        </ods-row>

        <ods-row justify="center" :gutter="24" v-if="hasPermission">
          <ods-col :md="12">
            <ods-form-item :label="$t('afterLoginRedirectTo')">
              <ods-radio-group v-model="profileForm.redirectTo">
                <ods-radio :label="'dashboard'" class="mb-1">{{
                    $t("dashboard")
                }}</ods-radio>
                <ods-radio :label="'agent_panel'" class="mb-1">{{
                    $t("requestList")
                }}</ods-radio>
              </ods-radio-group>
            </ods-form-item>
          </ods-col>
          <ods-col :md="6">
            <ods-checkbox style="margin-top: 20px" class="mb-1" v-model="profileForm.allowAnimation">
              {{ $t("showAnimations") }}
            </ods-checkbox>
          </ods-col>
          <ods-col :md="6">
            <ods-checkbox style="margin-top: 20px" class="mb-1" v-model="profileForm.autoRetrieveRequest">
              {{ $t("autoRetrieveRequest") }}
            </ods-checkbox>
          </ods-col>
        </ods-row>

        <ods-row :gutter="24">
          <ods-col :md="12">
            <ods-form-item :label="$t('defaultRequestStatus')" prop="defaultRequestStatus">
              <ods-select v-model="profileForm.status" remote clearable multiple>
                <ods-option v-for="item in statuses" :key="item.statusMaster" :label="$t(item.statusMaster)"
                  :value="item.statusMaster">
                </ods-option>
              </ods-select>
            </ods-form-item>
          </ods-col>
        </ods-row>
        <ods-row type="flex" justify="center">
          <ods-button type="primary" @click="submitForm()">Save</ods-button>
        </ods-row>
      </ods-form>
    </ods-module>
    <change-picture-modal v-if="dialogVisible" v-show="dialogVisible" @close="toggleDialog"
      :profileImage="profileForm.avatar" @resultImage="handleChangePicture" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import UserService from '@/services/User'
import handlePromise from '@/utils/promise'
import errors from '@/config/InputErrors'
import ListHeader from '@/custom-components/ListHeader'
import _ from 'lodash'
import storage from '../../utils/storage'
import changePictureModal from './PictureModal.vue'
import defaultPicture from '../../../public/avatar.b30248d4.svg'

export default {
  name: 'Profile',
  async mounted() {
    this.loading = true
    await this.getData()
    this.loading = false
  },
  data() {
    return {
      loading: false,
      uploading: false,
      profileForm: {},
      statuses: [],
      validations: {
        email: [errors.required, errors.email],
        name: [errors.required]
      },
      dialogVisible: false,
      defaultProfilePicture: defaultPicture
    }
  },
  components: {
    ListHeader,
    changePictureModal
  },
  computed: {
    ...mapState({
      userData: (state) => state.user.data
    })
  },
  methods: {
    async getData() {
      const [error, response, data] = await handlePromise(
        UserService.getUser(this.userData.id)
      )
      if (!response.ok) {
        return this.$store.commit('settings/toggleAlert', this.$t(error))
      }
     
      this.profileForm = {
        email: data.email,
        name: data.name,
        lastName: data.lastName ? data.lastName : '',
        cpr: data.cpr,
        enabled: data.enabled,
        redirectTo: data.redirectTo === '' ? 'dashboard' : data.redirectTo,
        allowAnimation: data.allowAnimation,
        autoRetrieveRequest: data.autoRetrieveRequest,
        status: status,
        fixLine: data.fixLine,
        mobile: data.mobile,
        notes: data.notes,
        avatar: data.avatar
      }
    },
    removeRolaApi(value) {
      return value !== 'ROLE_API'
    },
    async submitForm() {
      this.$refs['profileForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true

          const data = {
            email: this.profileForm.email,
            name: this.profileForm.name,
            lastName: this.profileForm.lastName ? this.profileForm.lastName : '',
            redirectTo: this.profileForm.redirectTo,
            allowAnimation: this.profileForm.allowAnimation ? 'true' : 'false',
            autoRetrieveRequest: this.profileForm.autoRetrieveRequest ? 'true' : 'false',
            status: this.profileForm.status,
            fixLine: this.profileForm.fixLine,
            mobile: this.profileForm.mobile,
            notes: this.profileForm.notes,
            avatar: this.profileForm.avatar
          }
          const [error, response] = await handlePromise(
            UserService.updateProfile(data)
          )
          this.loading = false
          if (!response.ok) {
            return this.$store.commit('settings/toggleAlert', this.$t(error))
          }
          return window.location.reload()
        }
      })
    },
    toggleDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    handleChangePicture(resultImage) {
      this.profileForm = {
        ...this.profileForm, avatar: resultImage
      }
      this.toggleDialog()
    }
  }
}
</script>
