import express, { Response, Request } from 'express'
import validate from 'express-validation'
import Joi from '@hapi/joi'
import xiangliu from 'xiangliu'
import Mock from 'mockjs'

const router = express.Router()

const mockData = () => (
  Mock.mock({
    'list|1-100': [{
      hashId: '@string',
      avatar: '@image(240x240)',
      name: '@cname',
      'gender|1': [0, 1, 2],
      'type|1': [0, 1],
      'tags|0-3': ['@string'],
      'wechatId|1': ['', '@string', '@string'],
      mobile: () => `${Mock.mock('@integer(11111111111, 19000000000)')}`,
      birthday: '@date',
      'prefer|0-3': ['@string'],
      'bought|0-2': ['@string'],
      note: '@string',
      followUp: '@string',
      infoPercent: '@integer(0.4, 1)',
      phoneCallTimesMonthly: '@integer(0, 5)',
      lastPhoneCallAt: '@date',
      guideName: '@cname',
      'inheritanceNote|1': ['', '@string', '@string']
    }],
    'inheritance|0-50': [{
      hashId: '@string',
      avatar: '@image(240x240)',
      name: '@cname',
      'gender|1': [0, 1, 2],
      'type|1': [0, 1],
      'tags|0-3': ['@string'],
      'wechatId|1': ['', '@string', '@string'],
      mobile: () => `${Mock.mock('@integer(11111111111, 19000000000)')}`,
      birthday: '@date',
      'prefer|0-3': ['@string'],
      'bought|0-2': ['@string'],
      note: '@string',
      followUp: '@string',
      infoPercent: '@integer(0.4, 1)',
      phoneCallTimesMonthly: '@integer(0, 5)',
      lastPhoneCallAt: '@date',
      guideName: '@cname',
      'inheritanceNote|1': ['', '@string', '@string']
    }]
  })
)

/**
 * @api {get} /customers 获取客户列表
 * @apiVersion 1.0.0
 * @apiName getCustomers
 * @apiGroup Customers
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/customers', async (req: Request, res: Response, next: any) => {
  try {
    const { account } = req as any

    const data = mockData()

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

/**
 * @api {post} /customers 批量导入客户列表
 * @apiVersion 1.0.0
 * @apiName postCustomers
 * @apiGroup Customers
 *
 * @apiParam {Object[]} list 导入客户列表
 * @apiParam {String} list.avatar 头像
 * @apiParam {String} list.name 姓名
 * @apiParam {String} list.mobile 手机号
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.post('/customers', validate({
  body: {
    list: Joi.array().min(1).required()
  }
}), (req: Request, res: Response, next: any) => {
  const { list } = req.body

  const data = mockData()

  xiangliu.utils.sendJSON(res, { code: 0, data })
})

/**
 * @api {post} /customer 添加客户
 * @apiVersion 1.0.0
 * @apiName postCustomer
 * @apiGroup Customers
 *
 * @apiParam {String} avatar 头像
 * @apiParam {String} name 姓名
 * @apiParam {Number} gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiParam {Number} type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiParam {String[]} tags 企业标签
 * @apiParam {String} wechat_id 关联微信
 * @apiParam {String} mobile 手机号
 * @apiParam {Date} birthday 生日
 * @apiParam {String[]} prefer 意向产品列表
 * @apiParam {String[]} bought 已购产品列表
 * @apiParam {String} note 备注
 * @apiParam {String} follow_up 跟进事项
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.post('/customer', validate({
  body: {
    name: Joi.string().required(),
    type: Joi.number().min(0).max(1).required(),
    mobile: Joi.string().length(11).required(),
    avatar: Joi.string().uri(),
    gender: Joi.number().min(0).max(2),
    tags: Joi.array(),
    wechatId: Joi.string(),
    birthday: Joi.date(),
    prefer: Joi.array(),
    bought: Joi.array(),
    note: Joi.string(),
    followUp: Joi.string()
  }
}), (req: Request, res: Response, next: any) => {
  const { list } = req.body

  const data = mockData()

  xiangliu.utils.sendJSON(res, { code: 0, data })
})

/**
 * @api {put} /customer 更新客户信息
 * @apiVersion 1.0.0
 * @apiName putCustomer
 * @apiGroup Customers
 *
 * @apiParam {String} avatar 头像
 * @apiParam {String} name 姓名
 * @apiParam {Number} gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiParam {Number} type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiParam {String[]} tags 企业标签
 * @apiParam {String} wechat_id 关联微信
 * @apiParam {String} mobile 手机号
 * @apiParam {Date} birthday 生日
 * @apiParam {String[]} prefer 意向产品列表
 * @apiParam {String[]} bought 已购产品列表
 * @apiParam {String} note 备注
 * @apiParam {String} follow_up 跟进事项
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.put('/customer/:hashId', validate({
  body: {
    name: Joi.string(),
    type: Joi.number().min(0).max(1),
    mobile: Joi.string().length(11),
    avatar: Joi.string().uri(),
    gender: Joi.number().min(0).max(2),
    tags: Joi.array(),
    wechatId: Joi.string(),
    birthday: Joi.date(),
    prefer: Joi.array(),
    bought: Joi.array(),
    note: Joi.string(),
    followUp: Joi.string()
  }
}), (req: Request, res: Response, next: any) => {
  const { list } = req.body

  const data = mockData()

  xiangliu.utils.sendJSON(res, { code: 0, data })
})

/**
 * @api {put} /customer/:hash_id/inheritance 继承离职导购客户
 * @apiVersion 1.0.0
 * @apiName putCustomerInheritance
 * @apiGroup Customers
 *
 * @apiParam {String} hash_id 客户 hash id
 * @apiParam {String} avatar 头像
 * @apiParam {String} name 姓名
 * @apiParam {Number} gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiParam {Number} type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiParam {String[]} tags 企业标签
 * @apiParam {String} wechat_id 关联微信
 * @apiParam {String} mobile 手机号
 * @apiParam {Date} birthday 生日
 * @apiParam {String[]} prefer 意向产品列表
 * @apiParam {String[]} bought 已购产品列表
 * @apiParam {String} note 备注
 * @apiParam {String} follow_up 跟进事项
 * @apiParam {String} inheritance_note 继承情况备注
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.put('/customer/:hashId/inheritance', validate({
  body: {
    name: Joi.string(),
    type: Joi.number().min(0).max(1),
    mobile: Joi.string().length(11),
    avatar: Joi.string().uri(),
    gender: Joi.number().min(0).max(2),
    tags: Joi.array(),
    wechatId: Joi.string(),
    birthday: Joi.date(),
    prefer: Joi.array(),
    bought: Joi.array(),
    note: Joi.string(),
    followUp: Joi.string(),
    inheritanceNote: Joi.string()
  }
}), (req: Request, res: Response, next: any) => {
  const { list } = req.body

  const data = mockData()

  xiangliu.utils.sendJSON(res, { code: 0, data })
})

/**
 * @api {put} /customers/inheritance 继承全部离职导购客户
 * @apiVersion 1.0.0
 * @apiName putCustomersInheritance
 * @apiGroup Customers
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object[]} data.list 客户列表
 * @apiSuccess {String} data.list.avatar 头像
 * @apiSuccess {String} data.list.name 姓名
 * @apiSuccess {Number} data.list.gender 性别，{ 0: 男, 1: 女, 2: 未知 }
 * @apiSuccess {Number} data.list.type 身份类型，{ 0: 潜客, 1: 老客 }
 * @apiSuccess {String[]} data.list.tags 企业标签
 * @apiSuccess {String} data.list.wechat_id 关联微信
 * @apiSuccess {String} data.list.mobile 手机号
 * @apiSuccess {Date} data.list.birthday 生日
 * @apiSuccess {String[]} data.list.prefer 意向产品列表
 * @apiSuccess {String[]} data.list.bought 已购产品列表
 * @apiSuccess {String} data.list.note 备注
 * @apiSuccess {String} data.list.follow_up 跟进事项
 * @apiSuccess {Number} data.list.info_percent 信息完整度
 * @apiSuccess {Number} data.list.phone_call_times_monthly 月通话次数
 * @apiSuccess {Date} data.list.last_phone_call_at 最近通话日期
 * @apiSuccess {String} data.list.guide_name 导购姓名
 * @apiSuccess {String} data.list.inheritance_note 继承情况备注
 * @apiSuccess {Object} data.inheritance 离职导购客户列表，数据结构同上
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.put('/customers/inheritance',
(req: Request, res: Response, next: any) => {
  const data = mockData()

  xiangliu.utils.sendJSON(res, { code: 0, data })
})

export default router
