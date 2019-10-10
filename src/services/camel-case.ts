import changeCaseObj from 'change-case-object'

const useCamelCase = (req: any, res: any, next: any) => {
  const { params, query, body } = req
  req.params = changeCaseObj.camelCase(params)
  req.query = changeCaseObj.camelCase(query)
  req.body = changeCaseObj.camelCase(body)
  next()
}

export default useCamelCase
