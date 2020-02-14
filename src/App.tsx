import React, { useEffect } from "react"

import { Engine } from "@babylonjs/core/Engines/engine"

import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"

import MainMenuScene from "./scenes/mainmenu_scene"
import DodgeScene from "./scenes/dodge_scene"

const App: React.FC = () => {
    const initializeBabylon: () => void = () => {
        // Get the canvas element from the DOM.
        const canvas = document.getElementById("app_canvas") as HTMLCanvasElement
        // Associate a Babylon Engine to it.
        const engine = new Engine(canvas)

        // Add resize event listener to window and resize the engine to prevent image stretching on window resize
        window.addEventListener("resize", () => engine.resize())

        const mainMenuScene = new MainMenuScene(canvas, engine)
        mainMenuScene.initialize()

        const { scene } = mainMenuScene
        // scene.debugLayer.show()

        // Render every frame
        engine.runRenderLoop(() => {
            mainMenuScene.sceneLoop()
            scene.render()
        })
    }

    useEffect(initializeBabylon, [])

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
