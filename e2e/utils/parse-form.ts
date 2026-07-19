import type { Request } from '@playwright/test'

export const parseForm = async (request: Request) => {
  const formData = await new Request(request.url(), {
    method: request.method(),
    headers: request.headers(),
    body: request.postData(),
  }).formData()

  return Object.fromEntries(formData.entries()) as Record<string, string>
}
