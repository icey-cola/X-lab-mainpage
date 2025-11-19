# 本地开发测试指南

## 🚀 快速启动

### 1. 安装依赖
```bash
cd /mnt/c/shangtangzhuye/server
npm install
```

### 2. 启动服务器
```bash
cd /mnt/c/shangtangzhuye/server
node server.js
```

服务器将在 `http://localhost:3000` 启动

### 3. 访问页面

- **首页**: http://localhost:3000
- **登录页面**: http://localhost:3000/login.html
- **管理后台**: http://localhost:3000/admin.html

---

## 🔐 测试账号

- **用户名**: admin
- **密码**: admin123

---

## 🧪 功能测试

### 测试登录功能

```bash
# 测试正确密码
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 预期返回: {"success":true,"message":"登录成功"}

# 测试错误密码
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'

# 预期返回: {"error":"用户名或密码错误"}
```

### 测试会话管理

```bash
# 登录并保存 cookie
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 使用 cookie 检查认证状态
curl -b cookies.txt http://localhost:3000/api/auth/status

# 预期返回: {"authenticated":true,"username":"admin"}
```

### 测试 API 权限保护

```bash
# 未登录访问受保护的 API（应该被拒绝）
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# 预期返回: {"error":"未授权访问，请先登录"}

# 登录后访问（应该成功）
curl -b cookies.txt -X POST http://localhost:3000/api/slides \
  -H "Content-Type: application/json" \
  -d '{"media":"test.jpg","mediaType":"image"}'

# 预期返回: {"id":"s-xxxxx","media":"test.jpg","mediaType":"image"}
```

### 测试登出功能

```bash
# 登出
curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout

# 再次检查状态（应该显示未认证）
curl -b cookies.txt http://localhost:3000/api/auth/status

# 预期返回: {"authenticated":false}
```

---

## 🔧 开发工具

### 生成新密码哈希

```bash
cd /mnt/c/shangtangzhuye/server
node generate-password.js 你的新密码
```

这将输出密码的 bcrypt 哈希值，可以更新到 `server.js` 中。

### 停止服务器

```bash
# 使用 Ctrl+C 停止前台运行的服务器

# 或者强制停止所有 node 进程
pkill -f "node server.js"
```

---

## 📁 项目结构

```
/mnt/c/shangtangzhuye/
├── server/
│   ├── server.js              # 主服务器文件（已添加认证功能）
│   ├── package.json           # 依赖配置
│   └── generate-password.js   # 密码哈希生成工具
├── public/
│   ├── index.html            # 首页
│   ├── login.html            # 登录页面（新增）
│   ├── admin.html            # 管理后台（已更新，添加登出功能）
│   ├── team.html
│   ├── publications.html
│   ├── research-detail.html
│   ├── styles.css
│   ├── app.js
│   └── image/                # 图片资源
├── data/                     # 数据文件
│   ├── members.json
│   ├── publications.json
│   ├── hero_slides.json
│   ├── key_tech.json
│   ├── research.json
│   ├── research_papers.json
│   ├── partners.json
│   └── sections.json
├── deploy.sh                 # 部署脚本
└── LOGIN_README.md          # 登录系统说明
```

---

## 🔍 调试技巧

### 查看服务器日志

如果服务器以后台方式运行：
```bash
# 查看最近的输出
tail -f server.log
```

### 清除会话数据

删除 cookie 文件：
```bash
rm -f cookies.txt /tmp/test_session.txt
```

### 测试数据重置

如果需要重置测试数据，可以删除 data 目录下的 JSON 文件，服务器会自动重新创建初始数据。

---

## 📝 开发注意事项

1. **端口占用**: 确保 3000 端口没有被其他程序占用
2. **数据持久化**: 所有数据保存在 `data/` 目录的 JSON 文件中
3. **会话存储**: 当前使用内存存储，服务器重启会清除所有会话
4. **密码安全**: 密码使用 bcrypt 加密，安全强度为 10 轮

---

## ✅ 测试检查清单

- [ ] 首页可以正常访问
- [ ] 登录页面样式正确显示
- [ ] 正确密码可以登录
- [ ] 错误密码被拒绝
- [ ] 登录后可以访问 admin.html
- [ ] 未登录访问 admin.html 会重定向到登录页
- [ ] 登录后可以调用修改数据的 API
- [ ] 未登录调用修改数据的 API 被拒绝
- [ ] 退出登录功能正常
- [ ] 会话过期后需要重新登录

---

## 🆘 常见问题

**Q: 启动服务器时报错 "Address already in use"**  
A: 端口 3000 被占用，使用 `lsof -i :3000` 查找占用进程并关闭

**Q: 登录后仍然无法访问 admin.html**  
A: 检查浏览器是否启用了 Cookie，或尝试清除浏览器缓存

**Q: 修改代码后没有生效**  
A: 需要重启 node 服务器（Ctrl+C 然后重新启动）

**Q: 无法连接到数据库**  
A: 本项目使用文件系统存储，不需要数据库

---

## 📞 技术支持

遇到问题请检查：
1. Node.js 版本是否 >= 14
2. npm 依赖是否正确安装
3. 服务器是否正常启动
4. 端口是否被占用

更新日期: 2025年11月17日
