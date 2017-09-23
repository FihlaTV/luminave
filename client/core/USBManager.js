"use strict";

/**
 * Manage USB ports.
 */
export default class USBManager {
  constructor(param) {

    this.config = param.config;

    this.port = null;

    // List of MIDI controller
    this.list = new Map();


    this.port.connect().then(() => {

      this.port.onReceive = data => {
        let textDecoder = new TextDecoder();
        console.log(textDecoder.decode(data));
      };

      this.port.onReceiveError = error => {
        console.error(error);
      };

    }, error => {
      console.error(error);
    });
  }

  update(values) {
    let data = new Uint8Array(512);
    data.fill(0);

    window.port.send(data);

    console.log(data);
  }



  /*
   * Register all MIDI controller
   */
  register() {

    // this.config.devices.midi.forEach((element, index, array) => {
    //
    //   let midiController = new MidiController(Object.assign({}, element));
    //
    //   this.list.set(element.controllerId, midiController);
    //
    //   console.log('MidiManager', '-', 'Added', element.controllerId);
    // });
  }
}