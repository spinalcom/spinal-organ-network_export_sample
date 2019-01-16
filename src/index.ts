/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { spinalCore } from 'spinal-core-connectorjs_type';
import { ForgeFileItem } from 'spinal-lib-forgefile';

require('json5/lib/register');
// get the config
const config = require('../config.json5');
// import config from '../config.json5';

import { InputDataDevice } from './modules/InputDataModel/InputDataModel';
import { NetworkProcess } from './modules/NetworkProcess';

// connection string to connect to spinalhub
const connectOpt =
    `http://${config.spinalConnector.user}:${config.spinalConnector.password}@${
        config.spinalConnector.host}:${config.spinalConnector.port}/`;

// initialize the connection
const conn = spinalCore.connect(connectOpt);

// get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
// callback function.
spinalCore.load(conn, config.file.path, onLoadSuccess, onLoadError);

// called network error or file not found
function onLoadError() {
  console.log(`File does not exist in location ${config.file.path}`);
}

// called if connected to the server and if the spinalhub sent us the Model
async function onLoadSuccess(forgeFile: ForgeFileItem) {
  console.log('Connected to the server and got a the Entry Model');

  const networkProcess = new NetworkProcess();
  await networkProcess.init(forgeFile, config.organ);

  const data: InputDataDevice[] = await networkProcess.getData();

  console.log('Got the all data stating to write in file.');
  await networkProcess.exportToJSONFile(config.organ.output, data, false);
  console.log(`File wrote in ${config.organ.output}, Exiting...`);
  process.exit(0);
}
