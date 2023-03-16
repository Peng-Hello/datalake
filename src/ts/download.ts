export function downloadFun(fileName: string, res: any) {
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(res)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}
