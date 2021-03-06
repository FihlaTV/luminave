import { createSelector } from '/node_modules/reselect/src/index.js'
import { collator } from '../utils/index.js'

/*
 * Selectors help you to retrieve data from the state so you don't have to write the
 * same code to access the state over and over again. It also helps to have a central position
 * on how to access the state
 *
 * We also make use of reselect which makes it possible to use a selector as a statePath inside any component
 * -> https://github.com/reactjs/reselect
 * -> https://redux.js.org/docs/recipes/ComputingDerivedData.html
 */
export const getScenes = state => state.sceneManager
export const getAnimations = state => state.animationManager
export const getFixtures = state => state.fixtureManager
export const getTimeline = state => state.timelineManager
export const getTimelineSceneIds = state => state.timelineManager.scenes

export const getAnimation = (state, properties) => {
  return getAnimations(state)
    .filter(animation => animation.id === properties.animationId)[0]
}

/*
 * Sort animations by animation.name
 */
export const getAnimationsSorted = createSelector(
  getAnimations,
  animations => animations.sort((a, b) => collator.compare(a.name, b.name))
)

export const getScene = (state, properties) => {
  return getScenes(state)
    .filter(scene => scene.id === properties.sceneId)[0]
}

// @TODO: This will be a problem because name is not unique
export const getSceneByName = (state, properties) => {
  return getScenes(state)
    .filter(scene => scene.name === properties.name)[0]
}

/*
 * Sort scenes by scene.name
 */
export const getScenesSorted = createSelector(
  getScenes,
  scenes => scenes.sort((a, b) => collator.compare(a.name, b.name))
)

/*
 * Get scenes that are part of the timeline
 */
 export const getTimelineScenes = createSelector(
   getScenes,
   getTimelineSceneIds,
   (scenes, timelineSceneIds) => {
     return scenes.filter(scene => {
       return timelineSceneIds.includes(scene.id)
     })
   }
 )

/*
 * Get a specific fixture by using the fixtureId
 */
export const getFixture = (state, properties) => {
  return getFixtures(state)
    .filter(fixture => fixture.id === properties.fixtureId)[0]
}
