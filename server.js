const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Redis连接配置
const redis = new Redis(process.env.REDIS_URL || {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// 中间件配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 会话配置
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 静态文件服务
app.use(express.static('public'));

// 认证中间件
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

// 路由
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少6位' });
    }

    // 检查用户是否已存在
    const existingUser = await redis.get(`user:${username}`);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 保存用户
    const userData = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    await redis.set(`user:${username}`, JSON.stringify(userData));
    
    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    // 获取用户数据
    const userDataStr = await redis.get(`user:${username}`);
    if (!userDataStr) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }

    const userData = JSON.parse(userDataStr);
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }

    // 设置会话
    req.session.userId = username;
    req.session.username = username;
    
    res.json({ success: true, message: '登录成功' });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登出接口
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: '登出成功' });
  });
});

// 获取用户数据接口
app.get('/api/user-data', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const userDataStr = await redis.get(`userdata:${userId}`);
    const userData = userDataStr ? JSON.parse(userDataStr) : {};
    res.json(userData);
  } catch (error) {
    console.error('获取用户数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 保存用户数据接口
app.post('/api/user-data', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const userData = req.body;
    await redis.set(`userdata:${userId}`, JSON.stringify(userData));
    res.json({ success: true });
  } catch (error) {
    console.error('保存用户数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
app.get('/api/current-user', requireAuth, (req, res) => {
  res.json({ 
    username: req.session.username,
    userId: req.session.userId 
  });
});

app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});
