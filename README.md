## 使用说明

### Step1 克隆/下载代码
使用git工具克隆或下载代码到指定目录1

### Step2 安装node依赖
``` shell
npm install
```
或者用阿里的npm
``` shell
cnpm install
```
### Step3 配置编辑器
* webstorm  
`Preferences | Languages & Frameworks | JavaScript | JavaScriptVersion : React JSX`
* vscode
`"javascript.implicitProjectConfig.experimentalDecorators": true`

### Step4 配置你的应用信息
1. 如果需要mock数据，mock数据按后端服务名建文件,由`scripts/mock.config.js`引入
4. 如果需要proxy数据，proxy配置在`scripts/proxy.config.js`

### Step5 运行
``` shell
npm run start-proxy
或者
npm run start-mock
```
浏览器自动打开标签，或者手动访问```http://localhost:${PORT}``` 即可看到应用

## 编码规范

### react-mobx 项目规范

#### 代码风格

* 采用Visual Studio Code自带的format工具, Visual Studio Code版本大于1.3.1。或者采用webstorm
* 代码缩进采用4个空格

#### 语法规范

* 严格使用ES6语法规范
* 组件名称和文件名称一致，采用驼峰命名，开头字母必须大写
* 组件申明不要使用displayName方法
``` javascript
// bad
export default {
  // your code
}
// good
const c = {
  // your code
}
export default c;
```

* 变量采用驼峰命名，开头字母必须小写。除了方法内变量允许以 ```_``` 开头外，其他一律不允许
* js/jsx中的字符串引号使用，强制使用单引号。html中属性强制使用双引号
``` javascript
// js
let str = 'abc';
// jsx
render() {
  return (
    <div>
      <input type="text" id="input">
      {this.state.type === 'wellcome' && <p classNmae="hello-style">ok, wellcome</p>}
    </div>
  )
}
```

* Component中按照生命周期来排列代码
``` javascript
calss Example extends React.Component{
  // ------------START----------------
  // 在END结束前的这一些方法，必须根据现有的顺序书写，方便代码逻辑查看
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    // 
  }
  componentDidMount() {
    //
  }
  componentWillReceiveProps() {
    //
  }
  componentWillUpdate() {
    //
  }
  componentDidUpdate() {
    //
  }
  // ······
  //------------ END -----------------
  // END之后再定义自己的操作方法
  handleA() {
    //
  }
  handleB() {
    //
  }
  // ······
}
```

* 针对jsx中事件方法的命名
``` javascript
// onClick
handleClick***() {}
// onFocus
handleFocus***() {}
// onBlur
handleBlur***() {}
// onChange
handleChange***() {}
```

* 代码中禁止出现以数字命名的方法```function method1(){}``` , ```function method2(){}``` ……

### 资源引入
* 在js代码中，使用下面方式引入图片路径
``` javascript
import logo from 'ADMIN_ASSETS/images/logo.png';
// in jsx code
<img src={logo}/>
```

* 在css样式中，使用相对路径。因为css样式必然在assets目录中，images文件夹也在assets目录中，故采用相对路径即可。webpack默认会转化路径

## 样式定义
* 所有样式命名采用蛇形命名法，所有字母小写。如```.sub-main-class```
* 每个页面单独添加页面样式的命名空间（类似页面可以共享一个命名空间）。如```.login-page```。避免和公有样式造成冲突
* 尽量使用公有样式，减少自定义样式
* 所有页面样式写在 ```${ENTRIES}/assets/less/pages/``` 目录下，并与项目目录结构保持一致

## react + mobx 的书写规范
* 正常情况下一个页面对应一个store，一个store维护一个view
* 建议将逻辑代码尽量写在store中，添加@action或者@action.bound的decorators来控制view

附：
    [mobx文档](https://cn.mobx.js.org/)



    
## Commit message规范 （参考[阮一峰博客](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)）
> 每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。
  
    <type>(<scope>): <subject>
    // 空一行
    <body>
    // 空一行
    <footer>
    其中，Header 是必需的，Body 和 Footer 可以省略。

#### Header   
Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。 
* type

    * 用于说明 commit 的类别，只允许使用下面7个标识。
    
    
        feat：新功能（feature）
        fix：修补bug
        docs：文档（documentation）
        style： 格式（不影响代码运行的变动）
        refactor：重构（即不是新增功能，也不是修改bug的代码变动）
        test：增加测试
        chore：构建过程或辅助工具的变动
        
* scope

    * 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
    
* subject
    * 是 commit 目的的简短描述，不超过50个字符。
    
    
        1.以动词开头，使用第一人称现在时，比如change，而不是changed或changes
        2.第一个字母小写
        3.结尾不加句号（.）

#### Body
Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

        
    More detailed explanatory text, if necessary.  Wrap it to 
    about 72 characters or so. 
    
    Further paragraphs come after blank lines.
    
    - Bullet points are okay, too
    - Use a hanging indent
有两个注意点。

（1）使用第一人称现在时，比如使用`change`而不是`changed`或`changes`。

（2）应该说明代码变动的动机，以及与以前行为的对比。

#### Footer
Footer 部分只用于两种情况。  
（1）不兼容变动

如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法。

    BREAKING CHANGE: isolate scope bindings definition has changed.
    
        To migrate the code follow the example below:
    
        Before:
    
        scope: {
          myAttr: 'attribute',
        }
    
        After:
    
        scope: {
          myAttr: '@',
        }
    
        The removed `inject` wasn't generaly useful for directives so there should be no code using it.
（2）关闭 Issue

如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。


    Closes #234
也可以一次关闭多个 issue 。


    Closes #123, #245, #992
    
#### Revert
还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以revert:开头，后面跟着被撤销 Commit 的 Header。

    revert: feat(pencil): add 'graphiteWidth' option
    
    This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
    
Body部分的格式是固定的，必须写成This reverts commit &lt;hash>.，其中的hash是被撤销 commit 的 SHA 标识符。  
 
如果当前 commit 与被撤销的 commit，在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的Reverts小标题下面。

