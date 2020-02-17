import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { Vector3 } from "@babylonjs/core/Maths/math"
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture"
import { Button, TextBlock } from "@babylonjs/gui"

import SceneBase from "./scene_base"

export default class TestScene extends SceneBase {

    camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene)

    public initialize() {
        const {
            camera,
            canvas
        } = this

        this.scene.activeCamera = this.camera

        camera.setTarget(Vector3.Zero()) // This targets the camera to scene origin
        camera.attachControl(canvas, true)
    }

    public sceneLoop() {

    }

    public clean() {

    }
}
