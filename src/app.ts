import express, { Response, Request } from 'express'
import xiangliu from 'xiangliu'
import path from 'path'

import bodyParser from 'body-parser'

import useCamelCase from './services/camel-case'
import Errors from './errors'
import authRoutes from './routes/v1/token'
import authService from './services/auth'

import meRoutes from './routes/v1/me'
import productRoutes from './routes/v1/products'

const configPath = path.join(__dirname, '..', 'config.json')

xiangliu.useBaseService()
xiangliu.useLangExtService()
xiangliu.useConfigService(configPath)
xiangliu.useLoggerService()
xiangliu.useRedisService()
xiangliu.useCacheService()
xiangliu.useServerService()

const { config } = xiangliu.globalStore.configService

const app = express()

const { port } = config as any

app.use(express.static(path.join(__dirname, '..', 'doc')))

const FE_PATH = path.resolve('doc/index.html')
app.use('/doc', (req, res) => {
  res.header('Content-Type', 'text/html;charset=utf-8')
  res.sendFile(FE_PATH)
})

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(useCamelCase)

app.use(authRoutes)
app.use(authService.verify)

app.use(meRoutes)
app.use(productRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err: any = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
app.use((err: Error, req: Request, res: Response, next: any) => {
  const { loggerService: logger, puts } = xiangliu.globalStore
  logger.info(req.body)
  logger.info(req.params)
  logger.error(err.message)
  puts(err)

  const errorKey = Object.keys(Errors).includes(err.message)
    ? err.message
    : Errors.SYSTEM_ERROR

  res.json({
    errors: [{
      code: parseInt(`${errorKey}`, 10),
      message: Errors[errorKey]
    }]
  })
})

export default {
  app,
  run: () => xiangliu.globalStore.serverService.run(app, port)
}
