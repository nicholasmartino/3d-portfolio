import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap } from 'gsap'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340, closed: true })
const debugObject = {}
debugObject.waterColor = 0x001e0f //'#235f72'
debugObject.fogColor = 0x3373ac
debugObject.sunColor = 0xffffff
debugObject.lightColor = 0xd9d9ab
debugObject.flowX = 1
debugObject.flowY = 1
debugObject.scale = 4

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const fogColor = new THREE.Color(debugObject.fogColor)
scene.fog = new THREE.FogExp2(fogColor, 0.0006)
const fogFolder = gui.addFolder("Fog")
fogFolder.addColor(debugObject, 'fogColor').name('Fog Color').onChange(() => {
    scene.fog.color.set(debugObject.fogColor)
})
fogFolder.add(scene.fog, 'density').min(0).max(0.01).step(0.0001).name('Fog Density')


// Fonts
debugObject.fontColor = 0x28a8de
const ttfLoader = new TTFLoader()
ttfLoader.load( './fonts/Metropolis-Medium-500.ttf', function ( json ) {
    const font = new Font( json )

    const mainTextGeometry = new TextGeometry(
        "NIC MARTINO", {
            font: font,
            size: 10,
            height: 0.2,
        }
    )

    const subTextGeometry = new TextGeometry(
        "FULL-STACK DEVELOPER", {
            font: font,
            size: 4,
            height: 0.2,
        }
    )

    // Material - make sure you use Normal material to get that gradient color
    const textMaterial = new THREE.MeshBasicMaterial({ color:debugObject['fontColor'] })
    const mainText = new THREE.Mesh(mainTextGeometry, textMaterial)
    const subText = new THREE.Mesh(subTextGeometry, textMaterial)

    mainText.position.set(0, 7, 0)
    subText.position.set(0, 0, 0)

    // scene.add(mainText)
    // scene.add(subText)

    // const fontsFolder = gui.addFolder("Fonts")
    // fontsFolder.addColor(debugObject, 'fontColor').name('Font Color').onChange(() => {
    //     mainText.material.color.set(debugObject.fontColor)
    //     subText.material.color.set(debugObject.fontColor)
    // })
} )


// textGeometry.center()  //to center the text at the axis



// const loader = new TTFLoader()
// const fontLoader = new TTFLoader()
// loader.load(
//     "./fonts/Metropolis-Medium-500.ttf",
//     fnt => font = fontLoader.parse(fnt)
//         // createText()
//         // //Geometry
//         // const textGeometry = new TextGeometry(
//         //     "Hi, I'm Nic Martino",  //Text that you want to display
//         //     {
//         //         font: font,
//         //         size: 10,
//         //         height: 0.2,
//         //         curveSegments: 6,
//         //         bevelEnabled: true,
//         //         bevelThickness: 0.03,
//         //         bevelSize: 0.02,
//         //         bevelOffset: 0,
//         //         bevelSegments: 4
//         //     }
//         // )

//         // textGeometry.center()  //to center the text at the axis

//         //Material - make sure you use Normal material to get that gradient color
//         // const textMaterial = new THREE.MeshNormalMaterial()
//         // const text = new THREE.Mesh(textGeometry, textMaterial)
//         // scene.add(text)  //don't forget to add the text to scene

// )

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main() {
            gl_FragColor = vec4(0.1, 0.1, 0.1, uAlpha);
        }
    ` 
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

ttfLoader.load( './fonts/Metropolis-Medium-500.ttf', function ( json ) {
    const font = new Font( json )

    const textOverlayGeometry = new TextGeometry(
        "HI, I'M NIC MARTINO", {
            font: font,
            size: 10,
            height: 0.2,
        }
    )
    
    // const subTextGeometry = new TextGeometry(
    //     "FULL-STACK DEVELOPER", {
    //         font: font,
    //         size: 4,
    //         height: 0.2,
    //     }
    // )
    
    // Material - make sure you use Normal material to get that gradient color
    const textOverlayMaterial = new THREE.MeshBasicMaterial({ 
        color:debugObject['fontColor'],
        transparent: true
    })
    const textOverlay = new THREE.Mesh(textOverlayGeometry, textOverlayMaterial)
    // const subText = new THREE.Mesh(subTextGeometry, textMaterial)
    
    // scene.add(textOverlay)
})


/**
 * Loading Manager
 */
 const loadingManager = new THREE.LoadingManager(
    () => {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        scene.remove(overlay)
    },
    () => {
        console.log('Progress')
    }
)


/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // // Update effect composer
    // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // effectComposer.setSize(sizes.width, sizes.height)

})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.8
const rendererFolder = gui.addFolder("Renderer")
rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.01)
const pmremGenerator = new THREE.PMREMGenerator(renderer)


/**
 * Environment map
 */
const groundSize = 1000
const geometry = new THREE.SphereGeometry(groundSize, 60, 40)

const material = new THREE.MeshBasicMaterial({
    color: 0x9ad3de,
    //color: 0xe6af4b,
    map: new THREE.TextureLoader(loadingManager).load('/hdris/hdri.png'),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
})

const mesh = new THREE.Mesh(geometry, material)
mesh.scale.set(-1, 1, 1)
scene.add(mesh)


/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.CircleBufferGeometry(groundSize, 128, 128)
const waterGeometry = new THREE.PlaneGeometry(3000, 3000)

// Color`
// debugObject.depthColor = '#186691'
// debugObject.surfaceColor = '#9bd8ff'

// Material
// const waterMaterial = new THREE.ShaderMaterial({
//     vertexShader: waterVertexShader,
//     fragmentShader: waterFragmentShader,
//     side: THREE.DoubleSide,
//     uniforms: {
//         transparent: true,
//         opacity: 1,
//         uTime: { value: 0 },

//         uBigWavesElevation: { value: 0.2 },
//         uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
//         uBigWavesSpeed: { value: 0.75 },

//         uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
//         uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
//         uColorOffset: { value: 0.08 },
//         uColorMultiplier: { value: 5 },
//     }
// })

const ground = new THREE.Mesh( new THREE.PlaneGeometry( groundSize, groundSize ), new THREE.MeshStandardMaterial( { color: 0x999999, depthWrite: false } ) );
ground.rotation.x = - Math.PI / 2
ground.position.y = 11
ground.receiveShadow = true
ground.side = THREE.DoubleSide
scene.add(ground)

// // Debug
// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('Elevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('Frequency X')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('Frequency Y')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.01).name('Speed')
// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('Color Offset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.01).name('Color Multiplier')

// gui.addColor(debugObject, 'depthColor').name('Depth Color').onChange(() => {
//     waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
// })
// gui.addColor(debugObject, 'surfaceColor').name('Surface Color').onChange(() => {
//     waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
// })

// Mesh
// const water = new THREE.Mesh(waterGeometry, waterMaterial)
// water.rotation.x = - Math.PI * 0.5
// scene.add(water)

function loadTexture (filePath) {
    return new THREE.TextureLoader(loadingManager).load(filePath, function (texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    })
}

const waterNormals = loadTexture('./textures/water/waternormals.jpg')

const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: debugObject['subColor'],
        waterColor: debugObject['waterColor'],
        distortionScale: 3.7,
    }
)
water.rotateX(- Math.PI / 2)

const waterFolder = gui.addFolder('Water')
waterFolder.addColor(debugObject, 'waterColor').name('Water Color').onChange(() => {
    water.material.uniforms.waterColor.value.set(debugObject.waterColor)
})
waterFolder.addColor(debugObject, 'sunColor').name('Sun Color').onChange(() => {
    water.material.uniforms.sunColor.value.set(debugObject.sunColor)
})
scene.add(water)
console.log(water)


/**
 * Planes
 */
const planeHeight = 40
const planeGeometry = new THREE.PlaneGeometry(planeHeight * 1.618, planeHeight)
const planeMaterial = new THREE.MeshStandardMaterial(0xffffff)
planeMaterial.side = THREE.DoubleSide
planeMaterial.opacity = 0.8
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.castShadow = true
plane.position.x = 90
plane.position.y = planeHeight/2

// const videoScreens = {}
// const textureLoader = new THREE.TextureLoader()
// for (let i = 0; i < 2; i++) {
//     const material = new THREE.MeshBasicMaterial({
//         map: textureLoader.load(`./images/${i}.png`)
//     })
//     const videoScreen = new THREE.Mesh(planeGeometry, material)
//     const position = (planeHeight * (i * - 1)) + planeHeight
//     videoScreen.position.set(90, 0, position)
//     videoScreen.material.transparent = true
//     videoScreen.material.opacity = 0
//     console.log(videoScreen)
//     videoScreens[i] = videoScreen
//     // scene.add(videoScreens[i])
// }


/**
 * Mouse
 */
window.addEventListener("wheel", onMouseWheel)
window.addEventListener("scroll", onScroll)

let y = 0
let position = 0
let scrollLimit = document.getElementById("navigationBar").scrollHeight - window.innerHeight

function onMouseWheel(event) {
    y = event.deltaY * 0.1
}

let scrollY = window.scrollY
function onScroll(event) {
    scrollY = window.scrollY
}

/**
 * Videos
 */ 
// const video = document.getElementById('video')
// const texture = new THREE.VideoTexture(video)
// texture.needsUpdate
// texture.minFilter = THREE.LinearFilter
// texture.magFilter = THREE.LinearFilter
// texture.format = THREE.RGBFormat
// texture.crossOrigin = 'anonymous'

// const imageObject = new THREE.Mesh(
//     new THREE.PlaneGeometry(80 , 60),
//     new THREE.MeshBasicMaterial({ map: texture })
// )

// scene.add(imageObject)
// video.src = "./videos/villeAI.mov"
// video.load()
// video.play()

/**
 * Lights
 */
const lightFolder = gui.addFolder('Lights')
const lightPositionFactor = 100
const dirLight = new THREE.DirectionalLight(debugObject.lightColor, 2.8)
dirLight.castShadow = true
dirLight.shadow.camera.top = 1000
dirLight.shadow.camera.bottom = -1000
dirLight.shadow.camera.left = -1000
dirLight.shadow.camera.right = 1000
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 1000
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.shadow.normalBias = 2.6
dirLight.target.position.set(0, 0, 0)
scene.add(dirLight)
scene.add(dirLight.target)
lightFolder.add(dirLight, 'intensity').min(0).max(10).name('DirLight Intensity')

const shadowFolder = gui.addFolder("Shadow")
shadowFolder.add(dirLight.shadow, 'bias').min(0).max(0.01).step(0.0001).name("Bias")
shadowFolder.add(dirLight.shadow, 'normalBias').min(0).max(3).step(0.001).name("Normal Bias")

const sunLightHelper = new THREE.DirectionalLightHelper(dirLight)
scene.add(sunLightHelper)

const ambLight = new THREE.AmbientLight(debugObject.lightColor, 1.8)
scene.add(ambLight)
lightFolder.add(ambLight, 'intensity').min(0).max(5).name('AmbLight Intensity')
lightFolder.addColor(debugObject, 'lightColor').name('Light Color').onChange(() => {
    ambLight.color.set(debugObject.lightColor)
})


/**
 * Sky
 */
// Skybox
const sun = new THREE.Vector3()
const sky = new Sky()
sky.scale.setScalar(1000)
scene.add(sky)

const skyUniforms = sky.material.uniforms

skyUniforms['turbidity'].value = 12
skyUniforms['rayleigh'].value = 0.65
skyUniforms['mieCoefficient'].value = 0.01
skyUniforms['mieDirectionalG'].value = 0.99

const parameters = {
    elevation: 6,
    azimuth: 312,
}

function updateSun() {

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)
    dirLight.position.set(sun.x * lightPositionFactor, 90 + sun.y * lightPositionFactor, sun.z * lightPositionFactor)
    dirLight.target.position.set(0, 0, 0)
    dirLight.target.updateMatrixWorld()

    sky.material.uniforms['sunPosition'].value.copy(sun)
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();

    scene.environment = pmremGenerator.fromScene(sky).texture

}
updateSun()

const sunFolder = gui.addFolder('Sun and Sky')
sunFolder.add(parameters, 'elevation').min(0).max(50).name('Elevation').onChange(updateSun)
sunFolder.add(parameters, 'azimuth').min(0).max(359).name('Azimuth').onChange(updateSun)
sunFolder.add(skyUniforms.turbidity, 'value').min(0).max(15).name('Turbidity').onChange(updateSun)
sunFolder.add(skyUniforms.rayleigh, 'value').min(0).max(2).step(0.01).name('Rayleigh').onChange(updateSun)
sunFolder.add(skyUniforms.mieCoefficient, 'value').min(0).max(0.1).step(0.0001).name('Mie Coefficient').onChange(updateSun)
sunFolder.add(skyUniforms.mieDirectionalG, 'value').min(0).max(1).step(0.001).name('Mie Directional G').onChange(updateSun)


/**
 * Load Textures
 */
const sandLoader = new THREE.TextureLoader(loadingManager)
const sandColorMap = sandLoader.load('./textures/sand/Sand_007_basecolor.jpg')
const sandNormalMap = sandLoader.load('./textures/sand/Sand_007_normal.jpg')

 /**
 * Load Models
 */
const sphereGeometry = new THREE.SphereGeometry(16, 50, 32)
const sandMaterial = new THREE.MeshStandardMaterial({
    map: sandColorMap,
    normalMap: sandNormalMap
})
const sphere = new THREE.Mesh(sphereGeometry, sandMaterial)
sphere.position.set(0, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
// scene.add(sphere)

const glassMaterial = new THREE.MeshPhysicalMaterial()
glassMaterial.transparent = true
glassMaterial.color = new THREE.Color(debugObject['waterColor'])
glassMaterial.metalness = 0.9
glassMaterial.opacity = 0.8
glassMaterial.reflectivity = 0.5

const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    } 
}
let solNascenteModel
const loader = new GLTFLoader(loadingManager)
loader.load('./models/SolNascente.glb', function (gltf) {
    gltf.scene.position.x = -15
    gltf.scene.position.y = 1
    gltf.scene.position.z = -270
    gltf.scene.rotation.y = 0.5
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            console.log("is mesh")
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    solNascenteModel = gltf
    scene.add(gltf.scene)
    const solNascenteFolder = gui.addFolder('Sol Nascente')
    solNascenteFolder.add(gltf.scene.position, 'x').min(-500).max(500).name('Sol Nascente X')
    solNascenteFolder.add(gltf.scene.position, 'z').min(-500).max(500).name('Sol Nascente Z')
    solNascenteFolder.add(gltf.scene.rotation, 'y').min(0).max(Math.PI * 2).step(0.0001).name('Sol Nascente Heading')
}, onProgress)

let aquariumModel
loader.load('./models/Aquarium.glb', function (gltf) {
    gltf.scene.position.x = -100
    gltf.scene.position.y = 2.5
    gltf.scene.position.z = -100
    gltf.scene.rotation.y = 3.18
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            // Water
            if (child.material.name == '[Translucent Glass Tinted]1') {
                child.material = glassMaterial
                child.material.transparent = true
            }
            // Glass
            if (child.material.name == '_Color M05_#3') {
                child.material = glassMaterial
            }
            // Sand
            if (child.material.name == 'Vegetation Bark Maple') {
                child.material = sandMaterial
            }
        }
    })
    aquariumModel = gltf
    scene.add(gltf.scene)
    const aquariumFolder = gui.addFolder('Aquarium')
    aquariumFolder.add(gltf.scene.position, 'x').min(-500).max(500).name('Aquarium X')
    aquariumFolder.add(gltf.scene.position, 'y').min(-10).max(10).name('Aquarium Y')
    aquariumFolder.add(gltf.scene.position, 'z').min(-500).max(500).name('Aquarium Z')
    aquariumFolder.add(gltf.scene.rotation, 'y').min(0).max(Math.PI * 2).step(0.0001).name('Aquarium Heading')
}, onProgress)


/**
 * Camera
 */
// Base camera
const fov = 55
const aspect = sizes.width / sizes.height
const near = 1
const far = 5000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
const cameraInitialX = 90
const cameraInitialZ = 210
camera.position.set(0, cameraInitialX, cameraInitialZ)
scene.add(camera)
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -2000, 2000).step(5).name('Camera X')
cameraFolder.add(camera.position, 'y', -500, 500).step(5).name('Camera Y')
cameraFolder.add(camera.position, 'z', -2000, 2000).step(5).name('Camera Z')
const lookAtParams = new THREE.Vector3()
lookAtParams.x = 0
lookAtParams.y = 0
lookAtParams.z = 0
const updateCameraTarget = () => {
    camera.lookAt(lookAtParams)
}
cameraFolder.add(lookAtParams, 'x', -500, 500).onChange(updateCameraTarget).name('Target X')
cameraFolder.add(lookAtParams, 'y', -500, 500).onChange(updateCameraTarget).name('Target Y')
cameraFolder.add(lookAtParams, 'z', -500, 500).onChange(updateCameraTarget).name('Target Z')
updateCameraTarget()

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.maxPolarAngle = Math.PI * 0.495
// controls.target.set( 0, 10, 0 )
// controls.minDistance = 20
// controls.maxDistance = 800
// controls.update()


// /**
//  * Post processing
//  */

// // Composer
// const renderTarget = new THREE.WebGLRenderTarget(
//     800,
//     600,
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         encoding: THREE.sRGBEncoding,
//     }
// )
// const effectComposer = new EffectComposer(renderer, renderTarget)

// // Passes
// const renderPass = new RenderPass(scene, camera)
// effectComposer.addPass(renderPass)

// const rgbShiftPass = new ShaderPass(RGBShiftShader)
// rgbShiftPass.enabled = false
// effectComposer.addPass(rgbShiftPass)

// const unrealBloomPass = new UnrealBloomPass()
// unrealBloomPass.strength = 0.07
// unrealBloomPass.radius = 0.35
// unrealBloomPass.threshold = 0.1
// effectComposer.addPass(unrealBloomPass)

// const bloomEffectFolder = gui.addFolder('Glow Effect')
// bloomEffectFolder.add(unrealBloomPass, 'strength').min(0).max(1).step(0.01)
// bloomEffectFolder.add(unrealBloomPass, 'radius').min(0).max(3).step(0.01)
// bloomEffectFolder.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.01)

// const smaaPass = new SMAAPass()
// effectComposer.addPass(smaaPass)

updateSun()

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{

    // // Update controls
    // controls.update()

    const time = performance.now() * 0.001;

    water.material.uniforms['time'].value += 1.0 / 60.0
    water.material.transparent = true
    water.material.uniforms['alpha'].value = 0.8

    if (solNascenteModel != null) {
        solNascenteModel.scene.position.y = Math.sin(time * 0.6) + 2
    }
    
    if (aquariumModel != null) {
        aquariumModel.scene.position.y = Math.sin(time * 0.5) + 1.8
    }

    // Scroll events    
    // position += y
    y *= .9

    position = scrollY/2
    position *= 0.9

    const xSpeed = 400
    const zSpeed = 1200

    const scrollYRatio = scrollY/scrollLimit
    console.log("Scroll y ratio", Math.round(scrollYRatio * 100), "%")
    if (position < 0) {
        camera.position.x = cameraInitialX
        camera.position.y = 90
        camera.position.z = cameraInitialZ
        scrollYRatio = 0
    } else if (scrollYRatio >= 0 && scrollYRatio < 0.3) {
        camera.position.x = cameraInitialX + (scrollYRatio * xSpeed)
        camera.position.y = 90
        camera.position.z = cameraInitialZ - (scrollYRatio * zSpeed)
    } else if (scrollYRatio > 0.3 && scrollYRatio < 0.8) {
        camera.position.x = cameraInitialX + (0.3 * xSpeed) - ((scrollYRatio - 0.3) * xSpeed * 0.62)
        camera.position.y = 90
        camera.position.z = cameraInitialZ - (0.3 * zSpeed) - ((scrollYRatio - 0.3) * zSpeed * 0.62)
    } else if (scrollYRatio > 0.8) {
        camera.position.x = cameraInitialX + (0.3 * xSpeed) - (0.5 * xSpeed * 0.62) - ((scrollYRatio - 0.8) * xSpeed * 3.24)
        camera.position.y = 90
        camera.position.z = cameraInitialZ - (0.3 * zSpeed) - (0.5 * zSpeed * 0.62) + ((scrollYRatio - 0.8) * zSpeed * 0.62)
        position = scrollLimit/2
    }

    if (scrollYRatio < 0.1) {

    }

    console.log("Camera position", camera.position)

    let targetX = 0
    let targetY = 0
    let targetZ = 0

    camera.lookAt(targetX, targetY, targetZ)

    // Render
    renderer.render(scene, camera)
    // effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
