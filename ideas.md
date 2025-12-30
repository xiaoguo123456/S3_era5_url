# ERA5数据下载生成器设计理念

<response>
<text>
**Design Movement**: Swiss Style (International Typographic Style) meets Modern Utility

**Core Principles**:
1. **Clarity First**: 数据工具的核心是清晰。通过严格的网格系统和清晰的层级结构，让复杂的数据选择变得直观。
2. **Precision**: 界面元素应当传达出科学数据的精确感，使用细线条、精确的对齐和高对比度的文字。
3. **Functionality as Aesthetic**: 功能本身就是美。不添加无意义的装饰，每一个元素都有其存在的理由。
4. **Visual Hierarchy**: 通过字体大小、粗细和色彩的微妙变化来引导用户的视线，从大类选择到具体变量，再到时间范围。

**Color Philosophy**:
- **Base**: 纯净的白色 (#FFFFFF) 和深灰色 (#1A1A1A) 作为主基调，营造专业、冷静的氛围。
- **Accent**: 使用深邃的 **Teal (蓝绿色)** (#0F766E) 作为主强调色，代表大气科学和数据的深度。
- **Functional Colors**: 
  - 成功/下载: 鲜明的翠绿色 (#10B981)
  - 警告/注意: 温暖的琥珀色 (#F59E0B)
  - 错误: 柔和的赤土色 (#EF4444)
- **Reasoning**: 这种配色方案既保持了科学工具的严谨性，又避免了传统"科技蓝"的单调，给人一种现代、环保且高效的感觉。

**Layout Paradigm**:
- **Split Screen / Asymmetric**: 避免传统的居中布局。左侧为控制面板（选择器），右侧为实时预览和结果展示区域。
- **Sticky Controls**: 关键的操作按钮（如生成链接、复制）始终保持在可视范围内。
- **Card-based Grouping**: 将不同的选择维度（数据类型、变量、时间）封装在清晰的卡片中，利用阴影和边框界定范围。

**Signature Elements**:
- **Monospace Data**: 所有的数值、代码片段和文件名使用高质量的等宽字体 (JetBrains Mono 或类似)，强调数据的技术属性。
- **Subtle Grids**: 背景中可以包含非常淡的网格线或点阵，暗示数据的结构化特征。
- **Crisp Borders**: 按钮和输入框使用细而锐利的边框，减少圆角半径 (2px - 4px)，增强精密感。

**Interaction Philosophy**:
- **Immediate Feedback**: 用户的每一个选择都应立即反映在右侧的预览区域。
- **Progressive Disclosure**: 默认只展示最常用的选项，高级选项（如特定时间筛选）通过折叠面板按需展开。
- **Micro-interactions**: 按钮点击时的轻微下沉，开关切换时的平滑过渡，复制成功时的短暂提示。

**Animation**:
- **Swift & Precise**: 动画时间短（150ms - 200ms），曲线陡峭，给人一种快速响应的感觉。
- **Staggered Entrance**: 页面加载时，各个卡片按顺序快速滑入，增加层次感。

**Typography System**:
- **Headings**: Inter 或 Helvetica Now Display，字重 600/700，紧凑的字间距。
- **Body**: Inter，字重 400，良好的阅读性。
- **Data/Code**: JetBrains Mono 或 Fira Code，字重 400/500，确保字符对齐。
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Design Movement**: Neomorphism (Soft UI) evolved for Data

**Core Principles**:
1. **Softness & Approachability**: 降低科学数据的冷峻感，通过柔和的光影让界面看起来更亲切、易用。
2. **Tactile Feel**: 按钮和卡片看起来像是从背景中挤压出来的，给人一种想要触摸的欲望。
3. **Minimalist Focus**: 极简的色彩使用，主要通过光影来区分层级，减少视觉干扰。

**Color Philosophy**:
- **Base**: 浅灰蓝色 (#EEF2F6) 作为背景，营造柔和的氛围。
- **Shadows**: 使用双重阴影（亮白高光 + 深色阴影）创造体积感。
- **Accent**: 柔和的 **Periwinkle (长春花蓝)** (#6366F1) 用于激活状态。

**Layout Paradigm**:
- **Central Focus**: 核心操作区域居中，周围留白，像是一个控制台。
- **Floating Elements**: 关键信息悬浮在背景之上。

**Signature Elements**:
- **Soft Rounded Corners**: 大圆角 (12px - 16px)。
- **Inner Shadows**: 输入框使用内阴影，表现凹陷感。

**Interaction Philosophy**:
- **Press & Release**: 按钮点击时有明显的凹陷动画。

**Animation**:
- **Smooth & Flowing**: 缓动曲线平滑，动画时间稍长 (300ms)，给人一种液体的流动感。

**Typography System**:
- **Rounded Sans**: Nunito 或 Quicksand，圆润的字体配合柔和的界面。
</text>
<probability>0.05</probability>
</response>

<response>
<text>
**Design Movement**: Cyberpunk / High-Tech Terminal

**Core Principles**:
1. **Data Density**: 强调在一个屏幕上展示尽可能多的信息，模拟专业终端。
2. **High Contrast**: 深色背景配合高亮文字，减少眼睛疲劳，适合长时间工作。
3. **Raw Data Aesthetics**: 暴露数据的原始形态，不加过多的修饰。

**Color Philosophy**:
- **Base**: 深黑色 (#050505) 或深午夜蓝。
- **Accent**: 霓虹绿 (#00FF41) 或 赛博粉 (#FF00FF)。

**Layout Paradigm**:
- **Dashboard Grid**: 模块化的网格布局，每个模块都有标题栏和边框。
- **Fixed Sidebar**: 左侧固定导航，右侧内容滚动。

**Signature Elements**:
- **Glitch Effects**: 偶尔的故障艺术效果。
- **Terminal Lines**: 扫描线效果。

**Interaction Philosophy**:
- **Instant**: 无过渡动画，瞬间切换。

**Animation**:
- **Typing Effect**: 文字逐字显示。

**Typography System**:
- **All Monospace**: 全站使用等宽字体，如 Space Mono。
</text>
<probability>0.03</probability>
</response>
