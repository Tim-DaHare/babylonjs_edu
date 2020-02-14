import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { GridMaterial } from '@babylonjs/materials/grid'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes'
import { ExecuteCodeAction } from '@babylonjs/core/Actions'

import SceneBase from "./scene_base"

interface Input {
    // Accept random keys with any value for interface 
    [key: string]: any
}

export default class DodgeScene extends SceneBase {

    OBSTACLE_COUNT = 10;
    OBSTACLE_SPEED = 0.3
    OBSTACLE_VELOCITY = new Vector3(0, 0, -this.OBSTACLE_SPEED)

    input: Input = {}

    camera: FreeCamera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene)
    sphere: Mesh = Mesh.CreateSphere('sphere1', 16, 2, this.scene) // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    obstacles: Mesh[] = []

    public initialize() {
        const { 
            scene, 
            canvas, 
            input,
            camera,
            sphere,
            obstacles
        } = this

        this.scene.actionManager = new ActionManager(scene)

        // const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
        camera.setTarget(Vector3.Zero()) // This targets the camera to scene origin
        camera.attachControl(canvas, true)

        const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene) // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        light.intensity = 0.7

        const material = new GridMaterial('grid', scene) // Create a grid material

        sphere.checkCollisions = true
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
                e => input[e.sourceEvent.key] = e.sourceEvent.type === 'keydown'
            )
        )

        // const obstacles: Mesh[] = []
        for (let i = 0; i < this.OBSTACLE_COUNT; i++) {
            const newObstacle = MeshBuilder.CreateBox(`Box ${i}`, { size: 1.5 }, scene)
            newObstacle.checkCollisions = true
            newObstacle.position.z = 100 + i * 15
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
                    console.log('game over')
                    // gameOver = true
                }
            ))

            obstacles.push(newObstacle)
        }
    }

    public sceneLoop() {
            const {
                input,
                sphere,
                obstacles
            } = this
            // if (gameOver) {
            //     return
            // }

            if (Math.abs(sphere.position.x) <= 3) {
                if (input['a'] || input['ArrowLeft']) {
                    sphere.position.x -= 0.1
                }
                if (input['d'] || input['ArrowRight']) {
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
                obstacle.moveWithCollisions(this.OBSTACLE_VELOCITY)
            })
    }
}