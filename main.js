console.clear()

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
if(typeof DeviceMotionEvent.requestPermission === 'function') {
    setTimeout(()=>{
      console.log("mobile")
      document.querySelector("#accelPermsButton").style.display = "flex"
      document.querySelector("#accelPermsButton").style.opacity  = 1
      },4000)
  } else { 
    console.log("not mobile")
  }


let LABEL_TEXT = 'hello'

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

let fontColor= "white"

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
labelMesh.material.opacity = 0;
scene.add(labelMesh)

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
    progress: { value: 0.99},
    rate: {value: 0.998},
    time : {value: 0},
    rotationTime: {value: 0.001},
    orientationX: {value: 0.0},
    orientationY: {value:0.0}
  },
  // vertex shader will be in charge of positioning our plane correctly
  vertexShader: `
      varying vec2 v_uv;
      uniform float progress;
      uniform float time;
      uniform float rate;
      uniform float rotationTime;



      void main () {
        // Set the correct position of each plane vertex
        //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.998);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, rate) * mat4(cos(rotationTime), -sin(rotationTime), 0.0, 0.0, sin(rotationTime), cos(rotationTime), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);

        // Pass in the correct UVs to the fragment shader
        v_uv = uv;
      }
    `,
  fragmentShader: `
      // Declare our texture input as a "sampler" variable
      uniform sampler2D sampler;

      // Consume the correct UVs from the vertex shader to use
      // when displaying the generated texture
      
      uniform float progress;
      uniform float time;
      uniform float orientationX;
      uniform float orientationY;


      varying vec2 v_uv;

      
       //	Simplex 3D Noise 
      //	by Ian McEwan, Ashima Arts
      //
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //  x0 = x0 - 0. + 0.0 * C 
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      // Permutations
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients
      // ( N*N points uniformly over a square, mapped onto an octahedron.)
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

      // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main () {
        // Sample the correct color from the generated texture
        //vec4 inputColor = texture2D(sampler, v_uv + vec2(.00));
          float a = snoise(vec3(v_uv * 5.1, time * 0.1)) * 0.0032;
        float b = snoise(vec3(v_uv * 5.1, time * 0.1 + 100.0)) * 0.0032;
        vec4 inputColor = texture2D(sampler, v_uv + vec2(a * 0.05, b * 0.05) + vec2(orientationX, orientationY) * 0.01);
      
        // Set the correct color of each pixel that makes up the plane
        gl_FragColor = vec4(inputColor * 1.0);
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

var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1/60; // Sensor refresh rate

let orientPremission = false


let x = 0
let y = 0

function getAccel(){
  DeviceMotionEvent.requestPermission().then(response => {
      if (response == 'granted') {
        document.querySelector("#accelPermsButton").style.display = "none"
     // Add a listener to get smartphone orientation 
         // in the alpha-beta-gamma axes (units in degrees)
          window.addEventListener('deviceorientation',(event) => {

            postFXMesh.material.uniforms.rate.value = 0.998
              // Expose each orientation angle in a more readable way
              let rotation_degrees = event.alpha;
              let frontToBack_degrees = event.beta;
              let leftToRight_degrees = event.gamma;

              // Update velocity according to how tilted the phone is
              // Since phones are narrower than they are long, double the increase to the x velocity
              vx = vx + leftToRight_degrees * updateRate*2; 
              vy = vy + frontToBack_degrees * updateRate;
              
              // Update position and clip it to bounds
              px = px + vx*.5;
              if (px > 98 || px < 0){ 
                  px = Math.max(0, Math.min(98, px)) // Clip px between 0-98
                  vx = 0;
              }
      
              py = py + vy*.5;
              if (py > 98 || py < 0){
                  py = Math.max(0, Math.min(98, py)) // Clip py between 0-98
                  vy = 0;
              }
              
              let x = frontToBack_degrees * 0.01
              let y = leftToRight_degrees * 0.01
              //document.querySelector(".number-text").innerText = "x: " + x + " y: " + y
              postFXMesh.material.uniforms.orientationX.value = y * -1
              postFXMesh.material.uniforms.orientationY.value = x 
            });
        
         
      }
  });
}


document.querySelector("#accelPermsButton").addEventListener("click", (e) => {
  getAccel()
})


function maus(){
  document.addEventListener('mousemove', (e) => {
    console.log(e.y, e.x)
    mesh.position.y = window.innerHeight/2 - e.y
    mesh.position.x = e.x - window.innerWidth/2

    //GET MAIL CORDINATES
    const mail = document.querySelector(".mail")

    let position = mail.getBoundingClientRect();  
    let top = position.top; 
    let left = position.left; 
    let right = position.right; 
    let bottom = position.bottom;
    
    if(e.x  > left && e.x < right && e.y > top && e.y < bottom) {
      // Mousemove element is inside the coordinates
      labelMesh.material.opacity = 1;
      mesh.material.map = textureHand
      postFXMesh.material.uniforms.rate.value = 1.005
      postFXMesh.material.uniforms.rotationTime.value = -0.003
    } else {
      labelMesh.material.opacity = 0;
      mesh.material.map = texture
      postFXMesh.material.uniforms.rate.value = 0.998
      postFXMesh.material.uniforms.rotationTime.value = 0.002
    }

  })
  
 
    document.addEventListener('touchmove', (e) => {
    console.log(e.y, e.x)
    e.preventDefault();

    mesh.position.y = window.innerHeight/2 - e.touches[0].clientY
    mesh.position.x = e.touches[0].clientX - window.innerWidth/2


    //GET MAIL CORDINATES
    const mail = document.querySelector(".mail")

    let position = mail.getBoundingClientRect();  
    let top = position.top; 
    let left = position.left; 
    let right = position.right; 
    let bottom = position.bottom; 

       
    if(e.touches[0].clientX  > left && e.touches[0].clientX  < right && e.touches[0].clientY > top && e.touches[0].clientY < bottom) {
      // Mousemove element is inside the coordinates
      mesh.material.map = textureHand
      postFXMesh.material.uniforms.rate.value = 1.005
      postFXMesh.material.uniforms.rotationTime.value = -0.003
    } else {
      mesh.material.map = texture
      postFXMesh.material.uniforms.rate.value = 0.998
      postFXMesh.material.uniforms.rotationTime.value = 0.002
    }
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

let premission = false
let time = 0.05
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




/*
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
    */
  mesh.rotation.z -= 0.1
  number = 0
 // mesh.position.y += 80
  time += 0.01
  postFXMesh.material.uniforms.time.value = time


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
