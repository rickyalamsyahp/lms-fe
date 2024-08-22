export const ellipsis = (str: string, maxLength: number) => {
  return str.length > maxLength
    ? String(str)
        .slice(0, maxLength - 3)
        .padEnd(maxLength, '...')
    : str
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const enumToArray = (en: object) => {
  return [...Object.keys(en).map((key: any) => en[key as keyof typeof en])]
}

export const roundDecimal = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}
