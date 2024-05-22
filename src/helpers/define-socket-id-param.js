const defineSocketIdParam = (search) => {
  if (!search) return undefined // 
  const searchParams = search.replace('?', '')
  if (!searchParams) return undefined // 
  const params = searchParams.split('&')
  const socketIdParam = params.find(param => param.includes('socket_id='))
  if (!socketIdParam) return undefined
  const socketIdParamData = socketIdParam.split('=')
  if (!socketIdParamData[1]) return undefined 
  return socketIdParamData[1]
}

export default defineSocketIdParam
