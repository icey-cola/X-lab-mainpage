#!/bin/bash
# 本地开发服务器启动脚本

echo "========================================"
echo "  X-Lab 本地开发服务器"
echo "========================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "server/server.js" ]; then
  echo "❌ 错误: 请在项目根目录运行此脚本"
  exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
  echo "❌ 错误: 未安装 Node.js"
  echo "请先安装 Node.js: https://nodejs.org/"
  exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo "✓ npm 版本: $(npm --version)"
echo ""

# 检查依赖是否安装
if [ ! -d "server/node_modules" ]; then
  echo "📦 正在安装依赖..."
  cd server && npm install
  cd ..
  echo "✓ 依赖安装完成"
  echo ""
fi

# 停止已运行的服务器
if pgrep -f "node server.js" > /dev/null; then
  echo "🛑 停止旧的服务器进程..."
  pkill -f "node server.js"
  sleep 1
fi

# 启动服务器
echo "🚀 启动服务器..."
cd server
node server.js &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 检查服务器是否成功启动
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo ""
  echo "========================================"
  echo "  ✅ 服务器启动成功！"
  echo "========================================"
  echo ""
  echo "📍 访问地址:"
  echo "   首页:     http://localhost:3000"
  echo "   登录:     http://localhost:3000/login.html"
  echo "   管理后台: http://localhost:3000/admin.html"
  echo ""
  echo "🔐 测试账号:"
  echo "   用户名: admin"
  echo "   密码:   admin123"
  echo ""
  echo "💡 提示:"
  echo "   - 按 Ctrl+C 停止服务器"
  echo "   - 查看日志: tail -f server.log"
  echo "   - 测试指南: LOCAL_DEV_GUIDE.md"
  echo ""
  echo "========================================"
  
  # 等待用户中断
  wait $SERVER_PID
else
  echo ""
  echo "❌ 服务器启动失败"
  echo "请检查端口 3000 是否被占用: lsof -i :3000"
  exit 1
fi
