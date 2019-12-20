/**
 * @method TabScroll tab滚动切换
 * @param {Object} [options] 滚动插件的参数
 * @param {String} [options.eletabElementments] 挂载的tabDOM节点
 * @param {String} [options.areaElement] 挂载的areaDOM节点
 * @param {Number} [options.scrollTop] 浏览器滚动的高度
 * @param {Number} [options.clientHeight] 页面窗口高度
 * @param {Number} [options.scrollHeight] 滚动条高度
 * @param {Number} [options.fixdTabHeight] 滚动条高度
 * @return {TabScroll}
 * 
*/

var TabScroll = function (options) {
    // 挂载元素及参数

    // tab元素
    this.eletabElementments = options.eletabElementments || '';
    
    // 内容区域判断位置元素
    this.areaElement = options.areaElement || '';

    // 页面当前滚动的位置
    this.scrollTop = 0;

    // 视图窗口高度
    this.clientHeight = 0;

    // 滚动条高度
    this.scrollHeight = 0;

    // tab高度
    this.fixdTabHeight = options.fixdTabHeight || 0;

    // 页面从头到第一个tab位置的距离
    this.activeTab = 0;

    // tab元素数组
    this.eletabArr = [];

    // 内容区域元素数组
    this.areaArr = [];

    // tab长度
    this.length = 0;

    // 需要挂在的DOM class类
    this.activeClass = options.activeClass || '';

    // 旧的className
    this.oldClassName = '';

    // class类拼接
    this.newClassName = '';

    // 初始化方法
    this.init();
    return this;
}

/**
 * @method init 插件的初始化方法 
 * */ 
TabScroll.prototype.init = function () {
    let _this = this;
    // tab元素集合
    this.eletabArr = document.getElementsByClassName(this.eletabElementments);

    // 内容区判断位置元素集合
    this.areaArr = document.getElementsByClassName(this.areaElement);

    // 集合数量
    this.length = this.eletabArr.length;

    // 视图窗口高度
    this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

    // 滚动条高度
    this.scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    // 监听window的滚动事件，赋值给当前的滚动条位置
    window.onscroll = function () {
        _this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        _this.scrollTab();
    }
}

/**
 * @method scrollTab 滚动切换
 * 
 * */ 
TabScroll.prototype.scrollTab = function () {
    // 从页面顶端到第二个位置的距离
    this.activeTab = this.areaArr[1].offsetTop - this.fixdTabHeight;

    // 当页面没有或者之后一个tab的时候返回
    if (this.length === 0 || this.length === 1) {
        return false;
    };
    
    // 当页面从头到第一个tab位置的距离大于当前滚动条的位置并且滚动条位置不为0时，给tab的第一项加选中效果的class
    if (this.activeTab > this.scrollTop && this.scrollTop > 0) {

        // 先获取原来类的className
        this.oldClassName = this.eletabArr[0].getAttribute('class');

        // 如果之前的类里有选中项的类，则不添加这个类
        if (this.oldClassName.indexOf(this.activeClass) != -1) {
            this.eletabArr[0].setAttribute('class', this.oldClassName);
        } else {
            // 将原来的类和选中的类做拼接
            this.newClassName = this.oldClassName + " " + this.activeClass;

            // 最后将拼接到的新类赋值给当前的tab
            this.eletabArr[0].setAttribute('class', this.newClassName);
        }

        // 将其他tab的class类获取到，并且判断这个类里是否包含选中类的字段，如果有，将其删除，并返回删除选中类后的类
        for (let i=1; i < this.length - 1; i++) {
            // 先获取到之前的class类名
            this.oldClassName = this.eletabArr[i].getAttribute('class');
            // 如果这个单元里包含选中项class类，则做删除
            if (this.oldClassName.indexOf(this.activeClass) != -1) {
                // 使用splice删除这个
                // let classArr = this.oldClassName.split(this.activeClass);
                this.removeActiveClass(this.eletabArr, i);
            }
            this.eletabArr[i].setAttribute('class', this.oldClassName);
        }
    }

    // 因为第一项已经被修改，所以从第二项开始循环
    for (let k=1; k < this.length; k++) {
        // 如果循环项大于最大长度，则直接返回
        if (k > this.length) {
            return false;
        }

        // 如果k等于最后一个下标，则表明是最后一项
        if (k === (this.length - 1)) {
            // 判断区域的offsetTop值减去tab的高度，并且这个高度小于页面的scrollTop值时，此判断成立
            // 或者滚动高度加上页面可视区域高度等于滚动条的高度时，此判断也成立
            if (this.areaArr[k].offsetTop - this.fixdTabHeight < this.scrollTop || this.scrollTop + this.clientHeight === this.scrollHeight) {
                // 此时的k应该等于(数组长度-1)，并给此项在原来的基础类的基础上添加选中的class类
                this.getClass(this.eletabArr[k]);
                // 而此时，其他项应该去掉这个选中类activeClass
                // 因为第k项现在是选中项，那么a不等于k的项，就是要去掉activeClass类的项，这里我们先获取此项的原始类，并且判断里面是否含有activeClass类，如果有，删除此类
                this.removeActiveClass(this.eletabArr, k);
            };
            break;
        }
        else {
            // 判断区域的offsetTop值减去tab的高度，并且这个高度小于页面的scrollTop值并且下一项的offsetTop值减去tab高大于this.scrollTopshi，此判断成立
            if (this.areaArr[k].offsetTop - this.fixdTabHeight < this.scrollTop && this.areaArr[k + 1].offsetTop - this.fixdTabHeight > this.scrollTop) {
                // 此时的k应该等于(数组长度-1)，并给此项在原来的基础类的基础上添加选中的class类
                this.getClass(this.eletabArr[k]);
                // 而此时，其他项应该去掉这个选中类activeClass
                // 因为第k项现在是选中项，那么a不等于k的项，就是要去掉activeClass类的项，这里我们先获取此项的原始类，并且判断里面是否含有activeClass类，如果有，删除此类
                this.removeActiveClass(this.eletabArr, k);
            }
        }
    }

}


/**
 * @method getClass 获取类的方法
 * @param {String} el 要获取类的项
*/
TabScroll.prototype.getClass = function (el) {
    // 先获取原来类的className
    this.oldClassName = el.getAttribute('class');

    // 如果之前的类里有选中项的类，则不添加这个类
    if (this.oldClassName.indexOf(this.activeClass) != -1) {
        el.setAttribute('class', this.oldClassName);
    } else {
        // 将原来的类和选中的类做拼接
        this.newClassName = this.oldClassName + " " + this.activeClass;

        // 最后将拼接到的新类赋值给当前的tab
        el.setAttribute('class', this.newClassName);
    }
}

/**
 * @method removeActiveClass 删除选中类的方法
 * @param {Array} siblings 除选中项以外的其他项
*/
TabScroll.prototype.removeActiveClass = function (siblings, k) {
    // 循环此对象的长度
    for (let a=0; a < this.length; a++) {
        // 因为第k项现在是选中项，那么a不等于k的项，就是要去掉activeClass类的项，这里我们先获取此项的原始类，并且判断里面是否含有activeClass类，如果有，删除此类
        if (a !== k) {
            // 先获取此项的原始类
            this.oldClassName = siblings[a].getAttribute('class');
            // 判断是否含有选中类名，若有，删除
            if (this.oldClassName.indexOf(this.activeClass) != -1) {
                // 分割字符串，删除此选中类，返回一个数组
                let classNameArr = this.oldClassName.split(this.activeClass);
                // 定义一个变量来拼接原来的类
                var classNameJoin = '';
                // 循环返回的数组，进行原有类的拼接
                for (let a = 0; a < classNameArr.length; a++) {
                  // 判断classNameArr[a]不为空
                  if (classNameArr[a] !== "") {
                    // 原有类名的拼接，并取掉前后的空格
                    classNameJoin = trim(classNameArr[a] + " ");
                  }
                }
                // 赋值给新类名
                this.newClassName = classNameJoin;
                // 给其他项重新赋值类名
                siblings[a].setAttribute('class', this.newClassName);
            }
        }
    }
}

// 去掉前后空格
function trim(str){   
  return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
}

