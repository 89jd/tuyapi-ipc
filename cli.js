#!/usr/bin/env node
'use strict';

const ipc = require('./index.js')

const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');

/*// Formatter with support of `\n` in Help texts.
class HelpFormatter extends ArgumentParser.RawDescriptionHelpFormatter {
  // executes parent _split_lines for each line of the help, then flattens the result
  _split_lines(text, width) {
    return [].concat(...text.split('\n').map(line => super._split_lines(line, width)));
  }
}*/

const parser = new ArgumentParser({
  description: 'Tuya library for IPC',
  add_help: true,
  //formatter_class: HelpFormatter
});

parser.add_argument('--verbose', '--debug', { action: "store_true" });
parser.add_argument('-v', '--version', { action: 'version', version });

parser.add_argument('--ip', { help: 'Vacuum\'s IP' });
parser.add_argument('--device-id', { help: 'Device ID' });
parser.add_argument('--token', { help: 'Token from app' });
parser.add_argument('--dps', { help: 'DPS index' });
parser.add_argument('--request', { help: 'Request' });

parser.add_argument('--fdw', { help: 'File descriptor (write)',type: 'int' });
parser.add_argument('--fdr', { help: 'File descriptor (read)', type: 'int' });

const parsed = parser.parse_args();

const tuyaArgs = [parsed.ip, parsed.device_id, parsed.token, parsed.dps, parsed.request];
const fileDescriptorArgs = [parsed.fdw, parsed.fdr];

const isIpc = tuyaArgs.every((el)=> {return el != null;});

const tuyaArgsAreInvalid = tuyaArgs.some((el)=> {return el != null;}) 
        && tuyaArgs.some((el)=> {return el == null;})
const fileDescriptorArgsAreInvalid = fileDescriptorArgs.some((el)=> {return el != null;}) 
        && fileDescriptorArgs.some((el)=> {return el == null;})

if (tuyaArgsAreInvalid && fileDescriptorArgsAreInvalid) {
    parser.error('Needs IP, device ID, token, dps, and request or write and read file descriptors');
} else {
    if (isIpc) {
        const ip = parsed.ip;
        const id = parsed.device_id;
        const key = parsed.token;

        var completed = false;
        ipc.connectDevice({ip: ip, id: id, key: key},
        ()=>{
            if (!completed) {
                const setter = {dps: parsed.dps, value: parsed.request};
                console.log(setter);
                ipc.setDps(setter)
                completed = true;
            }
        });
        setTimeout(()=>ipc.disconnect(), 2000);
    } else {
        ipc.main(parsed.fdw, parsed.fdr, parsed.verbose);
    }
}