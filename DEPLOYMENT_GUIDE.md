# 部署指南 - 24小时时间管理应用

## 完整部署步骤

### 第一步：准备GitHub仓库

1. **初始化Git仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 24小时时间管理应用"
   ```

2. **创建GitHub仓库**
   - 访问 [GitHub](https://github.com)
   - 点击 "New repository"
   - 输入仓库名称（例如：time-management-app）
   - 选择 "Public" 或 "Private"
   - 点击 "Create repository"

3. **推送代码到GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/time-management-app.git
   git branch -M main
   git push -u origin main
   ```

### 第二步：设置Upstash Redis数据库

1. **注册Upstash账户**
   - 访问 [Upstash](https://upstash.com/)
   - 点击 "Sign Up" 注册账户
   - 可以使用GitHub账户快速注册

2. **创建Redis数据库**
   - 登录后点击 "Create Database"
   - 选择 "Global" 区域（推荐）
   - 输入数据库名称（例如：time-management-db）
   - 点击 "Create"

3. **获取连接信息**
   - 在数据库详情页面，找到 "Connect" 部分
   - 复制 "UPSTASH_REDIS_REST_URL" 的值
   - 这就是你的 REDIS_URL

### 第三步：部署到Vercel

1. **访问Vercel**
   - 打开 [Vercel](https://vercel.com/)
   - 使用GitHub账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你刚才创建的GitHub仓库
   - 点击 "Import"

3. **配置环境变量**
   在 "Environment Variables" 部分添加以下变量：
   
   ```
   REDIS_URL=你的Upstash Redis连接字符串
   SESSION_SECRET=一个随机的32位字符串
   NODE_ENV=production
   ```

   **生成SESSION_SECRET的方法：**
   - 在浏览器控制台运行：`Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)`
   - 或使用在线生成器

4. **开始部署**
   - 点击 "Deploy"
   - 等待部署完成（通常需要1-3分钟）

### 第四步：测试应用

1. **访问应用**
   - 部署完成后，Vercel会提供一个域名
   - 点击域名访问你的应用

2. **测试功能**
   - 应该会自动跳转到登录页面
   - 点击 "立即注册" 创建测试账户
   - 测试登录和基本功能

## 常见问题解决

### 1. 部署失败
- 检查package.json中的依赖是否正确
- 查看Vercel部署日志中的错误信息
- 确保所有文件都已推送到GitHub

### 2. Redis连接错误
- 确认REDIS_URL环境变量设置正确
- 检查Upstash数据库是否正常运行
- 确认连接字符串格式正确

### 3. 登录功能异常
- 检查SESSION_SECRET是否设置
- 确认环境变量在Vercel中正确配置
- 查看浏览器控制台的错误信息

### 4. 数据不保存
- 确认Redis连接正常
- 检查API调用是否成功
- 查看Vercel函数日志

## 自定义域名（可选）

1. **在Vercel中添加域名**
   - 进入项目设置
   - 点击 "Domains"
   - 添加你的自定义域名

2. **配置DNS**
   - 在你的域名提供商处
   - 添加CNAME记录指向Vercel提供的地址

## 监控和维护

1. **查看日志**
   - 在Vercel项目页面点击 "Functions"
   - 查看服务器日志和错误信息

2. **监控使用情况**
   - 在Upstash控制台查看Redis使用情况
   - 在Vercel查看访问统计

3. **备份数据**
   - Upstash提供自动备份
   - 可以定期导出重要数据

## 更新应用

1. **本地修改代码**
2. **提交并推送到GitHub**
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```
3. **Vercel会自动重新部署**

## 成本说明

- **Vercel**: 个人项目免费
- **Upstash**: 免费套餐包含10,000次请求/天
- **GitHub**: 公开仓库免费

总计：完全免费使用！
