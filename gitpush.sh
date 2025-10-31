#!/bin/bash
# ========================================================
# 自动执行 git add / commit / push
# 用法：
#   ./gitpush.sh "你的提交说明"
# 如果不传参数，默认使用当前时间作为提交信息
# ========================================================

# 1. 检查是否在 git 仓库中
if [ ! -d .git ]; then
  echo "❌ 当前目录不是一个 Git 仓库！"
  exit 1
fi

# 2. 提交信息：如果没有传参数就用时间戳
commit_msg=${1:-"update: $(date '+%Y-%m-%d %H:%M:%S')"}

# 3. 获取当前分支名（自动识别 main 或其他分支）
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ -z "$current_branch" ]; then
  echo "❌ 未检测到分支，请先执行 git init 或切换到一个分支。"
  exit 1
fi

# 4. 添加所有修改
git add .

# 5. 提交
git commit -m "$commit_msg"

# 6. 推送到当前分支
git push -u origin "$current_branch"

echo "✅ 推送完成！分支：$current_branch"
