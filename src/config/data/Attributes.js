export default [
  { id: 1, name: 'voltage', type: 'STRING', mandatory: false, value: '' },
  { id: 11, name: 'voltageOut', type: 'STRING', mandatory: false, value: '' },
  { id: 2, name: 'length', type: 'STRING', mandatory: false, value: '' },
  {
    id: 3,
    name: 'region',
    type: 'STRING',
    mandatory: false,
    value: '',
    lov: {
      lovValues: [
        { id: 'NORTH', value: 'NORTH' },
        { id: 'SOUTH', value: 'SOUTH' },
        { id: 'EAST', value: 'EAST' },
        { id: 'WEST', value: 'WEST' }
      ]
    }
  },
  { id: 4, name: 'district', type: 'STRING', mandatory: false, value: '' },
  { id: 5, name: 'location', type: 'STRING', mandatory: false, value: '' },
  { id: 6, name: 'address', type: 'STRING', mandatory: false, value: '' },
  { id: 7, name: 'serialNumber', type: 'STRING', mandatory: false, value: '' },
  { id: 8, name: 'manufacturer', type: 'STRING', mandatory: false, value: '' },
  { id: 9, name: 'cableMaterial', type: 'STRING', mandatory: false, value: '' },
  { id: 10, name: 'cableSection', type: 'STRING', mandatory: false, value: '' }
]
