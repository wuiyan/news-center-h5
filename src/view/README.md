# View 目录结构说明

## 目录组织

本项目按功能模块重新组织了 `view` 目录，使代码结构更加清晰明了。

```
view/
├── Index.vue                    # 主页面（首页）
│
├── auth/                        # 认证相关页面
│   ├── Login.vue               # 登录页面
│   └── Register.vue            # 注册页面
│
├── content/                     # 内容相关页面
│   ├── Detail.vue              # 资讯详情页
│   ├── Publish.vue             # 发布资讯页
│   ├── UserDetail.vue          # 用户详情页
│   └── Articlestats.vue        # 作品统计页
│
├── profile/                     # 个人中心相关页面
│   ├── Profile.vue             # 个人中心主页
│   ├── ProfileEdit.vue         # 编辑资料页
│   └── Settings.vue            # 设置页面
│
└── other/                       # 其他页面
    └── About.vue               # 关于页面
```

## 功能说明

### auth/ - 认证模块
处理用户登录、注册相关的功能

### content/ - 内容模块
处理内容展示、发布、详情等功能

### profile/ - 个人中心模块
处理用户个人信息管理、设置等功能

### other/ - 其他模块
处理不属于上述分类的通用页面

## 路径引用规范

在 `view` 子目录中的文件引用资源时，请注意路径层级：

### 引用 API
- **位置**: `view/auth/*`, `view/content/*`, `view/profile/*`
- **目标**: `src/api/*`
- **路径**: `../../api/*`

示例：
```javascript
import { getUserInfo } from "../../api/user.js";
```

### 引用组件
- **位置**: `view/auth/*`, `view/content/*`, `view/profile/*`
- **目标**: `src/components/*`
- **路径**: `../../components/*`

示例：
```javascript
import BottomTabBar from "../../components/BottomTabBar.vue";
```

### 引用环境变量
- **位置**: 任意 `view` 下的文件
- **目标**: 环境变量
- **路径**: 直接使用，无需相对路径

示例：
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## 路由配置

路由配置位于 `src/router/router.js`，所有路由已更新为新的文件路径。

## 迁移日志

- 2025-02-09: 初始重组，按功能划分目录结构
- 所有相关导入路径已更新
- 路由配置已同步更新
