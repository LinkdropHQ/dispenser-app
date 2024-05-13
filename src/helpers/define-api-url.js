import {
  dashboardServerUrl,
  devDashboardServerUrl,
  testnetsDashboardServerUrl
} from "../configs"

const defineApiURL = (apiType) => {
  switch (apiType) {
    case 'mainnets':
      return dashboardServerUrl
    case 'testnets':
      return testnetsDashboardServerUrl
    case 'dev':
    default:
      return devDashboardServerUrl
  }
}

export default defineApiURL
