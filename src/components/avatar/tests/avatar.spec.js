import { shallowMount } from '@vue/test-utils'
import Avatar from './../Avatar.vue'

describe('Avatar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('create', () => {
    const wrapper = shallowMount(Avatar)
    expect(wrapper.exists()).toBe(true)
  })

  test('size prop is "medium"', () => {
    const wrapper = shallowMount(Avatar, {
      propsData: {
        size: 'medium'
      }
    })

    expect(wrapper.find('.ods-avatar').classes('ods-avatar--medium')).toBe(true)
  })

  test('image avatar', () => {
    const image = {
      template: '<img src="static/avatar.svg" />'
    }
    const wrapper = shallowMount(Avatar, {
      slots: {
        default: image
      }
    })
    expect(wrapper.find('img').attributes().src).toBe('static/avatar.svg')
  })
})
