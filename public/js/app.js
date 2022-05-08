const socket = io('http://localhost:3000')
let index = 0;
$('#todolistForm').submit(function (e) {
    e.preventDefault();
    const task = $('#task').val();
    socket.emit('addTask', task);
    insertTask(task, index);
    index++;
    $('#task').val('').focus();
    return false;
});

socket.on('updateTask', function(todolist) {
    $('#todolist').empty();
    todolist.forEach(function(task, index) {
        insertTask(task, index);
    });
});

socket.on('addTask', function(data) {
    insertTask(data.task, data.index);
});

function insertTask(task, index) {
    $('#todolist').append('<li><a class="delete" href="#" data-index="' + index + '">✘</a> ' + task  + '</li>');
}
