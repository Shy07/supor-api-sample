import { Response, Request } from 'express'
import jwt from 'jwt-simple'
import md5 from 'md5'
import xiangliu from 'xiangliu'
import fp from 'lodash/fp'
import df from 'date-fns'

import Errors from '../errors'

export interface AuthRequest extends Request {
  account: any
}

export const verify = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { authorization } = req.headers
    if (!authorization) return res.sendStatus(400)
    const data = authorization.split(' ')
    const [, token] = data
    if (!token) {
      throw new Error(Errors.AUTH_FAILED.toString())
    }

    const { tokenSecret } = xiangliu.globalStore.configService.config as any
    const { cacheService } = xiangliu.globalStore
    const decoded = jwt.decode(token, tokenSecret)
    const user = await cacheService.get(`user:${decoded.iss}`, 600)
    if (!user || decoded.exp <= Date.now() || !decoded.iat) {
      throw new Error(Errors.AUTH_FAILED.toString())
    }
    req.account = user
    next()
  } catch (err) {
    next(err)
  }
}

const cacheUserInfo = async (args: any) => {
  const { user, expiredAt } = args
  const { cacheService } = xiangliu.globalStore

  const userKey = `user:${user.id}`
  const ttl = Math.abs(df.differenceInSeconds(expiredAt, new Date())) - 300

  await cacheService.set(userKey, user, ttl)
}

export const generateToken = async (user: any) => {
  const { tokenSecret } = xiangliu.globalStore.configService.config as any
  const iss = user.id

  const now = new Date()
  const expiredAt = df.addDays(now, 7)
  const payload = {
    iss,
    iat: now.valueOf(),
    exp: expiredAt.valueOf()
  }
  const token = jwt.encode(payload, tokenSecret)
  const refreshPayload = { iss, token: md5(token) }
  const refreshToken = jwt.encode(refreshPayload, tokenSecret)

  await cacheUserInfo({ user, expiredAt })
  return { token, refreshToken }
}

const userNewToken = async (reqBody: any) => {
  const { mobile } = reqBody

  if (mobile) {
    const user: any = {
      id: 12345
    }

    const tokens = await generateToken(user)
    return tokens
  } else {
    throw new Error(Errors.INVALID_ACCOUNT.toString())
  }
}

const refreshUserToken = async (refreshToken: string) => {
  const { tokenSecret } = xiangliu.globalStore.configService.config as any
  const { cacheService } = xiangliu.globalStore
  const decoded = jwt.decode(refreshToken, tokenSecret)
  const user = await cacheService.get(`user:${decoded.iss}`, 600)
  if (user && decoded.token) {
    const tokens = await generateToken(user)
    return tokens
  } else {
    throw new Error(Errors.INVALID_TOKEN.toString())
  }
}

export const generate = async (req: Request, res: Response, next: any) => {
  try {
    const { authorization } = req.headers
    if (fp.isString(authorization) && authorization.includes(' ')) {
      const data = authorization.split(' ')
      const [role, refreshToken] = data

      if (role.toUpperCase() === 'TOKEN') {
        const camelObj = await refreshUserToken(refreshToken)
        return xiangliu.utils.sendJSON(res, camelObj)
      }
    }

    const data = await userNewToken(req.body)
    xiangliu.utils.sendJSON(res, { code: 0, data })
  } catch (err) {
    next(err)
  }
}

export default {
  verify,
  generate,
  generateToken
}
