import Home from '@/views/HomeView.vue'
import { mount } from '@vue/test-utils'

describe('Home.vue', () => {
  test('renders inner text', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('Listen to Great Recitations!')
  })
})
