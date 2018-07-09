import React, { createElement as h } from 'react'
import renderer from 'react-test-renderer'
import MapToComponents from '.'

const defaultProps = {
  getKey: x => x,
  getType: x => x,
  list: [1, 2],
  map: {
    1: props => h('div', null, `Type 1: ${JSON.stringify(props)}`),
    2: props => h('div', null, `Type 2: ${JSON.stringify(props)}`),
  },
}

beforeEach(() => {
  jest.spyOn(console, 'error')
  global.console.error.mockImplementation(() => {})
})

afterEach(() => {
  global.console.error.mockRestore()
})

test('typical usage', () => {
  const component = renderer.create(h(MapToComponents, defaultProps))
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('missing mapped component throws', () => {
  const props = { ...defaultProps, map: {} }
  expect(() =>
    renderer.create(h(MapToComponents, props)),
  ).toThrowErrorMatchingSnapshot()
})