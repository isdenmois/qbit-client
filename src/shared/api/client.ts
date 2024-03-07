import wretch from 'wretch'
import FormDataAddon from 'wretch/addons/formData'
import QueryStringAddon from 'wretch/addons/queryString'
import { setAuthState } from './auth-state'

const url = '/api/v2'

export const http = wretch(url)
  .addon(FormDataAddon)
  .addon(QueryStringAddon)
  .catcher(403, () => setAuthState('logged-out'))
  .catcher(401, () => setAuthState('logged-out'))
