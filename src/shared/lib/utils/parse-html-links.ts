export const parseHtmlLinks = function (text: string) {
  const exp = /(\b(https?|ftp|file):\/\/[-\w+&@#/%?=~|!:,.;]*[-\w+&@#/%=~|])/gi

  return text.replace(exp, "<a target='_blank' rel='noopener noreferrer' href='$1'>$1</a>")
}
