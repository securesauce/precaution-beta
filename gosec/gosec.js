// Copyright 2018 VMware, Inc.
// SPDX-License-Identifier: BSD-2-Clause

const { spawn } = require('child_process')
const parse = require('../parse_output.js')

/**
 * Spawn a gosec process analyzing all the files in a given directory.
 * In the end deletes the goScanResults file
 * Results are saved to goScanResults.json
 * @param {string} workingDirectory Input directory where files for analyze are
 * @returns {Promise} goScanResults json
 */
module.exports = (workingDirectory) => {
    if (!workingDirectory) {
       return null
    }
    // When I use "/..." as suffix I call gosec recursively in any existing subfolder of current working Director
    // It will use gosec for analyze  recursively the same way until it can 
    workingDirectory += "/..."

    /**
     * @argument gosec : command which the child process will execute
     * @argument -fmt : output format of the command
     * @argument out : output file for results
     * @argument workingDirectory : Directory containing files for which the command will be executed
    */
    let gosecProcess = spawn('gosec', ['-fmt=json', '-out=goScanResults.json', workingDirectory],  
    {
        shell : true,
        stdio : 'inherit'
    })
        //{ cwd: workingDirectory, shell : true })

    return new Promise((resolve, reject) => {
        gosecProcess
            .on('error', reject)
            .on('close', () => {
                parse.readFile('goScanResults.json',resolve, reject)   
             })
    })
}
