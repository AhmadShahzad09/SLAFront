<template>
  <ods-dialog
      :visible.sync="dialogVisible"
      :title="translateTitle ? $t(title) : title"
      :secondTitle ="secondTitle"
      modal
      :width="width"
      custom-class="custom-dialog"
      :append-to-body="true"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <slot name="default">
    </slot>
    <div slot="footer">
      <slot name="footer"></slot>
      <form-buttons
          :disabledSubmit="disabledSubmit"
          :loading="loading"
          :submitText="submitText"
          :cancelText="cancelText"
          @submit="$emit('submit')"
          @cancel="$emit('cancel')"
      ></form-buttons>
    </div>
  </ods-dialog>
</template>

<script>
import FormButtons from '@/custom-components/Buttons/FormButtons'

export default {
  name: 'DialogForm',
  components: {
    FormButtons
  },
  props: {
    dialogVisible: Boolean,
    disabledSubmit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    translateTitle: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: 'cancel'
    },
    submitText: {
      type: String,
      default: 'save'
    },
    secondTitle: String,
    title: String,
    width: {
      type: String,
      default: '40%'
    }
  },
  methods: {
    handleClose(){
      if(!this.loading) this.$emit('cancel')
    }
  }
}
</script>
