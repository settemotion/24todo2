# 24小时时间管理应用

这是一个基于Node.js和Redis的时间管理应用，支持用户注册登录和个人数据存储。

## 功能特性

- 用户注册和登录系统
- 24小时时间规划和管理
- 颜色标签系统
- 任务列表管理
- 日历视图
- 个人数据云端存储

## 技术栈

- **后端**: Node.js + Express
- **数据库**: Redis (Upstash)
- **前端**: 原生HTML/CSS/JavaScript
- **部署**: Vercel

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 设置环境变量（可选，用于本地Redis）：
```bash
# .env 文件
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
SESSION_SECRET=your-secret-key
```

3. 启动应用：
```bash
npm start
```

4. 访问 http://localhost:3000

## 部署到Vercel

### 第一步：准备代码

1. 将代码推送到GitHub仓库
2. 确保所有文件都已提交

### 第二步：设置Upstash Redis数据库

1. 访问 [Upstash](https://upstash.com/)
2. 注册账户并创建新的Redis数据库
3. 记录以下信息：
   - REDIS_URL (完整连接字符串)
   - 或者分别记录：
     - REDIS_HOST
     - REDIS_PORT  
     - REDIS_PASSWORD

### 第三步：部署到Vercel

1. 访问 [Vercel](https://vercel.com/)
2. 使用GitHub账户登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 在环境变量设置中添加：
   ```
   REDIS_URL=你的Upstash Redis连接字符串
   SESSION_SECRET=一个随机的密钥字符串
   NODE_ENV=production
   ```

### 第四步：完成部署

1. 点击 "Deploy" 开始部署
2. 等待部署完成
3. 访问分配的域名测试应用

## 环境变量说明

- `REDIS_URL`: Upstash Redis完整连接字符串
- `REDIS_HOST`: Redis主机地址（如果不使用REDIS_URL）
- `REDIS_PORT`: Redis端口（如果不使用REDIS_URL）
- `REDIS_PASSWORD`: Redis密码（如果不使用REDIS_URL）
- `SESSION_SECRET`: 会话加密密钥
- `NODE_ENV`: 环境类型（production/development）

## 使用说明

1. 首次访问会跳转到登录页面
2. 点击"立即注册"创建新账户
3. 登录后即可使用时间管理功能
4. 所有数据会自动保存到云端

## 故障排除

如果遇到问题，请检查：

1. Vercel部署日志中的错误信息
2. Redis连接是否正常
3. 环境变量是否正确设置
4. 浏览器控制台是否有错误信息
