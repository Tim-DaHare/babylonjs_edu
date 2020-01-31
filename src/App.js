import React, { useEffect } from 'react'

import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { ExecuteCodeAction } from '@babylonjs/core/Actions'
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D'

import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'

import { GridMaterial } from '@babylonjs/materials/grid'

const OBSTACLE_COUNT = 10
const OBSTACLE_SPEED = 0.3
const OBSTACLE_VELOCITY = new Vector3(0, 0, -OBSTACLE_SPEED)

var gameOver = false

const App = () => {

    const initializeScene = () => {
        // console.log(new ActionManager, 'oof')
        // Get the canvas element from the DOM.
        const canvas = document.getElementById('app_canvas')

        // Associate a Babylon Engine to it.
        const engine = new Engine(canvas)

        // Create our first scene.
        var scene = new Scene(engine)
        scene.actionManager = new ActionManager(scene)
        // scene.debugLayer.show()

        const fullscreenUITexture = AdvancedDynamicTexture.CreateFullscreenUI('screen_ui')

        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero())

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true)

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1

        // Create a grid material
        var material = new GridMaterial('grid', scene)

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        var sphere = Mesh.CreateSphere('sphere1', 16, 2, scene)
        sphere.checkCollisions = true

        // Move the sphere upward 1/2 its height
        sphere.position.y = 1

        // Affect a material
        sphere.material = material

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        var ground = Mesh.CreateGround('ground1', 6, 150, 2, scene)
        ground.checkCollisions = true

        // Affect a material
        ground.material = material

        const input = {}

        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                { trigger: ActionManager.OnKeyDownTrigger }, 
                e => input[e.sourceEvent.key] = e.sourceEvent.type == 'keydown'
            )
        )

        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                { trigger: ActionManager.OnKeyUpTrigger }, 
                e => input[e.sourceEvent.key] = e.sourceEvent.type == 'keydown'
            )
        )

        const obstacles = []
        for(let i = 0; i < OBSTACLE_COUNT; i++) {
            const newObstacle = MeshBuilder.CreateBox(`Box ${i}`, { size: 1.5 }, scene)
            obstacles.checkCollisions = true
            newObstacle.position.z = 20 + i * 15
            newObstacle.position.x = (Math.random() * 3) - 1.5
            newObstacle.position.y = 1

            newObstacle.actionManager = new ActionManager(scene)
            newObstacle.actionManager.registerAction(new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: sphere,
                        usePreciseIntersection: true
                    }
                },
                () => gameOver = true
            ))

            obstacles.push(newObstacle)
        }

        // Render every frame
        engine.runRenderLoop(() => {

            if (gameOver) {

                return
            }

            if (Math.abs(sphere.position.x) <= 3) {
                if(input['a'] || input['ArrowLeft']) {
                    sphere.position.x -= 0.1
                }
                if(input['d'] || input['ArrowRight']) {
                    sphere.position.x += 0.1
                }  
            } else {
                sphere.position.x = Math.round(parseFloat(sphere.position.x.toFixed(1)))
            }

            obstacles.forEach(obstacle => {
                if (obstacle.position.z < -5) {
                    obstacle.position.z = 100
                    obstacle.position.y = 1
                    obstacle.position.x = (Math.random() * 3) - 1.5
                }
                obstacle.moveWithCollisions(OBSTACLE_VELOCITY)
            })

            scene.render()
        })
    }

    useEffect(initializeScene, [])

    return (
        <div className="app">
            <canvas 
                style={{
                    width: '100%',
                    height: '100vh'
                }}
                id="app_canvas" 
                touch-action="none"
            ></canvas>
        </div>
    )
}

export default App
