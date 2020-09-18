#!/usr/bin/env node

const ipc = require('./index.js')

if (process.argv.length == 4) {
    ipc.main();
} else {
    writeStream = process.stdout;
    var completed = false;
    ipc.connectDevice({ip: process.argv[2], id: process.argv[3], key: process.argv[4]},
    ()=>{
        if (!completed) {
        const setter = {dps: process.argv[5], value: process.argv[6]};
        console.log(setter);
        ipc.setDps({dps: process.argv[5], value: process.argv[6]})
        completed = true;
        }
    });
    setTimeout(()=>ipc.disconnect(), 2000);
}