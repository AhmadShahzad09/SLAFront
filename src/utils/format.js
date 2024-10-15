
export const formatFormDataBody = (data) => {
  const formData = new FormData()

  Object.keys(data).map((key) => {
    if (data[key]) formData.append(key, data[key])
  })

  return formData
}
