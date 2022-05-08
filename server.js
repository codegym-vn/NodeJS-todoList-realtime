const { createServer } = require("http");
const fs = require('fs');
const { Server } = require("socket.io");

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css"
};

const httpServer = createServer(function (req, res){
    if (req.url === '/') {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream('./templates/index.html').pipe(res)
    }
    /* đọc file css/js */
    const filesDefences = req.url.match(/\.js|.css/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + "/"+ req.url).pipe(res)
    }
});

const io = new Server(httpServer);
const todoList = [];
let index = 0;

/* Quản lý dữ liệu webscoket */
io.on('connection', socket => {

    socket.emit('updateTask', todoList);
    /* Lắng nghe sự kiện addTask từ phái client */
    socket.on('addTask', task => {
        todoList.push(task)
        /* Gửi sự kiện addTask cho tất cả người dùng real-time */
        socket.broadcast.emit('addTask', {task: task, index: index})
        index++;
    })
})

httpServer.listen(3000, 'localhost', function (){
    console.log('Server running in http://localhost:3000')
})
