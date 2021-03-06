import { createElement as h } from 'react'
import renderer, { act } from 'react-test-renderer'
import MapToComponents from '.'

const defaultProps = {
  getKey: jest.fn().mockImplementation((_, i) => i),
  getType: jest.fn().mockImplementation(x => x),
  list: [1, 2, 'withMapDataToProps', 1],
  map: {
    1: props => h('div', props, 'Type 1'),
    2: props => h('div', props, 'Type 2'),
    withMapDataToProps: props => h('div', props, 'withMapDataToProps'),
  },
  mapDataToContext: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedContext: true }),
  },
  mapDataToProps: {
    withMapDataToProps: jest.fn().mockReturnValue({ mappedData: true }),
  },
  meta: { foo: 'bar' },
  thisShouldBeIgnored: 'thisShouldBeIgnored',
}

beforeEach(() => jest.clearAllMocks())

test('should provide getKey with item, index, and list', () => {
  const { list } = defaultProps
  act(() => {
    renderer.create(h(MapToComponents, defaultProps))
  })

  expect(defaultProps.getKey).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(3, list[2], 2, list)
  expect(defaultProps.getKey).toHaveBeenNthCalledWith(4, list[3], 3, list)
})

test('should provide getType with item, index, and list', () => {
  const { list } = defaultProps
  act(() => {
    renderer.create(h(MapToComponents, defaultProps))
  })

  expect(defaultProps.getType).toHaveBeenNthCalledWith(1, list[0], 0, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(2, list[1], 1, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(3, list[2], 2, list)
  expect(defaultProps.getType).toHaveBeenNthCalledWith(4, list[3], 3, list)
})

test('should render list using components from map', () => {
  let tree
  act(() => {
    tree = renderer.create(h(MapToComponents, defaultProps))
  })

  expect(tree.toJSON()).toEqual([
    { type: 'div', props: {}, children: ['Type 1'] },
    { type: 'div', props: {}, children: ['Type 2'] },
    {
      type: 'div',
      props: { mappedData: true },
      children: ['withMapDataToProps'],
    },
    { type: 'div', props: {}, children: ['Type 1'] },
  ])
})

test('should provide no props to mapped component by default', () => {
  let tree
  act(() => {
    tree = renderer.create(
      h(MapToComponents, {
        ...defaultProps,
        mapDataToContext: undefined,
        mapDataToProps: undefined,
      }),
    )
  })

  expect(tree.toJSON()).toEqual([
    { type: 'div', props: {}, children: ['Type 1'] },
    { type: 'div', props: {}, children: ['Type 2'] },
    { type: 'div', props: {}, children: ['withMapDataToProps'] },
    { type: 'div', props: {}, children: ['Type 1'] },
  ])
})

test('should provide mapped props to mapped component', () => {
  let tree
  act(() => {
    tree = renderer.create(h(MapToComponents, defaultProps))
  })

  expect(tree.toTree().rendered[2].props).toEqual({ mappedData: true })
})

test('should use defaultMapDataToProps if mapDataToProps for type is not available', () => {
  let tree
  act(() => {
    tree = renderer.create(
      h(MapToComponents, {
        ...defaultProps,
        list: [1],
        defaultMapDataToProps: () => ({
          defaultMappedData: true,
        }),
      }),
    )
  })

  expect(tree.toJSON().props).toEqual({ defaultMappedData: true })
})

test('should provide detailed data to mapDataToProps', () => {
  const { list } = defaultProps
  act(() => {
    renderer.create(h(MapToComponents, defaultProps))
  })

  expect(defaultProps.mapDataToProps.withMapDataToProps).toHaveBeenCalledWith({
    list,
    keys: list.map(defaultProps.getKey),
    types: list.map(defaultProps.getType),
    comps: [
      defaultProps.map[1],
      defaultProps.map[2],
      defaultProps.map.withMapDataToProps,
      defaultProps.map[1],
    ],
    contexts: [{}, {}, { mappedContext: true }, {}],
    map: defaultProps.map,
    meta: { foo: defaultProps.meta.foo },
    index: 2,
    data: list[2],
    context: { mappedContext: true },
    key: defaultProps.getKey(list[2], 2, list),
    type: defaultProps.getType(list[2], 2, list),
    Comp: defaultProps.map.withMapDataToProps,
    previousData: list[1],
    previousContext: {},
    previousKey: defaultProps.getKey(list[1], 1, list),
    previousType: defaultProps.getType(list[1], 1, list),
    PreviousComp: defaultProps.map[2],
    nextData: list[3],
    nextContext: {},
    nextKey: defaultProps.getKey(list[3], 3, list),
    nextType: defaultProps.getType(list[3], 3, list),
    NextComp: defaultProps.map[1],
  })
})

test('should use defaultMapDataToContext if mapDataToContext for type is not available', () => {
  let tree
  act(() => {
    tree = renderer.create(
      h(MapToComponents, {
        ...defaultProps,
        list: [1],
        defaultMapDataToContext: () => ({
          defaultMappedContext: true,
        }),
        mapDataToProps: {
          1: ({ context }) => context,
        },
      }),
    )
  })

  expect(tree.toJSON().props).toEqual({ defaultMappedContext: true })
})

test('should provide detailed data to mapDataToContext', () => {
  const { list } = defaultProps
  act(() => {
    renderer.create(h(MapToComponents, defaultProps))
  })

  expect(defaultProps.mapDataToContext.withMapDataToProps).toHaveBeenCalledWith(
    {
      list,
      keys: list.map(defaultProps.getKey),
      types: list.map(defaultProps.getType),
      comps: [
        defaultProps.map[1],
        defaultProps.map[2],
        defaultProps.map.withMapDataToProps,
        defaultProps.map[1],
      ],
      map: defaultProps.map,
      meta: { foo: defaultProps.meta.foo },
      index: 2,
      data: list[2],
      key: defaultProps.getKey(list[2], 2, list),
      type: defaultProps.getType(list[2], 2, list),
      Comp: defaultProps.map.withMapDataToProps,
      previousData: list[1],
      previousKey: defaultProps.getKey(list[1], 1, list),
      previousType: defaultProps.getType(list[1], 1, list),
      PreviousComp: defaultProps.map[2],
      nextData: list[3],
      nextKey: defaultProps.getKey(list[3], 3, list),
      nextType: defaultProps.getType(list[3], 3, list),
      NextComp: defaultProps.map[1],
    },
  )
})

test('should render default mapping if mapping is not available', () => {
  let tree
  act(() => {
    tree = renderer.create(
      h(MapToComponents, {
        ...defaultProps,
        list: [3],
        default: () => 'default',
      }),
    )
  })

  expect(tree.toJSON()).toEqual('default')
})

test('should throw if component mapping is not available and no default is provided', () => {
  expect(() => {
    act(() => {
      renderer.create(h(MapToComponents, { ...defaultProps, list: [1, 3] }))
    })
  }).toThrow(/could not find a component mapping/i)
})
