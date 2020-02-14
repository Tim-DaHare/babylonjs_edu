import { Engine } from "@babylonjs/core/Engines/engine"
import SceneBase from "./scenes/scene_base"
import MainMenuScene from "./scenes/mainmenu_scene"

export default class BabylonInstance {
    
    public canvas: HTMLCanvasElement = document.getElementById("app_canvas") as HTMLCanvasElement
    public engine: Engine

    public currentScene: SceneBase

    constructor () {
        this.engine = new Engine(this.canvas)
        this.currentScene = new MainMenuScene(this.canvas, this.engine)

        window.addEventListener("resize", () => this.engine.resize())
    }


}