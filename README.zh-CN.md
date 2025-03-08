# MockCat: AI驱动的模拟数据生成器

[English](README.md) | [简体中文](README.zh-CN.md)

MockCat是一个全栈应用程序，可帮助您使用Gemini AI基于表结构生成逼真的模拟数据。

## 安装设置

1. 克隆存储库
2. 安装依赖项:
   ```bash
   npm install
   ```
3. 配置环境变量:
   ```bash
   cp .env.example .env
   ```
   然后编辑`.env`文件，添加您的Gemini API密钥和其他必要凭据。

4. 启动开发服务器:
   ```bash
   npm run dev
   ```

## 功能特点

- **AI驱动的数据生成**: 使用Gemini AI根据您的架构创建上下文相关的数据
- **多种输出格式**: 将模拟数据导出为JSON、CSV、SQL或直接导出到支持的数据库
- **架构导入**: 导入现有数据库架构或手动定义架构
- **数据关系**: 支持外键关系以保持数据完整性
- **可自定义模板**: 保存您的生成配置以供将来使用

## 使用方法

1. 通过UI定义表结构或从现有架构导入
2. 配置生成设置（记录数量、数据分布等）
3. 生成您的模拟数据
4. 预览并根据需要进行调整
5. 以您喜欢的格式导出

## 技术栈

- **前端**: React, TypeScript, Tailwind CSS
- **后端**: Node.js, Express
- **AI集成**: Google Gemini API
- **数据库**: MongoDB（用于存储模板和用户首选项）

## 贡献指南

欢迎贡献！请随时提交拉取请求。

1. 复刻（Fork）存储库
2. 创建您的功能分支（`git checkout -b feature/amazing-feature`）
3. 提交您的更改（`git commit -m '添加一些很棒的功能'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 打开拉取请求

## 致谢

- 感谢Google Gemini AI提供底层语言模型功能
- 感谢使这成为可能的贡献者和开源项目
