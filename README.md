# Vital Key Chain

Vital Key Chain 是一个隐私优先的健康数据产品原型，前端基于 React，后端基于 FastAPI。

当前产品流程：

1. 连接浏览器钱包
2. 上传文本型健康体检报告 PDF
3. 后端通过 AI 将报告解析为结构化 JSON
4. 用户在前端审查提取出的健康指标
5. 进入上链发布决策流程
6. 选择哪些摘要级别的记录需要上链
7. 连接钱包并完成上链确认流程

UI 面向演示和产品评审优化，后端具备真实解析能力，可处理实际 PDF 报告并返回规范化 JSON。

## 产品亮点

- 基于浏览器钱包的登录和注册流程
- PDF 上传与健康报告解析
- 自动 JSON 规范化和字段修复
- 用户端健康数据审查界面（分类展示、异常值标记、JSON 导出）
- 上链审查流程（可选记录、隐私说明、钱包连接、上链收据）
- 前后端均可本地双进程运行

## 技术栈

### 前端

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query

### 后端

- FastAPI
- Python 3
- OpenAI 兼容客户端
- pypdf

## 目录结构

```text
vital-key-chain/
├── src/
│   ├── components/           # 共享 UI 组件和布局
│   ├── contexts/             # 钱包 Context
│   ├── hooks/                # 钱包与 UI Hooks
│   ├── pages/                # 产品页面
│   └── test/                 # 前端测试
├── server/
│   ├── src/
│   │   ├── main.py           # FastAPI 应用与路由
│   │   ├── pdf_parser.py     # PDF 文本提取
│   │   ├── summarizer.py     # AI 解析 + JSON 规范化
│   │   └── ark_client.py     # API 客户端封装
│   ├── requirements.txt
│   └── README.md             # 后端专项说明
├── public/
├── package.json
└── README.md
```

## 主要用户流程

### 1. 钱包登录

相关文件：

- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/hooks/use-wallet.ts`
- `src/contexts/WalletContext.tsx`

支持浏览器钱包连接。钱包状态本地存储并通过 React Context 全局共享。

### 2. 健康报告上传与审查

相关文件：

- `src/pages/HealthDataUpload.tsx`
- `server/src/main.py`
- `server/src/pdf_parser.py`
- `server/src/summarizer.py`

上传页面接收 PDF 文件，发送到 FastAPI 后端，获取结构化 JSON，自动修复格式异常字段，并在前端渲染审查界面。

### 3. 上链决策与发布流程

相关文件：

- `src/pages/HealthDataOnchain.tsx`
- `src/App.tsx`

用户审查解析结果后，可进入上链审查页面，选择需要发布的记录，连接钱包，并查看最终上链收据（包含发布项目、隐私字段、钱包地址、交易哈希、时间戳）。

## 本地开发

### 前置条件

- Node.js 18+
- npm
- Python 3.11+
- 浏览器钱包（如 MetaMask）

### 前端启动

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 8080
```

前端地址：`http://127.0.0.1:8080`

### 后端启动

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
cp .env.example .env
```

在 `server/.env` 中填写 API 配置：

```env
ARK_API_KEY=your_api_key_here
ARK_BASE_URL=https://api.tu-zi.com/v1
ARK_MODEL=doubao-seed-1-6-flash-250828
```

```bash
cd server
.venv/bin/uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

后端地址：`http://127.0.0.1:8000`

### 完整启动

终端 1：

```bash
cd server
.venv/bin/uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```

终端 2：

```bash
npm run dev -- --host 127.0.0.1 --port 8080
```

访问主流程页面：

```
http://127.0.0.1:8080/health-data
```

直接访问上链页面：

```
http://127.0.0.1:8080/health-data/onchain
```

## 环境变量

### 前端

- `VITE_API_BASE_URL`：可选，省略时使用 Vite 本地代理，请求 `/api/...`
- `VITE_PROXY_TARGET`：可选，默认 `http://127.0.0.1:8000`

### 后端

- `ARK_API_KEY`：必填，AI 解析所需密钥
- `ARK_BASE_URL`：可选，默认 `https://api.tu-zi.com/v1`
- `ARK_MODEL`：可选，指定 OpenAI 兼容模型

## 前端脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run test     # 运行测试
```

## 后端 API

### 健康检查

```http
GET /health
```

响应：

```json
{ "status": "ok" }
```

### 解析健康报告

```http
POST /api/health/parse
Content-Type: multipart/form-data
```

请求字段：

- `file`：PDF 文件

响应示例：

```json
{
  "fileName": "report.pdf",
  "contentType": "application/pdf",
  "indicatorCount": 3,
  "indicators": [
    {
      "id": "glucose",
      "name": "Glucose",
      "category": "Lab Results",
      "value": "5.8",
      "unit": "mmol/L",
      "referenceRange": "3.9-6.1",
      "status": "normal",
      "instrument": ""
    }
  ],
  "meta": {
    "model": "doubao-seed-1-6-flash-250828",
    "char_count": 1234,
    "chunk_count": 1,
    "page_count": 1,
    "filename": "report.pdf",
    "max_file_size_mb": 20,
    "ark_base_url": "https://api.tu-zi.com/v1"
  }
}
```

## 设计说明

本仓库不是单纯的 API Demo，前端致力于还原真实产品形态：

- 健康数据页面面向用户审查而非原始数据展示
- 上链页面面向演示和利益相关方走查
- 产品文案、布局和视觉层次均针对演示就绪度优化

## 当前限制

- 仅支持文本型 PDF，不支持扫描件（图片型 PDF）
- 上链流程为演示导向，使用前端固定数据以保证输出可预期
- 部分钱包相关页面仍有产品与原型行为混合
- `src/index.css` 构建时会产生非阻塞的 `@import` 顺序警告

## 推荐后续方向

- 为上传报告和解析记录添加持久化存储
- 用后端数据替换上链页面的硬编码选项
- 在报告审查后添加真实的存储到保险库动作
- 围绕钱包登录添加认证会话管理
- 为上传、解析、上链流程添加端到端测试

## 验证

当前分支已通过以下验证：

```bash
npm run build
npm run test
python3 -m compileall server/src
```

## 许可证

本仓库暂未包含许可证文件。
