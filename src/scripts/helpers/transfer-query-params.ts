const transferQueryParams = (
  currentUrl: string,
  finalDestinationUrl: string
) => {
  const queryParams = currentUrl.split('?')
  let result = ''
  if (!queryParams[1]) { return finalDestinationUrl }
  const queryParamsHasHash = queryParams[1].includes('#')
  if (queryParamsHasHash) {
    result = queryParams[1].split('#')[0]
  } else {
    result = queryParams[1]
  }
  if (finalDestinationUrl.includes('?')) {
    return `${finalDestinationUrl}&${result}`
  } else {
    return `${finalDestinationUrl}?${result}`
  }
}

export default transferQueryParams