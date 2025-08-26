# UI 设计底线规范

**核心原则：层级扁平化，避免过度设计，专注功能性**

---

## 1. 🚫 设计底线（禁止事项）

### 层级结构底线
- **禁止超过 3 层容器嵌套**（页面容器 → 组件容器 → 内容区域）
- **禁止装饰性容器**（如纯视觉效果的包装div）
- **禁止玻璃拟态过度使用**（`backdrop-blur-sm` 等复杂背景效果）
- **禁止多重阴影叠加**（一个组件最多一种阴影）

### 视觉复杂度底线
- **禁止渐变背景**（除非是主题色系统必需）
- **禁止过度圆角**（统一使用 `rounded-lg`，特殊情况 `rounded-xl`）
- **禁止复杂边框组合**（避免 `border + shadow + backdrop-blur` 同时使用）

---

## 2. ✅ 标准容器层级

### 页面级容器
```tsx
// 最外层：简单间距容器
<div className="space-y-6">
  {/* 组件内容 */}
</div>
```

### 组件级容器
```tsx
// 组件容器：白色背景 + 简单边框
<div className="bg-white rounded-lg border border-gray-200 p-6">
  {/* 组件内容 */}
</div>
```

### 标签页容器
```tsx
// 标签页：灰色背景 + 网格布局
<TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
  <TabsTrigger className="rounded-md py-2 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
    标签
  </TabsTrigger>
</TabsList>
```

---

## 3. 🎯 核心控件规范

### 输入控件统一尺寸
- **主要输入框**：`h-12 rounded-lg`
- **次要输入框**：`h-10 rounded-lg`
- **按钮**：`h-12 rounded-lg`
- **选择器**：与输入框保持一致

### 标准样式模板
```tsx
// 输入框
<Input className="h-12 rounded-lg bg-white border-gray-300" />

// 按钮
<Button className="h-12 rounded-lg font-medium" />

// 选择器
<SelectTrigger className="h-12 rounded-lg bg-white border-gray-300" />
```

---

## 4. 📱 响应式设计原则

### 移动端优先
- 移动端使用 **Select 选择器** 替代标签页
- 桌面端使用 **TabsList 网格布局**
- **移动端紧凑间距**：减少不必要的空白，提高屏幕利用率

### 移动端紧凑布局标准
```tsx
// 响应式容器间距
<div className="p-4 md:p-6">                    // 容器内边距
<div className="mb-4 md:mb-6">                  // 标题底部间距
<div className="space-y-4 md:space-y-6">        // 垂直间距
<div className="gap-3 md:gap-4">                // 网格间距
<h2 className="text-lg md:text-xl">             // 标题字体大小
<div className="mt-4 md:mt-6 space-y-3 md:space-y-4">  // 内容区间距
```

### 标准响应式模板
```tsx
{/* 移动端选择器 */}
<div className="md:hidden">
  <Select>
    <SelectTrigger className="h-12 rounded-lg">
      <SelectValue />
    </SelectTrigger>
  </Select>
</div>

{/* 桌面端标签页 */}
<div className="hidden md:block">
  <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
    {/* 标签内容 */}
  </TabsList>
</div>
```

### 响应式间距原则
- **移动端**：优先紧凑布局，减少滚动需求
- **桌面端**：保持舒适的视觉呼吸空间
- **断点统一**：使用 `md:` 作为主要响应式断点

---

## 5. 🎨 视觉一致性

### 颜色系统
- **主色调**：`text-primary`、`bg-primary`
- **文字层级**：`text-gray-900` → `text-gray-700` → `text-gray-600`
- **背景层级**：`bg-white` → `bg-gray-50` → `bg-gray-100`

### 状态反馈
- **信息提示**：`bg-blue-50 border-blue-200 text-blue-800`
- **成功状态**：`bg-green-50 border-green-200 text-green-800`
- **错误状态**：`bg-red-50 border-red-200 text-red-800`

---

## 6. 🔧 实施检查清单

### 开发前检查
- [ ] 组件层级是否超过 3 层？
- [ ] 是否使用了装饰性容器？
- [ ] 是否有不必要的背景效果？

### 组件完成检查
- [ ] 输入控件尺寸是否统一？
- [ ] 移动端是否有合适的交互方式？
- [ ] 颜色使用是否符合系统规范？

### 跨组件一致性检查
- [ ] 相同功能组件样式是否一致？
- [ ] 间距系统是否统一使用 `space-y-6`？
- [ ] 响应式断点是否统一？

---

## 7. 🚀 AI 实施指令

**当修改或创建 UI 组件时，必须：**

1. **先简化层级**：移除多余容器，最多 3 层嵌套
2. **统一控件尺寸**：`h-12` 主要控件，`h-10` 次要控件
3. **标准化容器**：使用响应式间距 `p-4 md:p-6`
4. **响应式适配**：移动端选择器 + 桌面端标签页
5. **移动端紧凑布局**：使用 `space-y-4 md:space-y-6`、`gap-3 md:gap-4`
6. **颜色系统**：使用标准的 gray 色阶和 primary 主色

**移动端优化要求：**
- 容器间距：`p-4 md:p-6`
- 标题间距：`mb-4 md:mb-6`
- 垂直间距：`space-y-4 md:space-y-6`
- 网格间距：`gap-3 md:gap-4`
- 字体大小：`text-lg md:text-xl`
- 内容区间距：`mt-4 md:mt-6 space-y-3 md:space-y-4`

**禁止使用：**
- 玻璃拟态效果（`backdrop-blur-sm`、`bg-white/40` 等）
- 复杂阴影组合
- 装饰性图标容器
- 固定间距（必须使用响应式间距）
- 过度的响应式类名