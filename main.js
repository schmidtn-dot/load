console.clear()

let LABEL_TEXT = 'das eigentliche und das uneigentliche'

const clock = new THREE.Clock()
const scene = new THREE.Scene()


const restartAnimButton = document.getElementById('restart-anim')

// Create a new framebuffer we will use to render to
// the video card memory
let renderBufferA = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)
// Create a second framebuffer
let renderBufferB = new THREE.WebGLRenderTarget(
  innerWidth * devicePixelRatio,
  innerHeight * devicePixelRatio
)

// Create a threejs renderer:
// 1. Size it correctly
// 2. Set default background color
// 3. Append it to the page
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xff0000)
renderer.setClearAlpha(0)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio || 1)
document.body.appendChild(renderer.domElement)

// Create an orthographic camera that covers the entire screen
// 1. Position it correctly in the positive Z dimension
// 2. Orient it towards the scene center
const orthoCamera = new THREE.OrthographicCamera(
  -innerWidth / 2,
  innerWidth / 2,
  innerHeight / 2,
  -innerHeight / 2,
  0.1,
  10,
)
orthoCamera.position.set(0, 0, 1)
orthoCamera.lookAt(new THREE.Vector3(0, 0, 0))

// Create a plane geometry that spawns either the entire
// viewport height or width depending on which one is bigger
const labelMeshSize = innerWidth > innerHeight ? innerHeight : innerWidth
const labelGeometry = new THREE.PlaneBufferGeometry(labelMeshSize, labelMeshSize)

let fontColor= "black"

// Programmaticaly create a texture that will hold the text
let labelTextureCanvas
{
  // Canvas and corresponding context2d to be used for drawing the text
  labelTextureCanvas = document.createElement('canvas')
  const labelTextureCtx = labelTextureCanvas.getContext('2d')
  // Dynamic texture size based on the device capabilities
  const textureSize = Math.min(renderer.capabilities.maxTextureSize, 2048)
  const relativeFontSize = 300
  // Size our text canvas
  labelTextureCanvas.width = textureSize
  labelTextureCanvas.height = textureSize
  labelTextureCtx.textAlign = 'center'
  labelTextureCtx.textBaseline = 'middle'
  // Dynamic font size based on the texture size (based on the device capabilities)
  labelTextureCtx.font = `${relativeFontSize}px Helvetica`
  const textWidth = labelTextureCtx.measureText(LABEL_TEXT).width
  const widthDelta = labelTextureCanvas.width / textWidth 
  const fontSize = relativeFontSize * widthDelta 
  labelTextureCtx.font = `${fontSize}px Helvetica`
  labelTextureCtx.fillStyle = "white"
  labelTextureCtx.fillText(LABEL_TEXT, labelTextureCanvas.width / 2, labelTextureCanvas.height / 2)
}
// Create a material with our programmaticaly created text texture as input
let labelMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.CanvasTexture(labelTextureCanvas),
  transparent: true,
  color: 0xffffff,
})
// Create a plane mesh, add it to the scene
const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
//scene.add(labelMesh)

//add image 
//const geometryImg = new THREE.PlaneBufferGeometry(50, 50);
const geometryImg = new THREE.CircleGeometry( 30, 32 )
const texture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/OS_X_10.11_Beta_Beach_Ball.jpg/220px-OS_X_10.11_Beta_Beach_Ball.jpg', renderer)

const textureMaus = new THREE.TextureLoader().load('https://cursor.in/assets/cursor.svg', renderer)
const textureHand = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg', renderer)
const textureHead = new THREE.TextureLoader().load('assets/nick_kopf.png', renderer)


texture.repeat.set(0.7, 0.7)
texture.offset.set(0.15, 0.15)

const materialImg = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,

});
const mesh = new THREE.Mesh( geometryImg, materialImg );
scene.add( mesh );
 


// Create a second scene that will hold our fullscreen plane
const postFXScene = new THREE.Scene()
// Create a plane geometry that covers the entire screen
const postFXGeometry = new THREE.PlaneBufferGeometry(innerWidth, innerHeight)
// Create a plane material that expects a sampler texture input
// We will pass our generated framebuffer texture to it
const postFXMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sampler: { value: null },
  },
  // vertex shader will be in charge of positioning our plane correctly
  vertexShader: `
      varying vec2 v_uv;

      void main () {
        // Set the correct position of each plane vertex
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.99);

        // Pass in the correct UVs to the fragment shader
        v_uv = uv;
      }
    `,
  fragmentShader: `
      // Declare our texture input as a "sampler" variable
      uniform sampler2D sampler;

      // Consume the correct UVs from the vertex shader to use
      // when displaying the generated texture
      varying vec2 v_uv;

      void main () {
        // Sample the correct color from the generated texture
        vec4 inputColor = texture2D(sampler, v_uv + vec2(.00));
        // Set the correct color of each pixel that makes up the plane
        gl_FragColor = vec4(inputColor * .999);
      }
    `,
    transparent: false
})
const postFXMesh = new THREE.Mesh(postFXGeometry, postFXMaterial)
postFXScene.add(postFXMesh)

// Click event listener for animation restart
restartAnimButton.addEventListener('click', () => {
  // Force clear the pixel contents of renderBufferA
  renderer.setRenderTarget(renderBufferA)
  renderer.clear()
  // Force clear the pixel contents of renderBufferB
  renderer.setRenderTarget(renderBufferB)
  renderer.clear()
})



// Start out animation render loop
renderer.setAnimationLoop(onAnimLoop)

function scrollEvent(){
  document.addEventListener('mousewheel', (e) => {
    scrollTarget = e.wheelDeltaY*0.3;
  })
}

function maus(){
  document.addEventListener('mousemove', (e) => {
    console.log(e.y, e.x)
    mesh.position.y = window.innerHeight/2 - e.y
    mesh.position.x = e.x - window.innerWidth/2
  })
  
 
    document.addEventListener('touchmove', (e) => {
    console.log(e.y, e.x)
    e.preventDefault();

    mesh.position.y = window.innerHeight/2 - e.touches[0].clientY
    mesh.position.x = e.touches[0].clientX - window.innerWidth/2
  })
}

  //scrollEvent()
maus()

function updateMesh(){
  pos += scroll*0.1
  //labelMesh.position.y = pos % window.innerHeight - window.innerHeight/2 +100
  //mesh.position.y = pos % window.innerHeight - window.innerHeight/2 +100
  number += (scroll*0.00028)
}

let pos = 0
let scroll = 0
let scrollTarget = 0
let currentScroll = 0
    let number = 0
    let down = false
function onAnimLoop() {
  scroll += (scrollTarget - scroll) * 0.1
  scroll *= 0.9
  scrollTarget *= 0.9
  currentScroll *= scroll * 0.01
  
  //move letter
  updateMesh()
  /*
  if(down){
    number -= 0.01  
    if(number < 0.0001){
      down = false
    }
  }else{
    number += 0.01
        if(number > 1.0){
      down = true
    }
  }
*/

  document.querySelector(".text").addEventListener("mouseenter", (e)=>{
    mesh.material.map = textureHead
  })

  document.querySelector(".text").addEventListener("touchstart", (e)=>{
    mesh.material.map = textureHead
  })

  document.querySelector(".mail").addEventListener("mouseenter", (e)=>{
    mesh.material.map = textureHand
  })
  
    document.querySelector(".mail").addEventListener("mouseleave", (e)=>{
    mesh.material.map = texture
  })
  
   document.addEventListener("click", (e)=>{
     mesh.material.map == textureMaus ? (mesh.material.map = texture) :
   ( mesh.material.map = textureMaus)
  })
  
  mesh.rotation.z -= 0.1
  number = 0
 // mesh.position.y += 80

  labelMesh.material.color.r = number 
  labelMesh.material.color.b = number
  labelMesh.material.color.g = number
  // Do not clear the contents of the canvas on each render
  // In order to achieve our effect, we must draw the new frame
  // on top of the previous one!
  renderer.autoClearColor = false
  
  // Explicitly set renderBufferA as the framebuffer to render to
  renderer.setRenderTarget(renderBufferA)
  
  // On each new frame, render the scene to renderBufferA
  renderer.render(postFXScene, orthoCamera)
  renderer.render(scene, orthoCamera)
  
  // Set the device screen as the framebuffer to render to
  // In WebGL, framebuffer "null" corresponds to the default framebuffer!
  renderer.setRenderTarget(null)
  
  // Assign the generated texture to the sampler variable used
  // in the postFXMesh that covers the device screen
  postFXMesh.material.uniforms.sampler.value = renderBufferA.texture
    
  // Render the postFX mesh to the default framebuffer
  renderer.render(postFXScene, orthoCamera)
  
  // Ping-pong our framebuffers by swapping them
  // at the end of each frame render
  const temp = renderBufferA
  renderBufferA = renderBufferB
  renderBufferB = temp
}
