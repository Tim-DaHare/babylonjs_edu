import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera, TargetCamera } from '@babylonjs/core/Cameras'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { GridMaterial } from '@babylonjs/materials/grid'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes'
import { ExecuteCodeAction } from '@babylonjs/core/Actions'
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture"
import { Button, TextBlock, Control } from "@babylonjs/gui"

import SceneBase from "./scene_base"
import { Camera } from '@babylonjs/core';
import { InputManager } from '@babylonjs/core/Inputs/scene.inputManager';

interface Input {
    // Accept random keys with any value for interface 
    [key: string]: any
}

export default class DodgeScene extends SceneBase {

    OBSTACLE_COUNT = 5
    OBSTACLE_MIN_SPEED = 0.3
    OBSTACLE_MAX_SPEED = 5
    OBSTACLE_SPEED = 0.3
    OBSTACLE_VELOCITY = new Vector3(0, 0, -this.OBSTACLE_SPEED)

    startTime: number = new Date().getTime()

    input: Input = {}

    gameOver: boolean = false

    // GUI
    guiTexture: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("DODGE_SCENE_UI")

    gameOverText: TextBlock = new TextBlock("game_over", "Game Over!")
    scoreCounter: TextBlock = new TextBlock("score_counter", "0")

    // Scene objects
    // camera: FreeCamera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene)
    camera: TargetCamera = new TargetCamera('main_camera', new Vector3(0, 3, -10), this.scene)
    sphere: Mesh = Mesh.CreateSphere('sphere1', 16, 2, this.scene) // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    obstacles: Mesh[] = []

    private handleOrientation = (event: DeviceOrientationEvent) => {
        this.input.orientation = {
            gamma: event.gamma,
            alpha: event.alpha,
            beta: event.beta
        }
    }

    public initialize() {
        const {
            scene,
            canvas,
            guiTexture,
            gameOverText,
            input,
            camera,
            sphere,
            obstacles,
            scoreCounter
        } = this

        scene.actionManager = new ActionManager(scene)

        window.addEventListener("deviceorientation", this.handleOrientation, true)

        scoreCounter.color = "white"
        scoreCounter.fontSize = 100
        scoreCounter.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        scoreCounter.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
        scoreCounter.paddingRight = "100px"
        scoreCounter.paddingTop = "50px"

        guiTexture.addControl(scoreCounter)

        gameOverText.color = "white"
        gameOverText.fontSize = 125

        camera.parent = sphere
        camera.setTarget(new Vector3(0, 3, 10)) // This targets the camera to scene origin
        // camera.attachControl(canvas, true)

        const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene) // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        light.intensity = 0.7

        const material = new GridMaterial('grid', scene) // Create a grid material

        // sphere.checkCollisions = true
        sphere.position.y = 1
        sphere.material = material

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
        const ground = Mesh.CreateGround('ground1', 6, 150, 2, scene)
        ground.checkCollisions = true
        ground.material = material

        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                { trigger: ActionManager.OnKeyDownTrigger },
                e => input[e.sourceEvent.key] = e.sourceEvent.type === 'keydown'
            )
        )

        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                { trigger: ActionManager.OnKeyUpTrigger },
                e => {
                    input[e.sourceEvent.key] = e.sourceEvent.type === 'keydown'
                }
            )
        )

        // Generate obstacles
        for (let i = 0; i < this.OBSTACLE_COUNT; i++) {
            const newObstacle = MeshBuilder.CreateBox(`Box ${i}`, { size: 1.5 }, scene)
            // newObstacle.checkCollisions = true

            newObstacle.position.z = 75 + (i * (75 / this.OBSTACLE_COUNT))
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
                () => {
                    guiTexture.addControl(this.gameOverText)
                    this.gameOver = true
                }
            ))

            obstacles.push(newObstacle)
        }
    }

    public sceneLoop() {
        const {
            input,
            sphere,
            camera,
            obstacles,
            scoreCounter
        } = this

        if (this.gameOver) return

        // Sensor controls
        if (input.orientation) {
            sphere.position.x += (0.01 * input.orientation.gamma)
            camera.position.x = (0.05 * input.orientation.gamma)
        }

        // Keyboard controls
        if (input['a'] || input['ArrowLeft']) {
            sphere.position.x -= 0.1
        }
        if (input['d'] || input['ArrowRight']) {
            sphere.position.x += 0.1
        }

        // clamp sphere position
        if (Math.abs(sphere.position.x) > 2) sphere.position.x = Math.round(parseFloat(sphere.position.x.toFixed(1)))

        obstacles.forEach(obstacle => {
            if (obstacle.position.z < -5) {
                // Puth obstacle back in line
                obstacle.position.z = 75
                obstacle.position.y = 1
                obstacle.position.x = (Math.random() * 3) - 1.5

                scoreCounter.text = (parseInt(scoreCounter.text) + 1).toString()
            }
            obstacle.moveWithCollisions(this.OBSTACLE_VELOCITY)
        })
    }

    public clean(): void {
        window.removeEventListener("deviceorientation", this.handleOrientation, true)
    }
}