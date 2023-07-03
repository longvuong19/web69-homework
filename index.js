// Yêu cầu:
/*
* Dùng method get
* Tạo một todolist const todoList = []
* Viết endpoint cho việc trả ra dữ liệu của todoList
* createAt = newDate.now()
*/

/*
- Viết API cho việc xoá todo theo id truyền qua query param
- Tìm kiếm todoName theo các ký tự truyền qua query param
- Xoá mảng todoList (làm rỗng array)
- Cập nhật 1 todo: id giữ nguyên, updateTodoName

- Xoá những phần tử todo trùng nhau về todoName
- Thực hiện phân trang dữ liệu bằng query param, truyền lên trang hiện tại đang dùng và số dữ liệu cần hiển thị trên 1 trang (vd: hiện thị bao nhiêu dòng)
    => pagination array js
 */

import express from 'express';
import crypto from 'crypto';

const app = express();
let todoList = [];

app.get('/welcome', (req, res) => {
    res.send({
        message: 'Welcome',
        array: [1, 2, 3]
    });
});

app.get('/todolist', (req, res) => {
    res.send({
        message: "Success",
        todoList: todoList,
        success: true
    });
});

// Thêm 1 todo với todoName mới qua query param.
app.get('/todolist/add', (req, res) => {
    const { todoName } = req.query;

    if (!todoName) {
        res.send({
            message: 'Fail',
            todoList: todoList,
            success: false,
        })
    } else {
        const newTodo = {
            id: crypto.randomUUID(),
            todoName: todoName,
            createAt: new Date().getTime(),
        };
        todoList.push(newTodo);
        res.send({
            message: "Success",
            todoList: todoList,
            success: true
        });
    };
});

// Xoá 1 todo theo id.
app.get('/todolist/deleteId', (req, res) => {
    const { id } = req.query;

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
            message: "Success delete ID",
            todoList: todoList,
            success: true
        });
    };
});

// Xoá hết todoList (làm rỗng mảng todoList).
app.get('/todolist/deleteAll', (req, res) => {
    todoList.length = 0;
    res.send({
        message: "Success delete all todo",
        todoList: todoList,
        success: true
    })
});

// Tìm kiếm 1 todo item theo ký tự qua query param.
app.get('/todolist/searchName', (req, res) => {
    const { searchName } = req.query;
    if (!searchName) {
        res.send({
            message: "Invalid search name",
            todoList: todoList,
            success: false
        })
    } else {
        const searchTodoList = todoList.filter(name => name.todoName.includes(searchName));
        res.send({
            message: "Search successfully",
            todoList: searchTodoList,
            success: true
        });
    };
});

// Cập nhật một todo với todoName mới.
app.get('/todolist/updateTodoName', (req, res) => {
    const { id } = req.query;
    const { todoName } = req.query;
    const todo = todoList.find(todo => todo.id === id);
    // url = /todolist/updateTodoName?id={todo.id}&todoName={todoName}
    if (!todo) {
        res.send({
            messsage: 'Failed to find id to update',
            todoList: todoList,
            success: false
        })
    } else {
        todo.todoName = todoName;
        res.send({
            message: 'Updated todo successfully',
            todoList: todoList,
            success: true
        })
    }
});

// Xoá item trùng todoName => cập nhật lại todoList.
app.get('/todolist/removeDuplicateItems', (req, res) => {
    const uniqueTodoList = [];

    todoList.forEach(todo => {
        // Kiểm tra todo item có tồn tại trong list với những todo duy nhất hay chưa.
        const isDuplicate = uniqueTodoList.some(item => item.todoName === todo.todoName);
        if (!isDuplicate) {
            uniqueTodoList.push(todo);
        }
    });
    todoList = uniqueTodoList;

    res.send({
        message: "Successfully removed duplicate items",
        todoList: todoList,
        success: true
    })
});

// Thực hiện phân trang dữ liệu bằng query param, truyền lên trang hiện tại đang dùng và số dữ liệu cần hiển thị trên 1 trang (vd: hiện thị bao nhiêu dòng)
app.get('/todolist/pageHandle', (req, res) => {
    const { pageNumber } = req.query;
    const { pageSize } = req.query;

    if (!pageSize || !pageNumber) {
        res.send({
            message: "Page Size or Page Number must be specified",
            success: false
        });
        return;
    };

    // Chuyển đổi query param thành số nguyên để fix page 0
    const currentPage = parseInt(pageNumber);
    const itemsPerPage = parseInt(pageSize);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginate = todoList.slice(start, end);

    res.send({
        message: "Success",
        currentPage: currentPage,
        pageSize: itemsPerPage,
        totalTodos: todoList.length,
        todoList: paginate,
        success: true
    });
});

app.listen(8000, () => {
    console.log('hello world');
});