#!/bin/bash
# X-Lab 网站部署脚本
# 使用方法: ./deploy.sh

set -e

SERVER="root@47.122.122.92"
PROJECT_DIR="/var/www/x-lab"
LOCAL_DIR="/mnt/c/shangtangzhuye"

echo "======================================"
echo "  X-Lab 网站自动化部署脚本"
echo "======================================"
echo ""

# 1. 打包项目
echo "[1/5] 打包项目文件..."
cd "$LOCAL_DIR"
tar -czf project.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='project.tar.gz' \
    --exclude='deploy.sh' \
    .
echo "✓ 项目打包完成"

# 2. 上传到服务器
echo ""
echo "[2/5] 上传文件到服务器..."
scp project.tar.gz "$SERVER:$PROJECT_DIR/"
echo "✓ 文件上传完成"

# 3. 解压并安装依赖
echo ""
echo "[3/5] 解压文件并安装依赖..."
ssh "$SERVER" << 'ENDSSH'
cd /var/www/x-lab
tar -xzf project.tar.gz
rm project.tar.gz
cd server
npm install --production
ENDSSH
echo "✓ 依赖安装完成"

# 4. 重启应用
echo ""
echo "[4/5] 重启应用..."
ssh "$SERVER" "pm2 restart x-lab-website"
echo "✓ 应用重启完成"

# 5. 检查状态
echo ""
echo "[5/5] 检查应用状态..."
ssh "$SERVER" "pm2 list && curl -I http://localhost 2>&1 | grep -E '(HTTP|Server)'"
echo ""
echo "======================================"
echo "  部署完成！"
echo "  访问地址: http://47.122.122.92"
echo "======================================"

# 清理本地临时文件
rm -f "$LOCAL_DIR/project.tar.gz"
