Fekit Mobile Debug
#### fekit 插件
	替换html文件中的资源文件路径为本机ip地址，这样就可直接在手机访问该资源文件

#### 安装
    
    npm install fekit-extension-mdebug -g

### 使用

	在要替换的html路径下运行fekit mdebug

### 参数说明：
	-i 指定替换的ip地址，默认为本机ip地址，如本机有多个ip地址，则取第一个
	-p 指定端口号，默认80端口
	-w 增加weinre
	-r revert到最初版本