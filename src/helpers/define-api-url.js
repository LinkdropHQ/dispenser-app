import {
  dashboardServerUrl,
  devDashboardServerUrl,
  testnetsDashboardServerUrl
} from "../configs"

const defineApiURL = (apiType) => {
  switch (apiType) {
    case 'dev':
      return devDashboardServerUrl
    case 'testnets':
      return testnetsDashboardServerUrl
    default:
      return dashboardServerUrl
  }
}

export default defineApiURL
