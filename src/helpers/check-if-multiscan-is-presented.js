const checkIfMultiscanIsPresented = (multiscanQRId) => {
  if (!window.localStorage) { return false }
  const multiscanQRIdData = window.localStorage.getItem('scans')
  if (!multiscanQRIdData) { return false }
  const multiscanQRIdDataParsed = JSON.parse(multiscanQRIdData)
  const oldLink = multiscanQRIdDataParsed[multiscanQRId.toLowerCase()]
  if (!oldLink) { return false }
  return oldLink
}

export default checkIfMultiscanIsPresented
