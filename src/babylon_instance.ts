import { Engine } from "@babylonjs/core/Engines/engine"
import SceneBase from "./scenes/scene_base"

import MainMenuScene from "./scenes/mainmenu_scene"

import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"

export default class BabylonInstance {

    public canvas: HTMLCanvasElement
    public engine: Engine

    public currentScene?: SceneBase

    private onResize = () => this.engine.resize()

    constructor() {
        this.canvas = document.getElementById("app_canvas") as HTMLCanvasElement
        this.canvas.tabIndex = 1

        this.engine = new Engine(
            this.canvas,
            // false,
            // { preserveDrawingBuffer: true }
        )

        this.engine.enableOfflineSupport = false

        window.addEventListener("resize", this.onResize)
    }

    public start(): void {
        const defaultScene = new MainMenuScene(this)

        this.changeScene(defaultScene)
    }

    public stop(): void {
        this.canvas.removeEventListener("resize", this.onResize)
    }

    public changeScene(scene: SceneBase): void {

        if (this.currentScene) {
            this.currentScene.clean()
            // this.currentScene.scene.debugLayer.hide()
        }

        this.engine.stopRenderLoop()

        this.currentScene = scene

        // this.currentScene.scene.debugLayer.show()
        scene.initialize()

        this.canvas.blur()
        this.canvas.focus()

        this.engine.runRenderLoop(() => {
            scene.sceneLoop(this.engine.getDeltaTime() / 1000)
            scene.scene.render()
        })
    }
}