import express, { Response, Request } from 'express'
import validate from 'express-validation'
import Joi from '@hapi/joi'

import authService from '../../services/auth'

const router = express.Router()

/**
 * @api {post} /token 获取 token
 * @apiVersion 1.0.0
 * @apiName postToken
 * @apiGroup Token
 *
 * @apiParam {String} mobile 手机号
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object} data.token token
 * @apiSuccess {Object} data.refresh_token refresh_token
 *
 * @apiHeader {String} Authorization 用户登录后获取的 refresh token，`['refresh', token].join(' ')` 格式，设置后可获取新的 token 和 refresh_token，传入的 refresh_token 将会失效。
 *
 * @apiSuccessExample Code
 * 结果代码列表，此列表所有接口通用
 *
 * 0        请求成功
 * 77000    系统错误
 * 77001    鉴权错误
 * 77002    无效的账号
 * 77003    无效的 token
 * ...
 */
router.post('/token', validate({
  body: {
    mobile: Joi.string().allow('')
  }
}), authService.generate)

export default router
