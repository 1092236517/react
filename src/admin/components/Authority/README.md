### 使用方式
  
> 注意： 声明 resid 在整个应用需要唯一(最好提前配置在 `config/resId` 目录下)

    import authority, {AuthorityButton} from 'ADMIN_COMPONENTS/Authority';
    import resId from 'ADMIN_CONFIG/resId';
    
     1. {authority(resId.xxx.func1)(<Button>保存</Button>)}
    
     2. {authority({
          resid: resId.another.func1
         })(<Button>保存</Button>)}
    
     3. <AuthorityButton resid={resId.another.func2}/>