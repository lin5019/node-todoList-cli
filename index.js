const db = require("./db");
const inquirer = require('inquirer')
//node cli.js add go here go there

const newTask=(inquirer,taskList,message="",done=false)=>{
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: message,
    }).then(answers => {
        taskList.push({
            title: answers.title,
            done: done
        })
        db.write(taskList)
    })
}
const editTask=(inquirer,taskList,index)=>{
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "请输入需要求改的名字",
    }).then(answers => {
        taskList[index].title=answers.title
        db.write(taskList)
    })
}



const getTaskList = (taskList) => {
   return  taskList.map((task, index) => {
        return {
            name: `${task.done ? '[x]' : '[_]'}  ${index + 1}. ${task.title}`,
            //value值必须是String类型,
            value: index.toString()
        }
    })
}

const inTaskMemu = (inquirer, taskList, index) => {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '选择操作 (Use arrow keys)',
            choices: [
                {name: '退出', value: '-1'},
                {name: '已完成', value: '0'},
                {name: '未完成', value: '1'},
                {name: '改标题', value: '2'},
                {name: '删除', value: '3'},
            ]
        })
        .then((answers2) => {
            //console.log(taskList)
            switch (answers2.index) {
                case '0':
                    taskList[index].done = true
                    db.write(taskList)
                    break;
                case '1':
                    taskList[index].done = false
                    db.write(taskList)
                    break;
                case '2':
                    editTask(inquirer,taskList,index)
                    break;
                case '3':
                    taskList.splice(index, 1)
                    db.write(taskList)
                    break;
            }

        })
        .catch(error => {
            console.log(error)
        })
}

const todoList=(inquirer,taskList,showList)=>{
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{name: '退出', value: '-1'}, ...showList, {name: '+创建任务', value: '-2'}]
        })
        .then((answers) => {
            //获得当前任务的下标
            const index = parseInt(answers.index)

            if (index === -2) {
                newTask(inquirer,taskList,"请输入需要添加的任务名称")
            }
            if (index >= 0) {
                inTaskMemu(inquirer, taskList, index)
            }
        }).catch(error => {
        console.log(error)
    });
}

module.exports.showAll = async () => {
    //读取之前的任务
    const taskList = await db.read()
    //获得任务队列
    const showList = getTaskList(taskList)
    //todoList
    todoList(inquirer,taskList,showList)
    //return 'showAll 被执行'
}

module.exports.add = async (title) => {
    //获取之前的任务
    const list = await db.read()
    //往里面添加一个title任务
    list.push({title, done: false})
    //存储任务到文件
    await db.write(list)
}
module.exports.clear = async () => {
    await db.write([])
}