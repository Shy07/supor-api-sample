import express, { Response, Request } from 'express'
import validate from 'express-validation'
import Joi from '@hapi/joi'
import xiangliu from 'xiangliu'
import Mock from 'mockjs'

const router = express.Router()

/**
 * @api {get} /labels 获取标签组列表
 * @apiVersion 1.0.0
 * @apiName getLabels
 * @apiGroup Labels
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Number} data.total 标签组列表长度
 * @apiSuccess {Object[]} data.list 标签组列表
 * @apiSuccess {String} data.list.name 名称
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/labels', async (req: Request, res: Response, next: any) => {
  try {
    const { account } = req as any

    const data = Mock.mock({
      total: 100,
      'list|1-10': [{
        name: '@string'
      }]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

export default router
