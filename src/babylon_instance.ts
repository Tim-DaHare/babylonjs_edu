import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from '@babylonjs/core/scene'
import SceneBase from "./scenes/scene_base"
import MainMenuScene from "./scenes/mainmenu_scene"

import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"

export default class BabylonInstance {
    
    public canvas: HTMLCanvasElement
    public engine: Engine

    public currentScene?: SceneBase

    private onResize = () => this.engine.resize()

    constructor () {
        this.canvas = document.getElementById("app_canvas") as HTMLCanvasElement
        this.engine = new Engine(this.canvas)
        // this.currentScene = new MainMenuScene(this.canvas, this.engine)

        window.addEventListener("resize", this.onResize)
    }

    public start(): void
    {
        const mainMenuScene = new MainMenuScene(this)


        this.changeScene(mainMenuScene)

        // mainMenuScene.initialize()

        // const { scene } = mainMenuScene
        // scene.debugLayer.show()

        // Render every frame

        // this.engine.runRenderLoop(() => {
        //     mainMenuScene.sceneLoop()
        //     scene.render()
        // })
    }

    public stop(): void 
    {
        this.canvas.removeEventListener("resize", this.onResize)
    }

    public changeScene(scene: SceneBase): void
    {
        this.engine.stopRenderLoop()

        this.currentScene = scene
        this.currentScene.initialize()

        this.engine.runRenderLoop(() => {
            scene.sceneLoop()
            scene.scene.render()
        })
    }
}