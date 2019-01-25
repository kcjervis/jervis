export const urlShortener = async (url: string, domain: 'jervis' | 'kancolle') => {
  const apiKey = 'AIzaSyCL42Zt_fL5Bxj4mgbTcX9T-EOnzhvptbQ'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  const body = {
    longDynamicLink: `https://${domain}.page.link/?link=${url}`,
    suffix: {
      option: 'SHORT'
    }
  }
  const res = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  const json = await res.json()
  return json as { previewLink: string; shortLink: string } | { error: { code: number } }
}
