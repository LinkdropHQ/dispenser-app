import { TApi } from "../types"
import {
  dashboardServerUrl,
  devDashboardServerUrl,
  testnetsDashboardServerUrl
} from "../../config"

type TDefineApiURL = (
  apiType: TApi
) => string

const defineApiURL: TDefineApiURL = (apiType) => {
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
