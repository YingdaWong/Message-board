// 留言板 application 应用程序
// 模块依赖项声明放在开头

var http = require('http')
var fs = require('fs')
var url = require('url')
var template = require('art-template')
var sd = require('silly-datetime')


//先用死数据做
var comments = [
    {
        name: '王英达1',
        message: '打风暴么？',
        dateTime: '2020-5-9'
    },
    {
        name: '王英达2',
        message: '打风暴么？',
        dateTime: '2020-5-9'
    },
    {
        name: '王英达3',
        message: '打风暴么？',
        dateTime: '2020-5-9'
    },
    {
        name: '王英达4',
        message: '打风暴么？',
        dateTime: '2020-5-9'
    },
    {
        name: '王英达5',
        message: '打风暴么？',
        dateTime: '2020-5-9'
    },
    
]


http  //简写，创建服务器并启动
    .createServer(function (req, res) {

        //parse 方法将请求路径解析成一个方便处理的对象，第二个参数设为 true 可以把 query 直接转为对象
        var parseObj = url.parse(req.url, true)

        //单独获取不包含查询字符串 query 的请求路径（不包含 ？ 之后的内容）
        var pathname = parseObj.pathname

        //主页，展示评论
        if (pathname === '/') {
            //主页，显示评论列表
            fs.readFile ('./views/index.html', function (err, data) {
                if (err) {
                    return res.end('404 not found')
                }
                var htmlresult = template.render(data.toString(), {
                    comments: comments
                })
                res.end(htmlresult)
            })
        } else if (pathname === '/post') {
            //跳转到发表评论页  
            fs.readFile('./views/post.html', function (err, data) {
                if (err) {
                    return res.end('404 not found')
                }
                res.end(data)
            })
        } else if (pathname.indexOf('/public/') === 0) {
            //公开静态资源，处理所有对静态资源的请求  
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('404 not found')
                }
                res.end(data)
            })
        } else if (pathname === '/pinglun') {
            //发表评论，这时候无论 query 内容是什么我都能处理，因为都是以 /pinglun 开头
            //此时我已经用 url 模块的 parse 方法把请求路径中的查询字符串 query 解析成了一个对象
            //用 parseObj.query 来获取到这个 query 对象
            //接下来要做的：1. 获取表单提交数据 2. 添加日期 3. 让用户重定向至首页
            var comment = parseObj.query
            comment.dateTime = sd.format(new Date(),'YYYY-MM-DD HH:mm')
            comments.unshift(comment)
            //这样我们就把一条新的 comment 加入到了 comments 数组中
            //然而此时如果重启服务器，新加入的数据会丢失，因为现在只是把数据存储在 RAM 中，没有做真正的持久化（json 文件/database）
            //接下来要做重定向，如何做？
            //  1. 状态码 302 临时重定向， 303 永久重定向
            //  2. 响应头通过 Location 告诉用户往哪重定向
            //浏览器看到状态码就会自动去响应头中找 location ，然后就会找到 / 即我们的根路径
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        } else {  
            fs.readFile('./views/404.html', function (err, data) {
                if (err) {
                    return res.end('404 page lost')
                }
                res.end(data)
            })
        }
    })

    //简写监听端口号
    .listen(3000, function () {
        console.log('Running...')
    })