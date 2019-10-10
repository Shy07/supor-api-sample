import express, { Response, Request } from 'express'
import xiangliu from 'xiangliu'
import Mock from 'mockjs'

const router = express.Router()

/**
 * @api {get} /rankings 排名信息
 * @apiVersion 1.0.0
 * @apiName getRankings
 * @apiGroup Rankings
 *
 * @apiSuccess {Number} code 结果代码
 * @apiSuccess {Object} data 数据结果
 * @apiSuccess {Object} data.nation 全国排名信息
 * @apiSuccess {Object[]} data.nation.list 排名列表
 * @apiSuccess {String} data.nation.list.name 姓名
 * @apiSuccess {String} data.nation.list.avatar 头像
 * @apiSuccess {Number} data.nation.list.score 累计积分
 * @apiSuccess {Number} data.nation.my_ranking 我的排名
 * @apiSuccess {Object} data.area 大区排名信息
 * @apiSuccess {Object[]} data.area.list 排名列表
 * @apiSuccess {String} data.area.list.name 姓名
 * @apiSuccess {String} data.area.list.avatar 头像
 * @apiSuccess {Number} data.area.list.score 累计积分
 * @apiSuccess {Number} data.area.my_ranking 我的排名
 * @apiSuccess {Object} data.dealer 经销商排名信息
 * @apiSuccess {Object[]} data.dealer.list 排名列表
 * @apiSuccess {String} data.dealer.list.name 姓名
 * @apiSuccess {String} data.dealer.list.avatar 头像
 * @apiSuccess {Number} data.dealer.list.score 累计积分
 * @apiSuccess {Number} data.dealer.my_ranking 我的排名
 *
 * @apiHeader {String} Authorization 用户登录后获取的 token，`[prefix, token].join(' ')` 格式，`prefix` 一般为 `'token'`
 *
 */
router.get('/rankings', async (req: Request, res: Response, next: any) => {
  try {
    const { account } = req as any

    const data = Mock.mock({
      nation: {
        'list|10': [{
          name: '@cname',
          avatar: '@image(240x240)',
          score: '@integer(4000, 9999)'
        }],
        myRanking: '@integer(0, 100)'
      },
      area: {
        'list|10': [{
          name: '@cname',
          avatar: '@image(240x240)',
          score: '@integer(4000, 9999)'
        }],
        myRanking: '@integer(0, 100)'
      },
      dealer: {
        'list|10': [{
          name: '@cname',
          avatar: '@image(240x240)',
          score: '@integer(4000, 9999)'
        }],
        myRanking: '@integer(0, 100)'
      }
    })

    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
})

export default router
