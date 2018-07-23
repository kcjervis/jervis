const getOperationIds = entities => {
  const list = []
  entities.get('operations').forEach(o => {
    list[o.get('index')] = o.get('uniqueId')
  })
  return list
}

export default {
  getOperationIds
}
