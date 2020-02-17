import { SceneLoader } from "@babylonjs/core"
import { Scene } from '@babylonjs/core/scene'
import BabylonInstance from "../babylon_instance"

export default abstract class SceneBase {

    public babylonInstance: BabylonInstance
    public canvas: HTMLCanvasElement;
    public scene: Scene;

    constructor(babylonInstance: BabylonInstance, sceneDirectory?: string, sceneFilename?: string) {
        this.babylonInstance = babylonInstance
        this.canvas = babylonInstance.canvas

        this.scene = new Scene(babylonInstance.engine)

        // Code not working yet
        if (sceneDirectory || sceneFilename) {
            if (!sceneDirectory || !sceneFilename) {
                console.error(`The ${this.constructor.name} scene was not properly initialized, if providing a scene file also provide the scene directory and vice versa`)
                return
            }

            SceneLoader.Load(sceneDirectory as string, sceneFilename, babylonInstance.engine, (loadedScene: Scene) => {
                // Extensions.RoolUrl = scene.sceneDirectory as string
                // Extensions.ApplyExtensions(loadedScene, loadedScene.metadata)

                this.scene = loadedScene
            })
        }
    }

    public abstract initialize(): void
    public abstract sceneLoop(): void
    public abstract clean(): void
}