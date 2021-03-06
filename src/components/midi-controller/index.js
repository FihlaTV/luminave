import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import ReduxMixin from '../../reduxStore.js'
import WebMidi from '../../../libs/webmidi/index.js'
import '../midi-grid/index.js'
import { learnMidi, addMidiMapping, addSceneToTimeline, removeSceneFromTimelineAndResetFixtures, setMidiMappingActive } from '../../actions/index.js'

/*
 * Handle MIDI controller
 */
class MidiController extends ReduxMixin(PolymerElement) {

  constructor() {
    super()

    this.connected = false

    this.input = null
    this.output = null
  }

  ready() {
    super.ready()

    // Initialize mapping
    if (this.mapping.length === 0) {
      const elements = this.width * this.height

      for (let i = 0; i < elements; i++) {
        this.dispatch(addMidiMapping(this.index, i, {
          scenes: [],
          note: -1,
          label: '',
          type: '',
          active: false,
          value: 0
        }))
      }
    }
  }

  static get properties() {
    return {
      name: String,
      id: String,
      index: Number,
      inputname: String,
      outputname: String,
      width: Number,
      height: Number,
      connected: Boolean,
      mapping: Array,
      midiLearning: {
        type: Number,
        statePath: 'midiManager.learning'
      },
      midiEnabled: {
        type: Boolean,
        statePath: 'midiManager.enabled',
        observer: 'midiEnabledChanged'
      },
      live: {
        type: Boolean,
        statePath: 'live'
      },
      editMode: {
        type: Boolean,
        computed: 'computeEditMode(live)'
      }
    }
  }

  computeEditMode(live) {
    return !live
  }

  midiEnabledChanged() {
    if (this.midiEnabled) {

      // MIDI input / output ports (from a single device) are connected to the computer
      WebMidi.addListener('connected', e => {

        const { port } = e
        const { name, type } = port

        // The connected event is triggered twice for input, that's why we need to check
        // if this.input is already defined or not, @see https://github.com/NERDDISCO/luminave/issues/14
        if (name === this.inputname && type === 'input' && this.input === null) {
          this.input = port

          // Listen to "noteon" events
          this.input.addListener('noteon', 'all', this.noteon.bind(this))

          // Listen to "controlchange" events
          this.input.addListener('controlchange', 'all', this.controlchange.bind(this))

        } else if (name === this.outputname && type === 'output') {
          this.output = port
        }

        this.connected = true
      })

      // MIDI input / output ports (from a single device) are disconnected to the computer
      WebMidi.addListener('disconnected', e => {
        const { name, type } = e.port

        if (name === this.inputname && type === 'input') {
          this.input = null
        } else if (name === this.outputname && type === 'output') {
          this.output = null
        }

        this.connected = false
      })

    }
  }

  /*
   * Handle "noteon" events
   */
  noteon(event) {
    const { data } = event
    const [channel, note, velocity] = data

    // Learning is active
    if (this.midiLearning > -1) {

      const mapping = { note }
      this.dispatch(addMidiMapping(this.index, this.midiLearning, mapping))

      // Disable learning
      this.dispatch(learnMidi(-1))

    // Handle mappped input
    } else {

      const mappingIndex = this.mapping.findIndex(element => element.note === note)

      // Found a mapping
      if (mappingIndex > -1) {

        // Get the element
        const element = this.mapping[mappingIndex]

        // Change the active status of the element (pressed vs not pressed)
        element.active = !element.active

        // Set active state of element
        this.dispatch(setMidiMappingActive(this.index, mappingIndex, element.active))

        if (element.active) {
          // Add all scenes to the timeline
          element.scenes.map(sceneId => this.dispatch(addSceneToTimeline(sceneId)))

          // Button light: on
          this.output.send(144, [note, 127])
        } else {
          // Remove all scenes from the timeline
          element.scenes.map(sceneId => this.dispatch(removeSceneFromTimelineAndResetFixtures(sceneId)))

          // Button light: off
          this.output.send(144, [note, 0])
        }
      }

    }
  }

  controlchange(event) {
    const { data } = event
    const [, note, velocity] = data

    // Learning is active
    if (this.midiLearning > -1) {

      const mapping = { note }
      this.dispatch(addMidiMapping(this.index, this.midiLearning, mapping))

      // Disable learning
      this.dispatch(learnMidi(-1))

    // Handle mappped input
    } else {
      const mappingIndex = this.mapping.findIndex(element => element.note === note)

      // Found a mapping
      if (mappingIndex > -1) {
        // this.mapping[mappingIndex].value = velocity

        // @TODO Move this into utils and load from there
        // const value = velocity
        // const mapping = { value }
        // this.dispatch(addMidiMapping(this.index, mappingIndex, mapping))
      }
    }
  }

  static get template() {
    return `
      <style>
        h3 {
          margin-top: 0;
        }
      </style>

      <div>
        <h3>[[name]] ([[connected]])</h3>

        <template is="dom-if" if="[[editMode]]">
          <ul>
            <li>input: [[inputname]]</li>
            <li>output: [[outputname]]</li>
          </ul>
        </template>

        <midi-grid
          width="[[width]]"
          height="[[height]]"
          mapping$="[[mapping]]"
          controllerindex="[[index]]"></midi-grid>

      </div>
    `
  }
}

customElements.define('midi-controller', MidiController)
