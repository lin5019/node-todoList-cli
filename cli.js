#!/usr/bin/env node
const api = require("./index");
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');

program
    .option('-x, --xxx', 'hello,I am x!')
program
    .command('add')
    .description('add a task')
    .action((...args)=>{
        const title=args.slice(0,args.length-1).join(' ')
        api.add(title)
            .then(()=>console.log('add success!'))
            .catch(e=>console.log(e))
    })
program
    .command('clear')
    .description('clear all tasks')
    .action(()=>{
        api.clear()
            .then(()=>console.log('清理成功!'))
            .catch(()=>console.log('清理失败!'))
    })

program.parse(process.argv);

if(process.argv.length===2){
    void api.showAll()
}
//console.log('cli.js 被执行了!');
