import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { DomRepeat } from '/node_modules/@polymer/polymer/lib/elements/dom-repeat.js'
import '../fixture-list-item/index.js'

/*
 * A list of fixtures
 */
class FixtureList extends PolymerElement {
  static get properties() {
    return {
      fixtures: Array,
      fixtureManager: Array
    }
  }

  handleFixtureSubmit(e) {
    this.dispatchEvent(new CustomEvent('add-fixture', {
      detail: {
        event: e,
        fixtureId: this.fixtureId
      }
    }))
  }

  handleSelectedFixture(e) {
    this.fixtureId = e.target.selectedOptions[0].value
  }

  handleRemoveFixture(e) {
    this.dispatchEvent(new CustomEvent('remove-fixture', {
      detail: {
        event: e,
        fixtureIndex: e.target.fixtureIndex
      }
    }))
  }

  getFixture(fixtureId) {
    return this.fixtureManager.filter(fixture => fixture.id === fixtureId)[0]
  }

  static get template() {
    return `
      <form on-submit="handleFixtureSubmit">
        <select name="type" on-change="handleSelectedFixture" required>
          <option value=""></option>

          <template is="dom-repeat" items="{{fixtureManager}}" as="fixture">
            <option value="[[fixture.id]]">[[fixture.name]]</option>
          </template>
        </select>

        <button type="submit">Add fixture</button>
      </form>

      <template is="dom-repeat" items="{{fixtures}}" as="fixtureId">
        <fixture-list-item fixture="{{getFixture(fixtureId)}}"></fixture-list-item>
        <button on-click="handleRemoveFixture" fixture-index="[[index]]">x</button>
      </template>
    `
  }

}

customElements.define('fixture-list', FixtureList)
