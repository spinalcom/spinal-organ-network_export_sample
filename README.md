<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# spinal-organ-network_export_sample

Sample organ to demonstrate how to use the `spinal-model-bmsnetwork` to retrive data from the Graph context network and export it to an JSON file.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [configuration](#configuration)
- [API](#api)
  - [Interface](#interface)
    - [ConfigOrgan](#configorgan)
  - [Classes](#classes)
  - [InputDataDevice](#inputdatadevice)
    - [InputDataDevice.InputDataDevice](#inputdatadeviceinputdatadevice)
      - [new InputDataDevice([name], [type], [id], [path])](#new-inputdatadevicename-type-id-path)
  - [InputDataEndpoint](#inputdataendpoint)
    - [InputDataEndpoint.InputDataEndpoint](#inputdataendpointinputdataendpoint)
      - [new InputDataEndpoint([name], [currentValue], [unit], [dataType], [type], [id], [path])](#new-inputdataendpointname-currentvalue-unit-datatype-type-id-path)
  - [InputDataEndpointGroup](#inputdataendpointgroup)
    - [InputDataEndpointGroup.InputDataEndpointGroup](#inputdataendpointgroupinputdataendpointgroup)
      - [new InputDataEndpointGroup([name], [type], [id], [path])](#new-inputdataendpointgroupname-type-id-path)
  - [NetworkProcess](#networkprocess)
    - [networkProcess.init(forgeFile, configOrgan) ⇒ <code>Promise.&lt;void&gt;</code>](#networkprocessinitforgefile-configorgan-%E2%87%92-codepromiseltvoidgtcode)
    - [networkProcess.getDevice(idDevice) ⇒ <code>Promise.&lt;InputDataDevice&gt;</code>](#networkprocessgetdeviceiddevice-%E2%87%92-codepromiseltinputdatadevicegtcode)
    - [networkProcess.getEndpoint(idEndpoint) ⇒ <code>Promise.&lt;InputDataEndpoint&gt;</code>](#networkprocessgetendpointidendpoint-%E2%87%92-codepromiseltinputdataendpointgtcode)
    - [networkProcess.getData() ⇒ <code>Promise.&lt;Array.&lt;InputDataDevice&gt;&gt;</code>](#networkprocessgetdata-%E2%87%92-codepromiseltarrayltinputdatadevicegtgtcode)
    - [networkProcess.exportToJSONFile(filename, obj, [minified]) ⇒ <code>Promise.&lt;void&gt;</code>](#networkprocessexporttojsonfilefilename-obj-minified-%E2%87%92-codepromiseltvoidgtcode)
    - [NetworkProcess.NetworkProcess](#networkprocessnetworkprocess)
      - [new NetworkProcess(inputData)](#new-networkprocessinputdata)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

This organ connect to the hub then search for the network.
Once the network found it will start to get all de Devices (even the one nested).
For each Device get their endpoint and data from yesterday (midnight to midnight J-1).
Then finally write in a file the result.

The data in the `Graph Manager` will be as the following
- Graph
  - Network
    - NetworkVirtual
      - Device 1
        - Device 1 child_1 - device
          - Device 1 child_1_1 - groupendpoint
            - Device 1 child_1_1_1 - endpoint
        - Device 1 child_2 - groupendpoint
          - Device 1 child_2_1 - endpoint
        - Device 1 child_3 - endpoint
      - ...


# configuration
Edit the file `config.json5` so the organ can connect to the server the be able to get the forgefile with it `path`.

The organ will search for `organ.contextName` and `organ.networkType`.

```js
{
  spinalConnector: {
    user: 168, // user id - process.env.SPINAL_USER_ID
    password: "JHGgcz45JKilmzknzelf65ddDadggftIO98P", // user password - process.env.SPINAL_USER_ID 
    host: "localhost", // can be an ip address - process.env.SPINALHUB_IP
    port: 7777 // port - process.env.SPINALHUB_PORT
  },
  file: {
    // path to a digital twin in spinalhub filesystem || process.env.SPINAL_DTWIN_PATH
    path: '/__users__/admin/deiv4' 
  },
  organ: {
    contextName: "Network",
    contextType: "Network",
    networkType: "NetworkVirtual",
  }
}
```

# API

## Interface

<a name="ConfigOrgan"></a>

### ConfigOrgan
**Kind**: interface

| Param | Type | Value | Comment |
| --- | --- | --- | --- |
| contextName | <code>string</code> | | 
| contextType | <code>string</code> | | 
| networkType | <code>string</code> | | 


## Classes

<dl>
<dt><a href="#InputDataDevice">InputDataDevice</a></dt>
<dd></dd>
<dt><a href="#InputDataEndpoint">InputDataEndpoint</a></dt>
<dd></dd>
<dt><a href="#InputDataEndpointGroup">InputDataEndpointGroup</a></dt>
<dd></dd>
<dt><a href="#NetworkProcess">NetworkProcess</a></dt>
<dd></dd>
</dl>

<a name="InputDataDevice"></a>

## InputDataDevice
**Kind**: global class  
**Implements**: <code>idDevice</code>  
**Export**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> |  |
| name | <code>string</code> |  |
| type | <code>string</code> |  |
| path | <code>string</code> |  |
| children | <code>Array.&lt;(InputDataDevice\|InputDataEndpoint\|InputDataEndpointGroup)&gt;</code> |  |
| nodeTypeName | <code>string</code> | <p>equals SpinalBmsDevice.nodeTypeName</p> |


* [InputDataDevice](#InputDataDevice)
    * [.InputDataDevice](#InputDataDevice.InputDataDevice)
        * [new InputDataDevice([name], [type], [id], [path])](#new_InputDataDevice.InputDataDevice_new)

<a name="InputDataDevice.InputDataDevice"></a>

### InputDataDevice.InputDataDevice
**Kind**: static class of [<code>InputDataDevice</code>](#InputDataDevice)  
<a name="new_InputDataDevice.InputDataDevice_new"></a>

#### new InputDataDevice([name], [type], [id], [path])
<p>Creates an instance of InputDataDevice.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;default device name&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;default device type&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;InputDataDevice&#x27;)&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;default device path&#x27;&quot;</code> | 

<a name="InputDataEndpoint"></a>

## InputDataEndpoint
**Kind**: global class  
**Implements**: <code>idEndpoint</code>  
**Export**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> |  |
| name | <code>string</code> |  |
| path | <code>string</code> |  |
| currentValue | <code>number</code> \| <code>string</code> |  |
| unit | <code>string</code> |  |
| dataType | <code>InputDataEndpointDataType</code> |  |
| type | <code>InputDataEndpointType</code> |  |
| nodeTypeName | <code>string</code> | <p>equal SpinalBmsEndpoint.nodeTypeName</p> |
| timeseries | <code>Array.&lt;any&gt;</code> |  |


* [InputDataEndpoint](#InputDataEndpoint)
    * [.InputDataEndpoint](#InputDataEndpoint.InputDataEndpoint)
        * [new InputDataEndpoint([name], [currentValue], [unit], [dataType], [type], [id], [path])](#new_InputDataEndpoint.InputDataEndpoint_new)

<a name="InputDataEndpoint.InputDataEndpoint"></a>

### InputDataEndpoint.InputDataEndpoint
**Kind**: static class of [<code>InputDataEndpoint</code>](#InputDataEndpoint)  
<a name="new_InputDataEndpoint.InputDataEndpoint_new"></a>

#### new InputDataEndpoint([name], [currentValue], [unit], [dataType], [type], [id], [path])
<p>Creates an instance of InputDataEndpoint.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;default endpoint name&#x27;&quot;</code> | 
| [currentValue] | <code>number</code> \| <code>string</code> | <code>0</code> | 
| [unit] | <code>string</code> | <code>&quot;&#x27;unit&#x27;&quot;</code> | 
| [dataType] | <code>InputDataEndpointDataType</code> | <code>InputDataEndpointDataType.Integer</code> | 
| [type] | <code>InputDataEndpointType</code> | <code>InputDataEndpointType.Other</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;InputDataEndpoint&#x27;)&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;default endpoint path&#x27;&quot;</code> | 

<a name="InputDataEndpointGroup"></a>

## InputDataEndpointGroup
**Kind**: global class  
**Implements**: <code>idEndpointGroup</code>  
**Export**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> |  |
| name | <code>string</code> |  |
| type | <code>string</code> |  |
| path | <code>string</code> |  |
| children | [<code>Array.&lt;InputDataEndpoint&gt;</code>](#InputDataEndpoint) |  |
| nodeTypeName | <code>string</code> | <p>equals SpinalBmsEndpointGroup.nodeTypeName</p> |


* [InputDataEndpointGroup](#InputDataEndpointGroup)
    * [.InputDataEndpointGroup](#InputDataEndpointGroup.InputDataEndpointGroup)
        * [new InputDataEndpointGroup([name], [type], [id], [path])](#new_InputDataEndpointGroup.InputDataEndpointGroup_new)

<a name="InputDataEndpointGroup.InputDataEndpointGroup"></a>

### InputDataEndpointGroup.InputDataEndpointGroup
**Kind**: static class of [<code>InputDataEndpointGroup</code>](#InputDataEndpointGroup)  
<a name="new_InputDataEndpointGroup.InputDataEndpointGroup_new"></a>

#### new InputDataEndpointGroup([name], [type], [id], [path])
<p>Creates an instance of InputDataEndpointGroup.</p>


| Param | Type | Default |
| --- | --- | --- |
| [name] | <code>string</code> | <code>&quot;&#x27;default EndpointGroup name&#x27;&quot;</code> | 
| [type] | <code>string</code> | <code>&quot;&#x27;default EndpointGroup type&#x27;&quot;</code> | 
| [id] | <code>string</code> | <code>&quot;genUID(&#x27;InputDataEndpointGroup&#x27;)&quot;</code> | 
| [path] | <code>string</code> | <code>&quot;&#x27;default EndpointGroup path&#x27;&quot;</code> | 

<a name="NetworkProcess"></a>

## NetworkProcess
**Kind**: global class  
**Export**:   

* [NetworkProcess](#NetworkProcess)
    * _instance_
        * [.init(forgeFile, configOrgan)](#NetworkProcess+init) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.getDevice(idDevice)](#NetworkProcess+getDevice) ⇒ [<code>Promise.&lt;InputDataDevice&gt;</code>](#InputDataDevice)
        * [.getEndpoint(idEndpoint)](#NetworkProcess+getEndpoint) ⇒ [<code>Promise.&lt;InputDataEndpoint&gt;</code>](#InputDataEndpoint)
        * [.getData()](#NetworkProcess+getData) ⇒ <code>Promise.&lt;Array.&lt;InputDataDevice&gt;&gt;</code>
        * [.exportToJSONFile(filename, obj, [minified])](#NetworkProcess+exportToJSONFile) ⇒ <code>Promise.&lt;void&gt;</code>
    * _static_
        * [.NetworkProcess](#NetworkProcess.NetworkProcess)
            * [new NetworkProcess(inputData)](#new_NetworkProcess.NetworkProcess_new)

<a name="NetworkProcess+init"></a>

### networkProcess.init(forgeFile, configOrgan) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: instance method of [<code>NetworkProcess</code>](#NetworkProcess)  

| Param | Type |
| --- | --- |
| forgeFile | <code>ForgeFileItem</code> | 
| configOrgan | <code>ConfigOrgan</code> | 

<a name="NetworkProcess+getDevice"></a>

### networkProcess.getDevice(idDevice) ⇒ [<code>Promise.&lt;InputDataDevice&gt;</code>](#InputDataDevice)
**Kind**: instance method of [<code>NetworkProcess</code>](#NetworkProcess)  

| Param | Type |
| --- | --- |
| idDevice | <code>string</code> | 

<a name="NetworkProcess+getEndpoint"></a>

### networkProcess.getEndpoint(idEndpoint) ⇒ [<code>Promise.&lt;InputDataEndpoint&gt;</code>](#InputDataEndpoint)
**Kind**: instance method of [<code>NetworkProcess</code>](#NetworkProcess)  

| Param | Type |
| --- | --- |
| idEndpoint | <code>string</code> | 

<a name="NetworkProcess+getData"></a>

### networkProcess.getData() ⇒ <code>Promise.&lt;Array.&lt;InputDataDevice&gt;&gt;</code>
**Kind**: instance method of [<code>NetworkProcess</code>](#NetworkProcess)  
<a name="NetworkProcess+exportToJSONFile"></a>

### networkProcess.exportToJSONFile(filename, obj, [minified]) ⇒ <code>Promise.&lt;void&gt;</code>
**Kind**: instance method of [<code>NetworkProcess</code>](#NetworkProcess)  

| Param | Type | Default |
| --- | --- | --- |
| filename | <code>string</code> |  | 
| obj | [<code>Array.&lt;InputDataDevice&gt;</code>](#InputDataDevice) |  | 
| [minified] | <code>boolean</code> | <code>true</code> | 

<a name="NetworkProcess.NetworkProcess"></a>

### NetworkProcess.NetworkProcess
**Kind**: static class of [<code>NetworkProcess</code>](#NetworkProcess)  
<a name="new_NetworkProcess.NetworkProcess_new"></a>

#### new NetworkProcess(inputData)
<p>Creates an instance of NetworkProcess.</p>


| Param | Type |
| --- | --- |
| inputData | <code>InputData</code> | 

