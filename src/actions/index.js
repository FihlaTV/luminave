import * as constants from '../constants/index.js'
import * as selectors from '../selectors/index.js'
import * as utils from '../utils/index.js'

/*
 *
 * A collection of Redux actions (= something happened)
 *
 * Example:
 ```
 export const action = (mydata) => ({
   mydata,
   type : constants.CONSTANT
 })
 ```
 */

/*
 * Set the value for a DMX512 channel
 */
export const setChannel = (universeIndex, channelIndex, value) => ({
  universeIndex,
  channelIndex,
  value,
  type: constants.SET_CHANNEL
})

/*
 * Set the value for a DMX512 channel
 */
export const setChannels = (universeIndex, channels) => ({
  universeIndex,
  channels,
  type: constants.SET_CHANNELS
})

/*
 * Set the value for a DMX512 channel
 */
export const getChannel = (universeIndex, channelIndex) => ({
  universeIndex,
  channelIndex,
  type: constants.GET_CHANNEL
})

/*
 * Set the BPM
 */
export const setBpm = value => ({
  value,
  type: constants.SET_BPM
})

/*
 * The status of the connection to the USB controller
 */
export const connectUsb = connected => ({
  connected,
  type: constants.CONNECT_USB
})

/*
 * The status of the connection to a Bluetooth controller
 */
export const connectBluetooth = connected => ({
  connected,
  type: constants.CONNECT_BLUETOOTH
})

/*
 * Add a DMX512 universe
 */
export const addUniverse = universe => ({
  universe,
  type: constants.ADD_UNIVERSE
})

/*
 * Remove a DMX512 universe
 */
export const removeUniverse = universeIndex => ({
  universeIndex,
  type: constants.REMOVE_UNIVERSE
})

/*
 * Reset the DMX512 universe and all fixtures
 */
export const resetUniverseAndFixtures = universeIndex => {
  return (dispatch, getState) => {
    dispatch(resetAllFixtures())

    // Update the channels of universe x with the batch of values collected for the fixtures
    dispatch(setChannels(universeIndex, [...utils.batch]))

    // Reset the batch so that if a scene is done the values for the attachted fixtures are also reset
    utils.clearBatch()
  }
}

/*
 * Add a scene
 */
export const addScene = scene => ({
  scene,
  type: constants.ADD_SCENE
})

/*
 * Start the playback of a scene
 */
export const runScene = sceneIndex => ({
  sceneIndex,
  type: constants.RUN_SCENE
})

/*
 * Remove a scene
 */
export const removeScene = sceneIndex => ({
  sceneIndex,
  type: constants.REMOVE_SCENE
})

/*
 * Set the name of a scene
 */
export const setSceneName = (sceneIndex, sceneName) => ({
  sceneIndex,
  sceneName,
  type: constants.SET_SCENE_NAME
})

/*
 * Add a animation to the scene
 */
export const addAnimationToScene = (sceneIndex, animationId) => ({
  sceneIndex,
  animationId,
  type: constants.ADD_ANIMATION_TO_SCENE
})

/*
 * Remove a animation from the scene
 */
export const removeAnimationFromScene = (sceneIndex, animationIndex) => ({
  sceneIndex,
  animationIndex,
  type: constants.REMOVE_ANIMATION_FROM_SCENE
})

/*
 * Add a fixture to the scene
 */
export const addFixtureToScene = (sceneIndex, fixtureId) => ({
  sceneIndex,
  fixtureId,
  type: constants.ADD_FIXTURE_TO_SCENE
})

/*
 * Add a fixtures to the scene
 */
export const addFixturesToScene = (sceneIndex, fixtureIds) => {
  return (dispatch, getState) => {
    fixtureIds.map(fixtureId => dispatch(addFixtureToScene(sceneIndex, fixtureId)))
  }
}

/*
 * Add a fixture to the scene
 */
export const removeFixtureFromScene = (sceneId, fixtureIndex) => ({
  sceneId,
  fixtureIndex,
  type: constants.REMOVE_FIXTURE_FROM_SCENE
})


/*
 * Reset all properties of all fixtures
 *
 * THIS IS DANGEROUS!!! PLEASE DON'T USE IT!
 */
export const resetAllFixtures = () => {
  return (dispatch, getState) => {

    // Get the fixtures of the scene
    selectors.getFixtures(getState()).map(fixture => {
      utils.clearFixtureInBatch(fixture.id)

      // Reset the propeties of the fixture in the state & batch
      dispatch(resetFixtureProperties(fixture.id))
    })
  }
}

/*
 * Add a animation
 */
export const addAnimation = animation => ({
  animation,
  type: constants.ADD_ANIMATION
})

/*
 * Start the playback of a animation
 */
export const runAnimation = animationIndex => ({
  animationIndex,
  type: constants.RUN_ANIMATION
})

/*
 * Remove a DMX512 universe
 */
export const removeAnimation = animationIndex => ({
  animationIndex,
  type: constants.REMOVE_ANIMATION
})


/*
 * Set the name of a scene
 */
export const setAnimationName = (animationIndex, animationName) => ({
  animationIndex,
  animationName,
  type: constants.SET_ANIMATION_NAME
})


/*
 * Add a keyframe
 */
export const addKeyframe = (animationIndex, keyframeStep, keyframeProperty, keyframeValue) => ({
  animationIndex,
  keyframeStep,
  keyframeProperty,
  keyframeValue,
  type: constants.ADD_KEYFRAME
})

/*
 * Add a fixture
 */
export const addFixture = fixture => ({
  fixture,
  type: constants.ADD_FIXTURE
})

/*
 * Set the address of a fixture
 */
export const setFixtureAddress = (fixtureId, fixtureAddress) => ({
  fixtureId,
  fixtureAddress,
  type: constants.SET_FIXTURE_ADDRESS
})

/*
 * Set the properties of a fixture
 */
export const setFixtureProperties = (fixtureId, properties) => ({
  fixtureId,
  properties,
  type: constants.SET_FIXTURE_PROPERTIES
})

/*
 * Set the properties of all fixtures
 */
export const setAllFixtureProperties = fixtureBatch => ({
  fixtureBatch,
  type: constants.SET_ALL_FIXTURE_PROPERTIES
})

/*
 * Reset the properties of a fixture
 */
export const resetFixtureProperties = fixtureId => ({
  fixtureId,
  type: constants.RESET_FIXTURE_PROPERTIES
})

/*
 * Remove a fixture
 */
export const removeFixture = fixtureIndex => ({
  fixtureIndex,
  type: constants.REMOVE_FIXTURE
})

/*
 * Remove a fixture from everywhere
 */
export const removeFixtureFromEverywhere = fixtureId => {
  return (dispatch, getState) => {

    const fixtureIndex = selectors.getFixtures(getState()).findIndex(fixture => fixture.id === fixtureId)

    // Remove fixture from batch
    utils.clearFixtureInBatch(fixtureId)

    // Remove fixture from all scenes
    selectors.getScenes(getState()).map(scene => {
      if (scene.fixtures.indexOf(fixtureId) > -1) {
        dispatch(removeFixtureFromScene(scene.id, scene.fixtures.indexOf(fixtureId)))
      }
    })

    dispatch(removeFixture(fixtureIndex))
  }
}

/*
 * Add a MIDI controller
 */
export const addMidi = controller => ({
  controller,
  type: constants.ADD_MIDI
})

/*
 * Remove a MIDI controller
 */
export const removeMidi = controllerIndex => ({
  controllerIndex,
  type: constants.REMOVE_MIDI
})

/*
 * Enable WebMIDI
 */
export const enableMidi = enabled => ({
  enabled,
  type: constants.ENABLE_MIDI
})

/*
 * Learn WebMIDI
 */
export const learnMidi = mappingIndex => ({
  mappingIndex,
  type: constants.LEARN_MIDI
})


/*
 * Add a MIDI mapping for a specific input (e.g. button) from a MIDI controller
 */
export const addMidiMapping = (controllerIndex, mappingIndex, mapping) => ({
  controllerIndex,
  mappingIndex,
  mapping,
  type: constants.ADD_MIDI_MAPPING
})

/*
 * Set the active state of a  MIDI mapping for a specific input (e.g. button)
 */
export const setMidiMappingActive = (controllerIndex, mappingIndex, active) => ({
  controllerIndex,
  mappingIndex,
  active,
  type: constants.SET_MIDI_MAPPING_ACTIVE
})

/*
 * Add a scene to a MIDI controller
 */
export const addSceneToMidi = (controllerIndex, mappingIndex, sceneId) => ({
  controllerIndex,
  mappingIndex,
  sceneId,
  type: constants.ADD_SCENE_TO_MIDI
})

/*
 * Add multiple scenes to a MIDI controller
 */
export const addScenesToMidi = (controllerIndex, mappingIndex, sceneIds) => ({
  controllerIndex,
  mappingIndex,
  sceneIds,
  type: constants.ADD_SCENES_TO_MIDI
})


/*
 * Remove a scene from a MIDI controller
 */
export const removeSceneFromMidi = (controllerIndex, mappingIndex, sceneIndex) => ({
  controllerIndex,
  mappingIndex,
  sceneIndex,
  type: constants.REMOVE_SCENE_FROM_MIDI
})

/*
 * Control playback of the timeline
 */
export const playTimeline = playing => ({
  playing,
  type: constants.PLAY_TIMELINE
})

/*
 * Set the progress of the timeline
 */
export const setTimelineProgress = progress => ({
  progress,
  type: constants.SET_TIMELINE_PROGRESS
})

/*
 * Reset the timeline and remove everything
 */
export const resetTimeline = () => ({
  type: constants.RESET_TIMELINE
})


/*
 * Add a scene to the timeline
 */
export const addSceneToTimeline = sceneId => ({
  sceneId,
  type: constants.ADD_SCENE_TO_TIMELINE
})

/*
 * Remove a scene from the timeline
 *
 * Don't use this directly, use #removeSceneFromTimelineAndResetFixtures
 * to also reset the fixtures
 */
export const removeSceneFromTimeline = sceneId => ({
  sceneId,
  type: constants.REMOVE_SCENE_FROM_TIMELINE
})

/*
 * Remove a scene fromt he timeline and also reset all fixtures assigned to that scene
 */
export const removeSceneFromTimelineAndResetFixtures = sceneId => {
  return (dispatch, getState) => {

    // Get the fixtures of the scene
    selectors.getScene(getState(), { sceneId }).fixtures.map(fixtureId => {
      utils.clearFixtureInBatch(fixtureId)
    })

    // Remove the scene from the timelline
    dispatch(removeSceneFromTimeline(sceneId))
  }
}

/*
 * Set live mode
 */
export const setLive = value => ({
  value,
  type: constants.SET_LIVE
})

/*
 * Send the universe to the USB DMX controller
 */
export const sendUniverseToUsb = value => ({
  value,
  type: constants.SEND_UNIVERSE_TO_USB
})

/*
 * Send the universe to fivetwelve bridge
 */
export const sendUniverseToFivetwelve = value => ({
  value,
  type: constants.SEND_UNIVERSE_TO_FIVETWELVE
})

/*
 * Set the color from modV
 */
export const setModvColor = color => ({
  color,
  type: constants.SET_MODV_COLOR
})

/*
 * Connect / disconnect to modV
 */
export const connectModv = connected => ({
  connected,
  type: constants.CONNECT_MODV
})

/*
 * Set the data from Dekk
 */
export const setDekkData = data => ({
  data,
  type: constants.SET_DEKK_DATA
})

/*
 * Connect / disconnect to Dekk
 */
export const connectDekk = connected => ({
  connected,
  type: constants.CONNECT_DEKK
})

/*
 * Connect / disconnect to fivetwelve-bridge
 */
export const connectFivetwelve = connected => ({
  connected,
  type: constants.CONNECT_FIVETWELVE
})
