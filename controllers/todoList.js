import { todoList } from "../index.js";

const todoListController = {
    getAll: (req, res) => {
        res.send({
            message: 'Success',
            data: todoList,
            success: true
        })
    },
    getOneById: (req, res) => {
        let { id } = req.params;
        const crrTodo = todoList.find(todo => todo.id === id);
        res.send({
            message: 'Success',
            data: crrTodo,
            success: true
        });
    },
    createNewTodo: (req, res) => {
        const { todoName, date } = req.body;
        const newTodo = {
            id: crypto.randomUUID(),
            todoName,
            date
        };
        todoList.push(newTodo);
        res.send({
            message: 'Success',
            data: todoList,
            success: true
        });
    },
    deleteEverything: (req, res) => {
        todoList.length = 0;

        res.send({
            message: "Successfully delete everything",
            todoList: todoList,
            success: true
        })
    },
    updateTodo: (req, res) => {
        const { id } = req.params;
        const { todoName } = req.body;
        const todo = todoList.find(todo => todo.id === id);

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
    },
    deleteBySplice: (req, res) => {
        const { id } = req.params;
        const index = todoList.findIndex(todo => todo.id === id);

        if (index !== -1) {
            todoList.splice(index, 1);
            res.send({
                message: "Successfully delete item",
                todoList: todoList,
                success: true
            });
        } else {
            res.send({
                message: "Failed to find item",
                todoList: todoList,
                success: false
            });
        }
    }
};

export default todoListController;