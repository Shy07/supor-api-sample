import express, { Response, Request } from 'express'
import xiangliu from 'xiangliu'
import validate from 'express-validation'
import Joi from '@hapi/joi'
import Mock from 'mockjs'

const router = express.Router()

/**
 * @api {get} /me 个人信息
 * @apiVersion 1.0.0
 * @apiName getMe
 * @apiGroup Me
 *
 * @apiExample {http} Example usage:
 *    GET {{baseUrl}}/me
 *    Authorization: token your_token
 *    x-use-camel: true
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object} data.info 个人信息
 * @apiSuccess {String} data.info.avatar 头像
 * @apiSuccess {String} data.info.name 姓名
 * @apiSuccess {String} data.info.mobile 手机号
 * @apiSuccess {String} data.info.belongs 所属信息
 * @apiSuccess {String} data.info.belongs.area 所属大区
 * @apiSuccess {String} data.info.belongs.store 所属门店
 * @apiSuccess {String} data.info.slogan 个性签名
 * @apiSuccess {String} data.info.qr_code 专属二维码
 * @apiSuccess {String} data.info.qr_code.type 二维码类型
 * @apiSuccess {String} data.info.qr_code.url 二维码图片 url
 * @apiSuccess {Number} data.info.flags 标记信息，0：网上商城首次点击
 * @apiSuccess {Object} data.rankings 排名信息
 * @apiSuccess {Number} data.rankings.customer_increase_total 总客户数
 * @apiSuccess {Number} data.rankings.customer_increase_weekly 本周新增客户数
 * @apiSuccess {Number} data.rankings.score_total 累计积分
 * @apiSuccess {Number} data.rankings.score_ranking 总排名
 * @apiSuccess {Number} data.rankings.member_register_total 会员注册数
 * @apiSuccess {Number[]} data.rankings.member_register_weekly 每周新增会员注册数
 * @apiSuccess {Object} data.missions 总部任务信息前六条
 * @apiSuccess {String} data.missions.hashId 任务 hash id
 * @apiSuccess {String} data.missions.title 标题
 * @apiSuccess {String} data.missions.cover 题图
 * @apiSuccess {String} data.missions.awards 奖励
 * @apiSuccess {Number} data.missions.status 状态，0: 待打卡; 1: 考核中; 2: 已完成; 3: 未通过
 * @apiSuccess {Date} data.missions.start_at 开始时间
 * @apiSuccess {Date} data.missions.end_at 结束时间
 * @apiSuccess {String} data.missions.rank 级别，S | A | B | C
 * @apiSuccess {Number} data.missions.type 类型（模块），0: 营销任务; 1: 培训任务
 * @apiSuccess {String} data.missions.document 文案
 * @apiSuccess {String} data.missions.share_link 链接
 * @apiSuccess {String} data.missions.images 图片列表
 * @apiSuccess {Date} data.missions.push_at 推送时间
 * @apiSuccess {Object[]} data.missions.records 打卡记录列表
 * @apiSuccess {String} data.missions.records.hash_id 打卡记录 hash id
 * @apiSuccess {Date} data.missions.records.record_at 时间
 * @apiSuccess {String} data.missions.records.description 纪要
 * @apiSuccess {String[]} data.missions.records.images 素材列表
 * @apiSuccess {String} data.missions.records.status 审批状态，0: 考核中; 1: 已通过; 2未通过
 * @apiSuccess {String} data.missions.records.reason 审批原因
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/me', async (req: Request, res: Response, next: any) => {
  try {
    const { account } = req as any

    const data = Mock.mock({
      info: {
        avatar: '@image(240x240)',
        name: '@cname',
        mobile: () => `${Mock.mock('@integer(11111111111, 19000000000)')}`,
        belongs: {
          area: '@string',
          store: '@string'
        },
        slogan: '@string',
        qrCodes: [
          {
            type: 'wechat',
            url: '@image(240x240)'
          },
          {
            type: 'mini_program',
            url: '@image(240x240)'
          }
        ],
        flags: []
      },
      rankings: {
        customerIncreaseTotal: '@integer(5000, 9999)',
        customerIncreaseWeekly: '@integer(500, 5000)',
        scoreTotal: '@integer(5000, 9999)',
        scoreRanking: '@integer(1, 500)',
        memberRegisterTotal: '@integer(5000, 9999)',
        'memberRegisterWeekly|1-52': ['@integer(0, 300)']
      },
      missions: [{
        hashId: '@string',
        title: '@string',
        cover: '@image(240x240)',
        awards: 500,
        'status|1': [0, 1, 2, 3],
        startAt: '@date',
        endAt: '@date',
        'rank|1': ['S', 'A', 'B', 'C'],
        'type|1': [0, 1],
        document: '@string',
        shareLink: '@url',
        'images|1-5': ['@image(240x240)'],
        pushAt: '@date',
        'records|0-3': [{
          hashId: '@string',
          recordAt: '@date',
          description: '@string',
          'images|1-5': ['@image(240x240)'],
          'status|1': [0, 1, 2],
          reason: 'string'
        }]
      }]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {put} /me 更新个人信息
 * @apiVersion 1.0.0
 * @apiName putMe
 * @apiGroup Me
 *
 * @apiParam {String} avatar 头像
 * @apiParam {String} slogan 个性签名
 * @apiParam {Number[]} flags 标记
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object} data.info 个人信息
 * @apiSuccess {String} data.info.avatar 头像
 * @apiSuccess {String} data.info.name 姓名
 * @apiSuccess {String} data.info.mobile 手机号
 * @apiSuccess {String} data.info.belongs 所属信息
 * @apiSuccess {String} data.info.belongs.area 所属大区
 * @apiSuccess {String} data.info.belongs.store 所属门店
 * @apiSuccess {String} data.info.slogan 个性签名
 * @apiSuccess {String} data.info.qr_code 专属二维码
 * @apiSuccess {String} data.info.qr_code.type 二维码类型
 * @apiSuccess {String} data.info.qr_code.url 二维码图片 url
 * @apiSuccess {Number} data.info.flags 标记信息，0：网上商城首次点击
 * @apiSuccess {Object} data.rankings 排名信息
 * @apiSuccess {Number} data.rankings.customer_increase_total 总客户数
 * @apiSuccess {Number} data.rankings.customer_increase_weekly 本周新增客户数
 * @apiSuccess {Number} data.rankings.score_total 累计积分
 * @apiSuccess {Number} data.rankings.score_ranking 总排名
 * @apiSuccess {Number} data.rankings.member_register_total 会员注册数
 * @apiSuccess {Number[]} data.rankings.member_register_weekly 每周新增会员注册数
 * @apiSuccess {Object} data.missions 任务信息
 * @apiSuccess {String} data.missions.hashId 任务 hash id
 * @apiSuccess {String} data.missions.title 标题
 * @apiSuccess {String} data.missions.cover 题图
 * @apiSuccess {String} data.missions.awards 奖励
 * @apiSuccess {Number} data.missions.status 状态，0: 待打卡; 1: 考核中; 2: 已完成; 3: 未通过
 * @apiSuccess {Date} data.missions.start_at 开始时间
 * @apiSuccess {Date} data.missions.end_at 结束时间
 * @apiSuccess {String} data.missions.rank 级别，S | A | B | C
 * @apiSuccess {Number} data.missions.type 类型（模块），0: 营销任务; 1: 培训任务
 * @apiSuccess {String} data.missions.document 文案
 * @apiSuccess {String} data.missions.share_link 链接
 * @apiSuccess {String} data.missions.images 图片列表
 * @apiSuccess {Date} data.missions.push_at 推送时间
 * @apiSuccess {Object[]} data.missions.records 打卡记录列表
 * @apiSuccess {String} data.missions.records.hash_id 打卡记录 hash id
 * @apiSuccess {Date} data.missions.records.record_at 时间
 * @apiSuccess {String} data.missions.records.description 纪要
 * @apiSuccess {String[]} data.missions.records.images 素材列表
 * @apiSuccess {String} data.missions.records.status 审批状态，0: 考核中; 1: 已通过; 2未通过
 * @apiSuccess {String} data.missions.records.reason 审批原因
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.put('/me', validate({
  body: {
    avatar: Joi.string().allow(''),
    slogan: Joi.string().allow(''),
    flags: Joi.array().allow([])
  }
}), (req: Request, res: Response, next: any) => {
  try {
    const { avatar, slogan, flags } = req.body

    const data = Mock.mock({
      info: {
        avatar: () => avatar || Mock.mock('@image(240x240)'),
        name: '@cname',
        mobile: '@integer(11111111111, 19000000000)',
        belongs: {
          area: '@string',
          store: '@string'
        },
        slogan: () => slogan || Mock.mock('@string'),
        qrCodes: [
          {
            type: 'wechat',
            url: '@image(240x240)'
          },
          {
            type: 'mini_program',
            url: '@image(240x240)'
          }
        ],
        flags: flags || []
      },
      rankings: {
        customerIncreaseTotal: '@integer(5000, 9999)',
        customerIncreaseWeekly: '@integer(500, 5000)',
        scoreTotal: '@integer(5000, 9999)',
        scoreRanking: '@integer(1, 500)',
        memberRegisterTotal: '@integer(5000, 9999)',
        'memberRegisterWeekly|1-52': ['@integer(0, 300)']
      },
      missions: [{
        hashId: '@string',
        title: '@string',
        cover: '@image(240x240)',
        awards: 500,
        'status|1': [0, 1, 2, 3],
        startAt: '@date',
        endAt: '@date',
        'rank|1': ['S', 'A', 'B', 'C'],
        'type|1': [0, 1],
        document: '@string',
        shareLink: '@url',
        'images|1-5': ['@image(240x240)'],
        pushAt: '@date',
        'records|0-3': [{
          hashId: '@string',
          recordAt: '@date',
          description: '@string',
          'images|1-5': ['@image(240x240)'],
          'status|1': [0, 1, 2],
          reason: 'string'
        }]
      }]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

export default router
