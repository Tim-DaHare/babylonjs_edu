import { Engine } from "@babylonjs/core/Engines/engine"
import SceneBase from "./scenes/scene_base"
import MainMenuScene from "./scenes/mainmenu_scene"

import TestScene from "./scenes/test_scene"

import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"

export default class BabylonInstance {
    
    public canvas: HTMLCanvasElement
    public engine: Engine

    public currentScene?: SceneBase

    private onResize = () => this.engine.resize()

    constructor () {
        this.canvas = document.getElementById("app_canvas") as HTMLCanvasElement
        this.canvas.tabIndex = 1

        this.engine = new Engine(
            this.canvas, 
            false, 
            { preserveDrawingBuffer: true }
        )

        window.addEventListener("resize", this.onResize)
    }

    public start(): void
    {
        const defaultScene = new MainMenuScene(this)
        // const defaultScene = new TestScene(
        //     this, 
        //     "../editorprojects/testscene/",
        //     "scene.glb"
        // )

        // console.log(defaultScene)

        this.changeScene(defaultScene)
    }

    public stop(): void 
    {
        this.canvas.removeEventListener("resize", this.onResize)
    }

    public changeScene(scene: SceneBase): void
    {
        this.engine.stopRenderLoop()

        this.currentScene = scene

        scene.initialize()

        this.canvas.blur()
        this.canvas.focus()

        this.engine.runRenderLoop(() => {
            scene.sceneLoop()
            scene.scene.render()
        })
    }
}