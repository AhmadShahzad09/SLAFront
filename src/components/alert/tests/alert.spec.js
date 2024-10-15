import { shallowMount, mount } from '@vue/test-utils'
import Alert from './../Alert.vue'

describe('Alert test suite', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('create', () => {
    const wrapper = shallowMount(Alert, {
      propsData: {
        title: 'test',
        showIcon: true
      }
    })

    expect(wrapper.find('.ods-alert__title').text()).toEqual('test')
    expect(wrapper.find('.ods-alert--info').exists()).toBe(true)
  })

  test('type', () => {
    const wrapper = shallowMount(Alert, {
      propsData: {
        title: 'test',
        type: 'success',
        showIcon: true
      }
    })
    expect(wrapper.find('[data-name~="OdsAlert"]').classes()).toContain(
      'ods-alert--success'
    )
  })

  test('description', () => {
    const wrapper = shallowMount(Alert, {
      propsData: {
        title: 'test',
        description: 'Unbowed, Unbent, Unbroken',
        showIcon: true
      }
    })
    expect(wrapper.find('.ods-alert__description').text()).toEqual(
      'Unbowed, Unbent, Unbroken'
    )
  })

  test('theme', () => {
    const wrapper = shallowMount(Alert, {
      propsData: {
        title: 'test',
        effect: 'dark'
      }
    })
    expect(wrapper.find('[data-name~="OdsAlert"]').classes()).toContain(
      'is-dark'
    )
  })

  test('title slot', () => {
    const Component = {
      template: `
        <ods-alert
          title="foo"
          >
        </ods-alert>`
    }
    const wrapper = mount(Component)
    expect(wrapper.find('.ods-alert__title').text()).toEqual('foo')
  })

  test('close', async () => {
    const wrapper = shallowMount(Alert)
    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-name~="OdsAlert"]').isVisible()).toBe(false)
  })
})
