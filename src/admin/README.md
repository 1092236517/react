## 使用说明
### 1. antd [(点击查看文档)](https://ant.design/docs/react/introduce-cn)
由于项目为多标签切换形式，采用react-route动态加载不同页面组件，所以每个页面状态使用mobx管理，以便相互切换标签时可以恢复。
> Form  

antd的Form组件，需要将form的values交由mobx的store管理，否则页面标签切换时，不能恢复到之前的form数据，参考antd文档
    
    const MyForm = Form.create({
        mapPropsToFields: props => createFormField(props.formValues),
        onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
    })(SearchForm);
    
    <MyForm formValues={...} onValuesChange={...}/>


### 2. @tabWrap
> admin/pages/index.js
* 使用方式1（不使用mobx管理状态）


    import {tabWrap} from 'ADMIN_PAGES';
    
    @tabWrap(${tabName}') // tab的名称
    class TestPage extends React.Component { 
    }
    export default TestPage;

 * 使用方式2（使用mobx管理状态）


    import {tabWrap} from 'ADMIN_PAGES';
    
    @tabWrap({
        tabName: '${tabName}', // tab的名称
        stores: ['${storeName}'] // tab切换时，恢复这些store的view数据，tab关闭时，重置这些store的view
    })
    方式1：  @inject((stores => {
        return {
          // 需要的store
        };
    }))
    方式2： @inject('${storeName}') // 参考mobx@inject使用方式
    @observer
    class TestPage extends React.Component { 
    }
    export default TestPage;

### 3. 开发流程
1. 定义route `routes/mainTab.js`
2. 配置mock数据，加入route
3. pages下新建页面
4. store下新建页面的store和相应的view(非必须，看需求)


### TODO
    1. tab切换时，恢复history的state
    2. 抽取cli