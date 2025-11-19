#!/bin/bash
# 自动化测试脚本 - 测试所有认证功能

echo "========================================"
echo "  X-Lab 功能测试脚本"
echo "========================================"
echo ""

BASE_URL="http://localhost:3000"
COOKIE_FILE="/tmp/xlab_test_cookies.txt"
TEST_PASSED=0
TEST_FAILED=0

# 清理之前的 cookie
rm -f $COOKIE_FILE

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_api() {
  local test_name="$1"
  local expected="$2"
  shift 2
  local result=$(eval "$@")
  
  if echo "$result" | grep -q "$expected"; then
    echo -e "${GREEN}✓${NC} $test_name"
    TEST_PASSED=$((TEST_PASSED + 1))
  else
    echo -e "${RED}✗${NC} $test_name"
    echo "   预期: $expected"
    echo "   实际: $result"
    TEST_FAILED=$((TEST_FAILED + 1))
  fi
}

echo "🧪 开始测试..."
echo ""

# 测试 1: 检查服务器是否运行
echo "1️⃣  服务器连接测试"
test_api "首页可访问" "X-Lab" "curl -s $BASE_URL | head -20"

# 测试 2: 登录页面
echo ""
echo "2️⃣  登录页面测试"
test_api "登录页面可访问" "管理员登录" "curl -s $BASE_URL/login.html | head -10"

# 测试 3: 认证状态检查（未登录）
echo ""
echo "3️⃣  认证状态测试"
test_api "未登录状态" "authenticated.*false" "curl -s $BASE_URL/api/auth/status"

# 测试 4: 错误密码登录
echo ""
echo "4️⃣  登录验证测试"
test_api "错误密码被拒绝" "用户名或密码错误" "curl -s -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"wrong\"}'"

# 测试 5: 正确密码登录
test_api "正确密码登录成功" "success.*true" "curl -s -c $COOKIE_FILE -X POST $BASE_URL/api/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"

# 测试 6: 登录后的认证状态
echo ""
echo "5️⃣  会话管理测试"
test_api "登录后认证状态" "authenticated.*true" "curl -s -b $COOKIE_FILE $BASE_URL/api/auth/status"
test_api "会话包含用户名" "username.*admin" "curl -s -b $COOKIE_FILE $BASE_URL/api/auth/status"

# 测试 7: 未登录访问受保护的 API
echo ""
echo "6️⃣  API 权限保护测试"
test_api "未登录访问被拒绝" "未授权访问" "curl -s -X POST $BASE_URL/api/members -H 'Content-Type: application/json' -d '{\"name\":\"Test\"}'"

# 测试 8: 登录后访问受保护的 API
test_api "登录后可访问 API" "id.*s-" "curl -s -b $COOKIE_FILE -X POST $BASE_URL/api/slides -H 'Content-Type: application/json' -d '{\"media\":\"test.jpg\",\"mediaType\":\"image\"}'"

# 测试 9: 登出功能
echo ""
echo "7️⃣  登出功能测试"
test_api "登出成功" "success.*true" "curl -s -b $COOKIE_FILE -X POST $BASE_URL/api/auth/logout"
test_api "登出后认证失效" "authenticated.*false" "curl -s -b $COOKIE_FILE $BASE_URL/api/auth/status"

# 测试 10: 公共 API 访问（不需要登录）
echo ""
echo "8️⃣  公共 API 测试"
test_api "获取成员列表" "\\[" "curl -s $BASE_URL/api/members"
test_api "获取出版物" "\\[" "curl -s $BASE_URL/api/publications"

# 清理
rm -f $COOKIE_FILE

# 输出测试结果
echo ""
echo "========================================"
echo "  测试结果"
echo "========================================"
echo -e "${GREEN}通过: $TEST_PASSED${NC}"
echo -e "${RED}失败: $TEST_FAILED${NC}"
echo "总计: $((TEST_PASSED + TEST_FAILED))"
echo ""

if [ $TEST_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ 所有测试通过！${NC}"
  exit 0
else
  echo -e "${RED}❌ 有测试失败，请检查${NC}"
  exit 1
fi
