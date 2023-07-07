import express from 'express';
import crypto from 'crypto';
import todoListController from './controllers/todoList.js';

const app = express();
app.use(express.json());

export let todoList = [
    {
        id: crypto.randomUUID(),
        todoName: 'todo 1',
        date: new Date()
    },
    {
        id: crypto.randomUUID(),
        todoName: 'todo 2',
        date: new Date()
    },
    {
        id: crypto.randomUUID(),
        todoName: 'todo 3',
        date: new Date()
    },
    {
        id: crypto.randomUUID(),
        todoName: 'todo 4',
        date: new Date()
    },
];

app.get('/api/todos/:id', todoListController.getOneById);

app.get('/api/todos', todoListController.getAll);

// POST Method
app.post('/api/todos', todoListController.createNewTodo);

app.get('', (req, res) => {
    res.send({
        message: "Connect successfully",
        satisfies: true
    })
});

// Xoá một todo theo id qua param
app.delete('/api/todos/delete/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.send({
            message: "Can't delete blank ID",
            todoList: todoList,
            success: false
        })
    } else {
        const newTodoList = todoList.filter(todo => todo.id !== id);
        if (newTodoList.length === todoList.length) {
            res.send({
                message: "Failed to find ID",
                todoList: todoList,
                success: false
            });
        };
        todoList = newTodoList;
        res.send({
            message: "Successfully delete ID",
            todoList: todoList,
            success: true
        });
    };
});

// Xoá 1 todo theo id qua params với method splice
app.delete('/api/todos/altenate-delete/:id', todoListController.deleteBySplice);

// Xoá hết todoList
app.delete('/api/todos', todoListController.deleteEverything);

// Cập nhật một todo với todoName mới
app.put('/api/todos/update/:id', todoListController.updateTodo);

app.listen(5500, () => {
    console.log("Server is running");
});