const fs = require("fs");
const path = require("path");
//获得家目录(用户目录)
const homedir = require('os').homedir()
//获得当前环境变量中的HOME值
const home = process.env.HOME || homedir;
const default_db_path = path.join(home, '.todo');

const db = {
    read(path=default_db_path) {
        return new Promise((resolve, reject)=>{
            fs.readFile(
                path,
                {flag: 'a+'},
                (error, data) => {
                    if (error) {
                        reject(error)
                    }
                    let list
                    try {
                        list = JSON.parse(data.toString())
                    } catch (e) {
                        list = []
                    }
                    resolve(list)
                })
        })
    },
    write(list,path=default_db_path) {
        fs.writeFile(path, JSON.stringify(list), (error) => {
            return new Promise((resolve, reject)=>{
                if (error) {
                    reject(error)
                }
                resolve();
            })
        })
    },



}

module.exports = db