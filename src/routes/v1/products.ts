import express, { Response, Request } from 'express'
import validate from 'express-validation'
import Joi from '@hapi/joi'
import xiangliu from 'xiangliu'
import Mock from 'mockjs'

const router = express.Router()

/**
 * @api {get} /products 获取产品列表
 * @apiVersion 1.0.0
 * @apiName getProducts
 * @apiGroup Products
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Number} data.total 产品列表长度
 * @apiSuccess {Object[]} data.list 产品列表
 * @apiSuccess {String} data.list.hash_id 产品 hash id
 * @apiSuccess {String} data.list.type 大类
 * @apiSuccess {String} data.list.category 品类
 * @apiSuccess {String} data.list.model 型号
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/products', validate({
  query: {
    cursor: Joi.string().allow(''),
    first: Joi.number().min(1).default(50),
    type: Joi.number().default(0)
  },
  options: {
    stripUnknownBody: true
  }
}), async (req: Request, res: Response, next: any) => {
  try {
    const { cursor, first, type } = req.query
    const { account } = req as any

    const data = Mock.mock({
      total: 100,
      [`list|${first}`]: [{
        hashId: '@string',
        type: type || '@string',
        category: '@string',
        model: '@string'
      }]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

export default router
