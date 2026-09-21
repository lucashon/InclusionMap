require('dotenv').config()
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const morgan = require('morgan')
const port = process.env.PORT || 3000

const conn = require('./db/conn')
require('./models/cidadaos')

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

const inclusionRouters = require('./routers/cidadaoRouter')
const infoController = require('./controllers/infoController')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.disable('view cache')
app.use(express.static(path.join(__dirname, 'public')))
app.set('trust proxy', process.env.TRUST_PROXY === '1')

const isProd = process.env.NODE_ENV === 'production'

async function init() {
  let store = new session.MemoryStore()
  let dbOk = false

  try {
    await conn.authenticate()
    console.log('DB conectado!')

    const mysqlStore = new MySQLStore({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '14/02Luc',
      database: process.env.DB_NAME || 'projeto',
      clearExpired: true,
      checkExpirationInterval: 900000,
      expiration: 86400000,
    })

    // express-mysql-session v2: aguarda ready (não usa .sync())
    if (typeof mysqlStore.onReady === 'function') {
      await mysqlStore.onReady()
    }

    store = mysqlStore
    dbOk = true

    if (process.env.AUTO_SYNC === '1') {
      await conn.sync({ alter: true })
      console.log('Modelos sincronizados (alter).')
    }
  } catch (err) {
    console.error('Falha na inicialização do DB:', err && err.message ? err.message : err)
    console.warn('Usando MemoryStore. Confira Docker/MySQL e o arquivo .env (DB_PASS).')
    store = new session.MemoryStore()
    dbOk = false
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'algumsegredo',
      store,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
      },
    })
  )

  app.use('/inclusion', inclusionRouters)
  app.get('/', infoController.createCadastro)

  const server = app.listen(port, () => {
    console.log(
      dbOk
        ? `Servidor rodando na porta ${port}`
        : `Servidor rodando na porta ${port} (sem DB — home OK; login precisa do MySQL)`
    )
  })

  const shutdown = async () => {
    console.log('Fechando servidor...')
    server.close(async () => {
      try { await conn.close() } catch (_) {}
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

init()
