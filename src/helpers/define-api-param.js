const defineApiParam = (search) => {
  if (!search) return '' // means "mainnet"
  const searchParams = search.replace('?', '')
  if (!searchParams) return '' // means "mainnet"
  const apiParam = searchParams.split('=')
  if (apiParam[0] !== 'api') return '' // means "mainnet"
  return apiParam[1]
}

export default defineApiParam
