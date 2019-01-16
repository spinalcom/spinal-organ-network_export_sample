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

import { ForgeFileItem } from 'spinal-lib-forgefile';
import { NetworkService, SpinalTimeSeries } from 'spinal-model-bmsnetwork';
import {
  InputDataDevice, InputDataEndpoint,
} from './InputDataModel/InputDataModel';

import { ConfigOrgan } from '../Utils/ConfigOrgan';
import * as Q from 'q';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

import * as fs from 'fs';
/**
 * @export
 * @class NetworkProcess
 */
export class NetworkProcess {
  private nwService : NetworkService;
  private ready: Q.Deferred<{}>;
  contextId: string;
  networkId: string;

  /**
   *Creates an instance of NetworkProcess.
   * @param {InputData} inputData
   * @memberof NetworkProcess
   */
  constructor() {
    this.nwService = new NetworkService();
    this.ready = Q.defer();
    this.contextId = '';
    this.networkId = '';

  }

  /**
   * @param {ForgeFileItem} forgeFile
   * @param {ConfigOrgan} configOrgan
   * @returns {Promise<void>}
   * @memberof NetworkProcess
   */
  public async init(forgeFile: ForgeFileItem, configOrgan : ConfigOrgan)
  : Promise<void> {
    const data = await this.nwService.init(forgeFile, configOrgan, false);
    this.contextId = data.contextId;
    this.networkId = data.networkId;
    this.ready.resolve();
  }

  /**
   * @param {string} idDevice
   * @returns {Promise<InputDataDevice>}
   * @memberof NetworkProcess
   */
  async getDevice(idDevice: string): Promise<InputDataDevice> {
    const n = SpinalGraphService.getRealNode(idDevice);
    const hasChildren = n.children._attribute_names.length > 0;

    const prom: any[] = [];
    prom.push(this.nwService.getData(idDevice));
    if (hasChildren) prom.push(this.nwService.getEndpoint(idDevice));
    const res = await Promise.all(prom);
    const de = res[0];
    const inputDevice = new InputDataDevice(de.name.get(),
                                            de.type.get(),
                                            de.id.get(),
                                            de.path.get());
    if (hasChildren) {
      const endpointsId = res[1];
      const promEndpoint: Promise<InputDataEndpoint>[] = [];
      for (const endpointId of endpointsId) {
        promEndpoint.push(this.getEndpoint(endpointId));
      }
      const endpointsData: InputDataEndpoint[] = await Promise.all(promEndpoint);
      inputDevice.children.push(...endpointsData);
    }
    return inputDevice;
  }
  /**
   * @param {string} idEndpoint
   * @returns {Promise<InputDataEndpoint>}
   * @memberof NetworkProcess
   */
  async getEndpoint(idEndpoint: string): Promise<InputDataEndpoint> {
    const prom: any[] = [];
    prom.push(this.nwService.getData(idEndpoint));
    prom.push(this.nwService.getTimeseries(idEndpoint));

    const res = await Promise.all(prom);
    const ee = res[0];
    // console.log(ee.get());
    const inputEndpoint = new InputDataEndpoint(ee.name.get(), ee.currentValue.get(),
                                                ee.unit.get(), ee.dataType.get(),
                                                ee.type.get(), ee.id.get());
    const timeseries = await (<SpinalTimeSeries>res[1]).getDataFromYesterday();
    for await (const data of timeseries) {
      inputEndpoint.timeseries.push(data);
    }
    return inputEndpoint;
  }

  /**
   * @returns {Promise<InputDataDevice[]>}
   * @memberof NetworkProcess
   */
  async getData(): Promise<InputDataDevice[]> {
    await this.ready.promise;
    const devices = await this.nwService.getDevices(this.networkId);
    const promises: Promise<InputDataDevice>[] = [];
    for (const device of devices) {
      promises.push(this.getDevice(device));
    }
    return Promise.all(promises);
  }

  /**
   * @param {string} filename
   * @param {InputDataDevice[]} obj
   * @param {boolean} [minified=true]
   * @returns {Promise<void>}
   * @memberof NetworkProcess
   */
  exportToJSONFile(filename: string, obj: InputDataDevice[], minified: boolean = true)
    : Promise<void> {
    return new Promise((resolve) => {
      const data = minified === true ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
      // console.log(data);
      const stream = fs.createWriteStream(filename);
      stream.write(data, (error) => {
        if (error) console.error(error);
        stream.close();
        resolve();
      });
    });
  }
}
