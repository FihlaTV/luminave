import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-tabs/paper-tab.js'
import '/node_modules/@polymer/paper-tabs/paper-tabs.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'

import ReduxMixin from '../../reduxStore.js'
import '../universe-manager/index.js'
import '../fixture-manager/index.js'
import '../scene-manager/index.js'
import '../animation-manager/index.js'
import '../midi-manager/index.js'
import '../timeline-manager/index.js'
import '../ui-spacer/index.js'

import '../luminave-status/index.js'


class LuminaveDashboard extends ReduxMixin(PolymerElement) {
  static get properties() {
    return {
      bpm: {
        type: Number,
        statePath: 'bpm'
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

  static get template() {
    return `
      <style>
          paper-tabs {
            display: inline-block;
            background-color: var(--dark-primary-color);
            color: var(--paper-toolbar-color);
            font-size: 1em;
          }
      </style>

      <luminave-status></luminave-status>

      <timeline-manager></timeline-manager>

      <ui-spacer></ui-spacer>

      <template is="dom-if" if="[[live]]">
        <div>
          <paper-tabs selected="{{selected}}">
            <paper-tab>Universes</paper-tab>
            <paper-tab>MIDI Controller</paper-tab>
          </paper-tabs>

          <iron-pages selected="{{selected}}">
            <div>
              <ui-spacer></ui-spacer>
              <universe-manager universes={{universeManager}}></universe-manager>
            </div>
            <div>
              <ui-spacer></ui-spacer>
              <midi-manager controllers="{{midiManager}}"></midi-manager>
            </div>
          </iron-pages>
        </div>
      </template>



      <template is="dom-if" if="[[editMode]]">

        <div>
          <paper-tabs selected="{{selected}}">
            <paper-tab>Universes</paper-tab>
            <paper-tab>MIDI Controller</paper-tab>
            <paper-tab>Scenes</paper-tab>
            <paper-tab>Animations</paper-tab>
            <paper-tab>Fixtures</paper-tab>
          </paper-tabs>

          <iron-pages selected="{{selected}}">
            <div>
              <ui-spacer></ui-spacer>
              <universe-manager universes={{universeManager}}></universe-manager>
            </div>
            <div>
              <ui-spacer></ui-spacer>
              <midi-manager controllers="{{midiManager}}"></midi-manager>
            </div>
            <div>
              <ui-spacer></ui-spacer>
              <scene-manager scenes={{sceneManager}}></scene-manager>
            </div>
            <div>
              <ui-spacer></ui-spacer>
              <animation-manager animations="{{animationManager}}"></animation-manager>
            </div>
            <div>
              <ui-spacer></ui-spacer>
              <fixture-manager fixtures={{fixtureManager}}></fixture-manager>
            </div>
          </iron-pages>
        </div>

      </template>
    `
  }
}

customElements.define('luminave-dashboard', LuminaveDashboard)
