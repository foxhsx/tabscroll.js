# tabscroll.js
> tab-scroll是一个监听滚动来实现tab切换的Js库

- v1.0.1
  - 新增tab区域点击事件，页面会滚动到对应的位置

- v1.0.0
  - tabscroll诞生

#### 引用
```javascript
<script type="text/javacript" src="./js/tabscroll.js"></script>
```

#### 实例化
```javascript
let tabscroll = new TabScroll({
  eletabElementments: 'tab-scroll',       // tab区域对应class类名
  areaElement: 'tab-content-item',        // 内容区域对应要监听offsetTop的class类
  fixdTabHeight: 82,                      // tab的高度
  activeClass: 'active'                   // tab的选中效果类
})
```
