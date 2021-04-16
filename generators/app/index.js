const Generator = require("yeoman-generator");
 
module.exports  =  class extends Generator{
    prompting(){
        return this.prompt([
            {
                type:"input",
                name:"name",
                default:this.appname,
                message:"Your projct name"
            }
        ]).then(answers=>{
            console.log(answers)
            this.answers = answers
        })
    }
    writing(){
        //把每一个文件都通过模板转换到目标路径
        const templates = [
            'vue.config.js',
            'README.md',
            'package.json',
            'package-lock.json',
            'babel.config.js',
            '.gitignore',
            '.env.test',
            '.env.production',
            '.env.development',
            'public/js/AdSDK.js',
            'public/index.html',
            'public/favicon.ico',
            'src/vuex/store.js',
            'public/index.html',
            'src/components/video-page/index.vue',
            'src/components/process/index.vue',
            'src/components/ModalWrapper/ModalWrapper.vue',
            'src/components/ModalWrapper/ModalInstance.js',
            'src/components/ModalWrapper/index.js',
            'src/components/lottie/index.vue',
            'src/components/loading/index.vue',
            'src/components/Integral-wall/index.vue',
            'src/assets/images/icon.png',
            'src/api/sign.js',
            'src/api/JavaRequest.js',
            'src/api/javaApi.js',
            'src/api/index.js',
            'src/api/cookie.js'
        ]
        templates.forEach(item=>{
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answers
            )
        })
    }
}