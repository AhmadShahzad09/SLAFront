import { shallowMount } from '@vue/test-utils'
import Button from './../Button.vue'

describe('Button', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('create', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        type: 'primary'
      }
    })

    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'ods-button--primary'
    )
  })

  test('icon', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        icon: 'ods-icon-tick'
      }
    })
    expect(wrapper.find('.ods-icon-tick').exists()).toBe(true)
  })

  test('nativeType', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        nativeType: 'submit'
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').attributes().type).toBe(
      'submit'
    )
  })

  test('loading', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        loading: true
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'is-loading'
    )
    expect(wrapper.find('.ods-icon-loading').exists()).toBe(true)
  })

  test('disabled', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        disabled: true
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'is-disabled'
    )
  })

  test('size', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        size: 'medium'
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'ods-button--medium'
    )
  })

  test('plain', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        plain: true
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'is-plain'
    )
  })

  test('round', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        round: true
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'is-round'
    )
  })

  test('circle', () => {
    const wrapper = shallowMount(Button, {
      propsData: {
        circle: true
      }
    })
    expect(wrapper.find('[data-name~="OdsButton"]').classes()).toContain(
      'is-circle'
    )
  })

  test('click', () => {
    const handleClickStub = jest.fn()
    const wrapper = shallowMount(Button, {
      methods: {
        handleClick: handleClickStub
      }
    })
    wrapper.find('[data-name~="OdsButton"]').trigger('click')
    expect(handleClickStub).toHaveBeenCalled()
  })

  test('click inside', () => {
    const handleClickStub = jest.fn()
    const wrapper = shallowMount(Button, {
      slots: {
        default: '<span class="inner-slot"></span>'
      },
      methods: {
        handleClick: handleClickStub
      }
    })
    wrapper.find('.inner-slot').trigger('click')
    expect(handleClickStub).toHaveBeenCalled()
  })
})
