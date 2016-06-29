/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
www.360guanai.com这个应用的Gruntfile.js，如果要对这个app进行前端发布，请将这个文件重命名为Gruntfile.js后覆盖到static.joyouschina.com下，再执行grunt命令
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
module.exports = function(grunt) {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     配置任务目标
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    grunt.initConfig({
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        读取package.json信息
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        pkg: grunt.file.readJSON("package.json"),

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        读取config.json信息
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        config: grunt.file.readJSON("config.json"),
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        合并js和css
        @合并 jquery-1.11.3.js, jquery.scrollup.js ,jquery.lazyload.js， jquery.cookie.js以及当前应用的基类为app.js
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        concat: {
            dist: {
                src: ["guanaihui/js/lib/jQuery/jquery-1.11.3.js", "bootstrap/3.3.4/js/bootstrap.js", "guanaihui/jssrc/jquery.cookie.js", "apps/m.guanaihui.com/jssrc/controller.js"],
                dest: "apps/m.guanaihui.com/jssrc/app.js"
            }
        },
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        压缩js
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        uglify: {
            build: {
                src: "apps/m.guanaihui.com/jssrc/app.js",
                dest: "apps/m.guanaihui.com/js/app.min.js"
            },
            one: {
                options: {
                    compress: true
                },
                files: {

                }
            }
        },
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        less文件编译成css
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        less: {
            /*m.guanaihui.com下app.less 文件的编译配置*/
            m_app: {
                options: {
                    compress: true
                },
                files: {
                    'apps/m.guanaihui.com/css/app.min.css': 'apps/m.guanaihui.com/less/app.less'
                }
            },
            /*单个less文件的编译配置*/
            one: {
                options: {
                    compress: true
                },
                files: {

                }
            },
            /*m.guanaihui.com下所有less文件的编译配置*/
            m_all: {
                options: {
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: 'apps/m.guanaihui.com/less/',
                    src: ['**/*.less', '!mixins/*.less', '!variables/*.less', '!bootstrap-reset.less',
                        '!components.less', '!reset.less', '!variables.less', '!mixins.less', '!normalize.less',
                        '!components/*.less'
                    ],
                    dest: 'apps/m.guanaihui.com/css/',
                    ext: '.min.css',
                }]
            }
        },

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        watch 自动监控文件变化执行Task
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        watch: {
            //weixin.guanaihui.com
            m: {
                files: ['<%=config.m.less.src%>/**/*.less', '<%=config.m.less.mainsrc%>', '<%=config.m.less.src%>/*.less',
                    '<%=config.m.js.src%>/**/*.js', '<%=config.m.js.mainsrc%>', '<%=config.m.js.src%>/controller.js'
                ],
                tasks: ["less:one", "uglify:one"],
                options: {
                    nospawn: true,
                    livereload: false
                }
            }
        }
    });


    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     加载grunt插件
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-newer');

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     注册并执行Javascript任务
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    grunt.registerTask("default", ["concat:dist", "uglify:build"]);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     注册执行Less编译相关的任务
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*m.guanaihui.com app.less文件任务*/
    grunt.registerTask("m_app", ["less:m_app"]);
    grunt.registerTask("m_all", ["less:m_all"]);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     注册执行watch编译相关的任务
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    grunt.registerTask("watch_m", ["watch:m"]); /*m站监视任务*/


    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    watch event 的监控处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    grunt.event.on("watch", function(action, filePath, target) {
        // grunt.log.writeln("action:" + action);
        // grunt.log.writeln("filePath:" + filePath);
        // grunt.log.writeln("target:" + target);

        var tmpArray = filePath.split("\\");
        var dirName = tmpArray[tmpArray.length - 2]; //目录名
        var fileName = tmpArray[tmpArray.length - 1]; //文件名
        var ext = fileName.substring(fileName.indexOf('.'), fileName.length); //文件后缀名
        var config = grunt.config.get("config." + target + ext); //指定项目的配置项对象

        if (config == undefined) {
            grunt.log.writeln("no target config");
            return;
        }

        var filesArray = new Array(); //需要Build的文件数组
        var srcFileArray = new Array(); //需要处理的源文件的数组
        var obj = {}; //定义一个空对象

        if (config.shim != undefined && config.shim.length > 0) {
            for (var i = 0; i < config.shim.length; i++) {
                var shimItem = config.shim[i];
                if (shimItem.src === dirName + "/" + fileName) {
                    if (typeof shimItem.dest === "string") {
                        srcFileArray.push(shimItem.dest);
                    } else {
                        for (var j = shimItem.dest.length - 1; j >= 0; j--) {
                            //grunt.log.writeln("shimItem.dest:" + shimItem.dest[j]);
                            srcFileArray.push(shimItem.dest[j]);
                        }
                    }
                }
            }
        } else {
            srcFileArray.push(dirName + "/" + fileName);
        }

        if (srcFileArray.length === 0) {
            srcFileArray.push(dirName + "/" + fileName);
        }

        if (srcFileArray.length === 1 && dirName === "jssrc" && ext === ".js") { //对于app.min.js的特殊处理
            grunt.log.writeln("***************************************************************************");
            grunt.log.writeln("src:" + config.mainsrc);
            grunt.log.writeln("dest:" + config.maindest);
            grunt.log.writeln("***************************************************************************");

            obj[config.maindest] = config.mainsrc;
            filesArray.push(obj);
        } else {
            for (var i = srcFileArray.length - 1; i >= 0; i--) {
                var srcItem = srcFileArray[i];
                var src = config.src + "/" + srcItem;
                var dest = config.dest + "/" + srcItem.replace(ext, config.ext);

                grunt.log.writeln("***************************************************************************");
                grunt.log.writeln("src:" + src);
                grunt.log.writeln("dest:" + dest);
                grunt.log.writeln("***************************************************************************");

                obj[dest] = src;
                filesArray.push(obj);
            }
        }

        if (ext === ".less") {
            grunt.config.set("less.one.files", filesArray);
            grunt.config.set("uglify.one.files", {});
        } else if (ext === ".js") {
            grunt.config.set("uglify.one.files", filesArray);
            grunt.config.set("less.one.files", {});
        }
    });
};
