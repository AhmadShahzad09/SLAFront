<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            {{ $t('notificationsSentTo') }}
          </slot>
          <button type="button" class="btn-close" @click="close" aria-label="Close modal">
            <ods-icon name="close" size="18" />
          </button>
        </header>
        <ods-module v-loading="loadingModal">
          <section class="modal-body">
            <slot name="body">
              <ods-row :gutter="24">
                <ods-col :md="12">
                  <cropper ref="cropper" class="cropper" @change="cropImage()" :stencil-props="{
                    aspectRatio: 1 / 1
                  }" :src="profileImage" />
                </ods-col>
                <ods-col :md="12"
                  style="align-items: center;align-content: center;display: flex;justify-content: center;flex-direction: column;">
                  <ods-avatar size="xlarge">
                    <img :src="resultImage ? resultImage : profileImage ? profileImage : defaultProfilePicture"
                      alt="user avatar">
                  </ods-avatar>
                  <br>
                  <ods-upload ref="upload" :auto-upload="false" :show-file-list="false" :limit="1"
                    accept="image/*,.jpg,.jpeg,.png" :on-change="uploadFile" :action="''">
                    <ods-button size="medium" type="primary">{{ $t('uploadImage') }}</ods-button>
                  </ods-upload>
                  <br>
                  <ods-button size="medium" @click="savePicture()" type="primary">{{ $t('saveProfilePicture') }}
                  </ods-button>
                </ods-col>
              </ods-row>
            </slot>
          </section>
        </ods-module>
      </div>
    </div>
  </transition>
</template>

<script>

import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import defaultPicture from '../../../public/avatar.b30248d4.svg'

export default {
  name: 'NotificationModal',
  props: {
    profileImage: {
      type: String,
      default: null
    }
  },

  components: {
    Cropper,
  },
  data() {
    return {
      loadingModal: false,
      defaultProfilePicture: defaultPicture,
      resultImage: null
    }
  },
  methods: {
    async getValue() {

    },
    close() {
      this.$emit('close')
    },
    toggleLoading() {
      this.loadingModal = !this.loadingModal
    },
    cropImage() {
      const { canvas } = this.$refs.cropper.getResult()
      this.resultImage = canvas.toDataURL()
    },
    uploadFile(file) {
      this.createBase64(file.raw)
      this.$refs.upload.clearFiles()
    },
    createBase64(fileObject) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.profileImage = e.target.result
      }
      reader.readAsDataURL(fileObject)
    },
    savePicture() {
      this.$emit('resultImage', this.resultImage)
    }

  }
}
</script>
<style scoped lang="scss">
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgb(224, 223, 223);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(197, 197, 197);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1400;
}

.modal {
  background: #FFFFFF;
  overflow-x: auto;
  display: flex;
  width: 70%;
  border-radius: 5px;
  flex-direction: column;
  padding: 10px;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #000000;
  font-weight: 490;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  height: 65vh;
  overflow-y: auto;
}

.modal-footer {
  position: sticky;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active {
  transition: opacity .5s ease;
}

.modal-fade-leave-active {
  transition: opacity .5s ease;
}

.cropper {
  height: 400px;
  width: 400px;
  background: #DDD;
}
</style>
