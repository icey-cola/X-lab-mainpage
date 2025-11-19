// 用于生成管理员密码哈希的工具脚本
// 使用方法: node generate-password.js your-password

import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('生成哈希失败:', err);
    process.exit(1);
  }
  
  console.log('\n=================================');
  console.log('密码:', password);
  console.log('哈希:', hash);
  console.log('=================================\n');
  console.log('将此哈希值复制到 server.js 中的 ADMIN_CREDENTIALS.passwordHash');
});
