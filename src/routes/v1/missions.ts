import express, { Response, Request } from 'express'
import validate from 'express-validation'
import Joi from '@hapi/joi'
import xiangliu from 'xiangliu'
import Mock from 'mockjs'

const router = express.Router()

/**
 * @api {get} /missions/common 获取常规任务列表
 * @apiVersion 1.0.0
 * @apiName getCommonMissions
 * @apiGroup Missions
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Number} data.total 常规任务列表长度
 * @apiSuccess {Object[]} data.list 常规任务列表
 * @apiSuccess {String} data.list.hash_id 任务 hash id
 * @apiSuccess {Number} data.list.type 类型，0: 从通讯录导入客户; 1: 手动录入; 2: 注册会员拉新; 3: 完善客户信息
 * @apiSuccess {Number} data.list.count 已导入
 * @apiSuccess {Number} data.list.score 已获得积分
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/missions/common',
async (req: Request, res: Response, next: any) => {
  try {
    const { account } = req as any

    const data = Mock.mock({
      total: 4,
      list: [
        {
          hashId: '@string',
          type: 0,
          count: '@integer(0, 100)',
          score: '@integer(100, 5000)'
        }, {
          hashId: '@string',
          type: 1,
          count: '@integer(0, 100)',
          score: '@integer(100, 5000)'
        }, {
          hashId: '@string',
          type: 2,
          count: '@integer(0, 100)',
          score: '@integer(100, 5000)'
        }, {
          hashId: '@string',
          type: 3,
          count: '@integer(0, 100)',
          score: '@integer(100, 5000)'
        }
      ]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {get} /missions/hq?cursor=...&first=...&status=...&start_at=...&end_at=...&rank=...&type=... 获取总部任务列表
 * @apiVersion 1.0.0
 * @apiName getHqMissions
 * @apiGroup Missions
 *
 * @apiParam {String} cursor 游标，任务的 hash id，可不指定
 * @apiParam {Number} first 从指定 `cursor` 开始获取 `first` 条数据
 * @apiParam {Number} status 状态，-1: 全部，0: 待打卡; 1: 考核中; 2: 已完成; 3: 未通过
 * @apiParam {Date} start_at 开始时间
 * @apiParam {Date} end_at 结束时间
 * @apiParam {String} rank 级别，S | A | B | C
 * @apiParam {Number} type 类型（模块），-1: 全部，0: 营销任务; 1: 培训任务
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Number} data.total 总部任务列表长度
 * @apiSuccess {Object[]} data.list 总部任务列表
 * @apiSuccess {String} data.list.hash_id 任务 hash id
 * @apiSuccess {String} data.list.title 标题
 * @apiSuccess {String} data.list.cover 题图
 * @apiSuccess {String} data.list.awards 奖励
 * @apiSuccess {Number} data.list.status 状态，0: 待打卡; 1: 考核中; 2: 已完成; 3: 未通过
 * @apiSuccess {Date} data.list.start_at 开始时间
 * @apiSuccess {Date} data.list.end_at 结束时间
 * @apiSuccess {String} data.list.rank 级别，S | A | B | C
 * @apiSuccess {Number} data.list.type 类型（模块），0: 营销任务; 1: 培训任务
 * @apiSuccess {String} data.list.document 文案
 * @apiSuccess {String} data.list.share_link 链接
 * @apiSuccess {String} data.list.images 图片列表
 * @apiSuccess {Date} data.list.push_at 推送时间
 * @apiSuccess {Object[]} data.list.records 打卡记录列表
 * @apiSuccess {String} data.list.records.hash_id 打卡记录 hash id
 * @apiSuccess {Date} data.list.records.record_at 时间
 * @apiSuccess {String} data.list.records.description 纪要
 * @apiSuccess {String[]} data.list.records.images 素材列表
 * @apiSuccess {String} data.list.records.status 审批状态，0: 考核中; 1: 已通过; 2未通过
 * @apiSuccess {String} data.list.records.reason 审批原因
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/missions/hq', validate({
  query: {
    cursor: Joi.string().allow(''),
    first: Joi.number().min(1).required(),
    status: Joi.number().default(-1),
    startAt: Joi.date(),
    endAt: Joi.date(),
    rank: Joi.string(),
    type: Joi.number().default(-1)
  },
  options: {
    stripUnknownBody: true
  }
}), async (req: Request, res: Response, next: any) => {
  try {
    const { cursor, first, type } = req.query
    const { account } = req as any

    const data = Mock.mock({
      total: 50,
      [`list|${first}`]: [
        {
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
        }
      ]
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {post} /missions/hq/:hash_id/record 总部任务打卡
 * @apiVersion 1.0.0
 * @apiName postHqMissionRecord
 * @apiGroup Missions
 *
 * @apiParam {String} hash_id 任务 hash id
 * @apiParam {String} description 纪要
 * @apiParam {String[]} images 素材列表
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.post('/missions/hq/:hashId/record', validate({
  body: {
    description: Joi.string().required(),
    images: Joi.array().required()
  }
}), (req: Request, res: Response, next: any) => {
  const { hashId } = req.params
  const { description, images } = req.body

  xiangliu.utils.sendJSON(res, { code: 0, data: { hashId, description, images } })
})

export default router
