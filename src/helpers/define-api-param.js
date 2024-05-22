const defineApiParam = (search) => {
  if (!search) return '' // means "mainnet"
  const searchParams = search.replace('?', '')
  if (!searchParams) return '' // means "mainnet"
  const params = searchParams.split('&')
  const apiParam = params.find(param => param.includes('api='))
  if (!apiParam) return '' // means "mainnet"
  const apiParamData = apiParam.split('=')
  if (!apiParamData[1]) return ''  // means "mainnet"
  return apiParamData[1]
}

export default defineApiParam
