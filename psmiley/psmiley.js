/*

 psmiley todo
 - time the iframes (maybe using Animation api) so they fire with same time between each, or maybe use postMessage to communicate to each frame
 - when going off tab, animate back
 - when new iframes load, inject into them
 - when leaving tab, set favicon to original
	 - allow original to be selectable
 - convert to api to allow tying to canvas or div/tag/queryselector
 - add wheel scrolling to rotate object
 - add wheel scrolling in subframes to rotate object
 - add a decay envelope after mouse movement
 - alternative material on top vs bottom view or paren
 - add physics (inverse square law) to the orbiting to slow it down when moving mouse (attack) like 
 - add a release (like gravity or linear?) so that it rotates back to a default position
 - add soft body physics so mouse can run into psmiley and jiggle/dent it
 - add mouse synthesis so that hitting object bounces mouse back
	 - delta between real and synthetic mouse locations can be resolved as user moves mouse, speed of synthetic mouse changes to realign
 - improve lighting
 - don't use stl, render the object directly in webgl to gain proper smoothness
 - find reasonable mouse controls
 - add gui for controlling values
 - separate coloring between top and eyes
 - widen viewport to entire screen while keeping model fixed aspect ratio
 - support prefers-reduced-motion
 - support prefers-color-scheme
 - use js cdn
 - test ff (potentially svg)
 - investigate edge
 - investigate safari
 - determine minimum browser support and update ecmascript to most modern but least common denominator features
 - on mobile, tapping kills model

 - done change view from perspective to orthographic to prevent immediate 3d view
 - done figure out how to always keep object centered (in favicon)
 - done place stl in proper center
 - done adjust pivot point
 - done remove zoom
 - done transparent bg
 - done click to animate
 - done mess with history object

	- by samy

 */


let opts, canvas, context, link, psmiley, origuri, wh, width, height, windowHalfX, windowHalfY, INTERSECTED
let ambientLight, light1, light2, light3, origrot, lastpause
let isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent))
let safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
setWH()

let runners = 4 // number of sub frames to inject into
let runnerInd = 0
let xAnimRot = 0.01
let yAnimRot = 0.01
let zAnimRot = 0.00
let animRotDelay = 2000
let mouseOrbitScale = -0.01
let onAnimEnd = []

const TAU       = Math.PI * 2
const w         = window
const wt        = window.top
const d         = w.document
const td        = wt.document
const scene     = new THREE.Scene()
const camera    = new THREE.OrthographicCamera(width / -2, width / 2, height / -2, height / 2, 0.0001, 10000000)
const renderer  = new THREE.WebGLRenderer({ alpha: true })
const pmremGen  = new THREE.PMREMGenerator(renderer)
const raycaster = new THREE.Raycaster()
const pointer   = new THREE.Vector2()
const loader    = new THREE.STLLoader()
const roomEnv   = new THREE.RoomEnvironment()
wt._orbit       = 1
wt._animate     = 0
wt._animTime    = Date.now()

//const projector = new THREE.Projector()
//const gui       = new dat.GUI()

document.addEventListener('DOMContentLoaded', setup)

// setup everything
function setup()
{
	setupAnimation()
	setupLighting()
	setupCanvas()
	setupFav()
	//setupGUI()
	//setupInteractions()
	setupSTL(postSTL) // handles the rest via postSTL callback

	function postSTL()
	{
		// initial demo movements (requires psmiley object)
		setupDemo()

		// orbit model on mouse movement (requires psmiley object)
		setupMouseOrbit()

		// begin the renderer
		loop()
	}
}

// demo upon page load
function setupDemo()
{
	let ogx = xAnimRot
	let ogy = yAnimRot
	let ogz = zAnimRot
	let ogd = animRotDelay
	let oga = wt._animate
	let ogo = wt._orbit
	wt._animate = 0
	wt._orbit   = 0

	xAnimRot = 0.035
	yAnimRot = 0.035
	zAnimRot = 0.00
	animRotDelay = 1000

	setTimeout(() => {
		wt._animate = 1

		// callback once psmiley returned to original state
		onAnimEnd.push(() => {
			// temporarily turn off animation
			wt._animate = 0
			
			// return vars
			xAnimRot     = ogx
			yAnimRot     = ogy
			zAnimRot     = ogz
			animRotDelay = ogd

			// place animation back to original value with a delay
			setTimeout(() => { wt._animate = oga }, animRotDelay)

			// orbiting back to normal value
			setTimeout(() => { wt._orbit =   ogo }, 250)

		})
	}, 1000)
}

// try interactions when mouse hits model
function setupInteractions()
{
	document.body.addEventListener('mouseleave', e => { hideAllCursors() })
	document.getElementById('bg').addEventListener('mousemove', e => { mouseMovedOnBackground(e) })
	//window.addEventListener('mousemove', onMouseMove, false)

	// track mouse/pointer movements
	td.addEventListener('pointermove', onPointerMove, false)

	/*
	document.body.addEventListener('mouseleave', e => { hideAllCursors() })
	document.getElementById('bg').addEventListener('mousemove', e => { mouseMovedOnBackground(e) })
	document.getElementById('how').addEventListener('mousemove', e => { mouseMovedOnHowdy(e) })
	document.getElementById('how').addEventListener('mouseleave', e => { offsetX = offsetY = 0 })
	*/
}

// track mouse movements
function onPointerMove(e)
{
	e.preventDefault()

	// XXX should this be w/h instead of window?
	pointer.x =  (e.clientX / window.innerWidth ) * 2 - 1
	pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

	// look for collision of mouse and model
	mouseCollide(e)
}

/*
function setupGUI()
{
	opts =
	{
		velx: 0,
		vely: 0,
		camera: {
			speed: 0.0001
		},
		stop: () => {
			this.velx = 0
			this.vely = 0
		},
		reset: () => {
			this.velx = 0.1
			this.vely = 0.1
			camera.position.z = 75
			camera.position.x = 0
			camera.position.y = 0
			cube.scale.x = 1
			cube.scale.y = 1
			cube.scale.z = 1
			cube.material.wireframe = true
		}
	}

	ambientLight = new THREE.AmbientLight(0x000000)
	scene.add(ambientLight)

	light1 = new THREE.PointLight(0xffffff, 1, 0)
	light1.position.set(0, 200, 0)
	scene.add(light1)

	light2 = new THREE.PointLight(0xffffff, 1, 0)
	light2.position.set(100, 200, 100)
	scene.add(light2)

	light3 = new THREE.PointLight(0xffffff, 1, 0)
	light3.position.set(-100, -200, -100)
	scene.add(light3)

	// load gui functions, call guiscene once done
	//loadJS('gui.js', () => { guiScene(gui, scene) })
	guiScene(gui, scene)
}
//*/

function setupCanvas()
{
	resize()
	document.body.appendChild(renderer.domElement)
	window.addEventListener('resize', resize)

	canvas = document.getElementsByTagName('canvas')[0]
  context = canvas.getContext('2d')
}

function setupAnimation()
{
	window.addEventListener('click', (e) => {
		wt._animate = !wt._animate
		if (wt._animate)
			wt._animTime = Date.now()
	})
}

function setupLighting()
{
	//scene.background = new THREE.Color(0x444444)
	scene.environment = pmremGen.fromScene(new THREE.RoomEnvironment(), 0).texture//0.04

	//*
	const spotlight = new THREE.SpotLight()
	//spotlight.position.set(0,0,100)
	//spotlight.position.set(50, 10, 200)
	spotlight.position.set(-50, 0, 200)
	scene.add(spotlight)
	//*/

	/*
	const amblight = new THREE.AmbientLight(0x9f3aa6, 1)
	//const amblight = new THREE.AmbientLight(0xffffff, 1)
	//const amblight = new THREE.AmbientLight(0x404040, 0.2) // soft white light
	//const amblight = new THREE.AmbientLight(0x000000, 1)
	amblight.position.set(100,0,0)
	scene.add(amblight)
	//*/

	/*
	light1 = new THREE.PointLight(0xffffff, 1, 0)
	light1.position.set(0, 200, 0)
	scene.add(light1)
	//*/

	/*
	light2 = new THREE.PointLight(0xffffff, 1, 0)
	light2.position.set(100, 200, 100)
	scene.add(light2)
	//*/

	/*
	light3 = new THREE.PointLight(0xffffff, 1, 0)
	light3.position.set(-100, -200, -100)
	scene.add(light3)
	//*/
}

// favicon setup
function setupFav()
{
	link = td.querySelector('link[rel~=icon]')
	if (!link)
	{
		link = document.createElement('link')
		//link.href = '/favicon.ico'
		link.id = '_pslink'
		link.rel = 'icon'
		td.getElementsByTagName('head')[0].appendChild(link)
	}

	// evade chrome's history object throttling by using multiple iframes as independent frame runners
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1038223
  if (!safari)
    for (let i = 0; i < runners; i++)
    {
      // code to inject into sub iframe
      let subcode = `<!DOCTYPE html><html><head></head><body><script>window.top.addEventListener('message',(e)=>{/*window.top.console.log('m${i}',e.data);*/if(e.data.psmiley===true&&e.data.runner===${i}){history.replaceState(null,null)}})</script></body></html>`
      /*
      let subcode = `
        <!DOCTYPE html>
        <html>
          <head></head>
          <body>
            <script>
              window.top.addEventListener('message', (e) => {
                if (e.data.psmiley === true && e.data.runner === ${i})
                  history.replaceState(null, null)
              })
            </script>
          </body>
        </html>
      `
      */

      // generate subframe
      let ifr = d.createElement('iframe')
      ifr.style.visibility = 'hidden'
      ifr.style.position = 'absolute'
      d.body.appendChild(ifr)

      // XXX don't use .write...
      // inject code into subframe
      ifr.contentWindow.document.open()
      ifr.contentWindow.document.write(subcode)
      ifr.contentWindow.document.close()
    }

	// tell frame runners to trigger history update and thus update tab strip including favicon
	window.top.setInterval((e) => {
		link.href = wt._datauri
		window.top.postMessage({ psmiley: true, runner: runnerInd++ % runners }, location.origin)
	}, parseInt(1000/60))

	// handle when page switches tabs/visiblity
	document.addEventListener('visibilitychange', pageVisChange, false)
}

function setupSTL(cb)
{
	loader.load('./psmileybin.stl', (geometry) =>
	{
		let matPVals =
		{
			color: 0x04adf6,
			emissive: 0x070208,
			specular: 0x6600ff,
			shininess: 100,
			flatShading: false,
			wireframe: false,
			vertexColors: false,
			fog: false,
			map: null,
			alphaMap: null,
			reflectivity: 0.3,
			refractionRatio: 0.3,
		}

		let matSVals =
		{
			depthTest: true,
			depthWrite: true,
			color: 0x04adf6,
			//color: 0x9f3aa6,
			//emissive: 0x000000,
			emissive: 0x070208,
			roughness: 0.4,//0.173,
			metalness: 0.9,//0.695,
			flatShading: false,
			wireframe: false,
			vertexColors: true,
			fog: false,
			envMap: null,
			map: null,
			roughnessMap: null,
			alphaMap: null,

			//envMap: envMap, // important -- especially for metals!
		}

		const material = new THREE.MeshPhongMaterial(matPVals)
		//const	material = new THREE.MeshStandardMaterial(matSVals)

		//gui.__controllers[i].setValue(gui.__controllers[i])
		//gui.__controllers.forEach(controller => controller.setValue(controller.initialValue))
		psmiley = new THREE.Mesh(geometry, material)

		// change color over time
	  /*
		setInterval(function() {
			let hsl = rgbToHsl(matSVals.color)
			hsl.h += 1
			matSVals.color = hslToRgb(hsl)
			psmiley.material = new THREE.MeshStandardMaterial(matSVals)
		}, 50)
		//*/

		// XXX gui use right values
		//psmiley.material = chooseFromHashPs(gui, psmiley, geometry, 'MeshPhongMaterial')
		//psmiley.material = { ...matVals, ...psmiley.material }
		//Object.assign(psmiley.material, psmiley.material, matVals)
		psmiley.position.set(0, 0, 0)
		psmiley.scale.set(10, 10, 10)
		psmiley.castShadow = true
		psmiley.receiveShadow = true

		geometry.center()
		scene.add(psmiley)

		// put in center
		centerObject(psmiley)

		// callback
		if (cb)
			cb()
	})
}

function setupMouseOrbit()
{
	td.addEventListener('wheel', (e) =>
	{
		if (wt._orbit)
		{
			// delay our animation for a second
			wt._animTime = Date.now() + animRotDelay
			//console.log(e.deltaY, e.deltaY, e.deltaZ, e.deltaMode)

			// mouse/pointer has moved and orbiting enabled
			//psmiley.rotateZ(e.movementZ * mouseOrbitScale)
			psmiley.rotateZ(window.scrollY * mouseOrbitScale)
		}
	})
	td.addEventListener('pointermove', (e) =>
	{
		if (wt._orbit)
		{
			// delay our animation for a second
			wt._animTime = Date.now() + animRotDelay
			
			// mouse/pointer has moved and orbiting enabled
			psmiley.rotateX(e.movementX * mouseOrbitScale)
			psmiley.rotateY(e.movementY * mouseOrbitScale)
		}
	})
}

function resize()
{
	setWH()
	renderer.setSize(width, height)
	camera.aspect = width / height

	// XXX there may be other camera values to update based on w/h
	camera.updateProjectionMatrix()
}

function centerObject(object)
{
	const boundingBox = new THREE.Box3()

	boundingBox.setFromObject(object)

	const center = boundingBox.getCenter(new THREE.Vector3())
	const size = boundingBox.getSize(new THREE.Vector3())
	const maxSize = Math.max(size.x, size.y, size.z)
	let newPositionCamera = new THREE.Vector3(maxSize, maxSize, maxSize)
	camera.zoom = 4
	camera.left = -(2 * maxSize)
	camera.bottom = -(2 * maxSize)
	camera.top = 2 * maxSize
	camera.right = 2 * maxSize
	camera.near = -maxSize * 4
	camera.far = maxSize * 4

	// camera
	/*
		camera.position.set(
		 newPositionCamera.x,
		 newPositionCamera.y,
		 newPositionCamera.z
		)
		 */
	camera.lookAt(0, 0, 0)
	camera.updateProjectionMatrix()

	// log original rotation
	origrot = {x: psmiley.rotation.x, y: psmiley.rotation.y, z: psmiley.rotation.z}
}

function setWH()
{
	wh = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight
	// for now force size to 192x192 to speed up rendering and screenshots
	wh = 192 // XXX
	width = height = wh

	//width = window.innerWidth
	//height = window.innerHeight

	windowHalfX = width / 2
	windowHalfY = height / 2
}

// look for mouse collisions with models (interaction)
function mouseCollide(e)
{
	raycaster.setFromCamera(pointer, camera)

	// create an array containing all objects in the scene with which the ray intersects
	let intersects = raycaster.intersectObjects(scene.children)

	// INTERSECTED = the object in the scene currently closest to the camera
	//		and intersected by the Ray projected from the mouse position

	// if there is one (or more) intersections
	if (intersects.length > 0)
	{
		// if the closest object intersected is not the currently stored intersection object
		if (intersects[ 0 ].object != INTERSECTED)
		{
		    // restore previous intersection object (if it exists) to its original color
			if (INTERSECTED)
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
			// set a new color for closest object
			INTERSECTED.material.color.setHex(0x001155)
			//INTERSECTED.material.flatShading = true
			mouseMovedOnHowdy(e)
		}
	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if (INTERSECTED)
		{
			//INTERSECTED.material.flatShading = false
			INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
			offsetX = 0
			offsetY = 0
		}
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null
	}

}

function ms()
{
	return Date.now()
}

function loop()
{
	requestAnimationFrame(loop)

	// begin rendering
	if (wt._animate && Date.now() >= wt._animTime)
	{
		// first time animating
		if (!lastpause)
		{
			lastpause = ms()
		}

		psmiley.rotation.x += xAnimRot
		psmiley.rotation.y += yAnimRot
		psmiley.rotation.z += zAnimRot

		// XXX this could be buggy based off amount of rotation
		// if we're in the original rotation, let's wait X seconds before starting again
		//if ((psmiley.rotation.x % TAU / TAU) >= 0.99 &&
		//		(psmiley.rotation.y % TAU / TAU) >= 0.99)
		if ((psmiley.rotation.x % TAU / TAU) < .1 &&
				(psmiley.rotation.y % TAU / TAU) < .1 &&
				(psmiley.rotation.z % TAU / TAU) < .1)
		{
			// we're near our starting location
			// only reanimate again if we haven't paused in the last rotation delay * 1.5
			if (ms() - lastpause > animRotDelay * 1.5)
			{
				// handle callbacks
				while (onAnimEnd.length)
					(onAnimEnd.shift())()

				lastpause = ms()
				wt._animate = 0
				wt._animTime = Date.now() + animRotDelay
				setTimeout(() => { wt._animate = 1 }, animRotDelay)
			}
		}
	}

	// render
	renderer.render(scene, camera)

	// store our canvas data URI directly after the render
	// this will be pulled out from multiple iframe runners
	wt._datauri = canvasScrape()

	// if first time rendering, grab a snap
	if (!origuri)
	{
		origuri = wt._datauri
	}
}

function canvasScrape()
{
	// png is faster than webp and jpeg, quality doesn't seem to adjust time
	return canvas.toDataURL('image/png', 1.0)
}

function pageVisChange()
{
	// set favicon to original
	if (document.visibilityState === 'hidden')
		// XXX would be nice to animate back home
		link.href = wt._datauri = origuri
}

// load js file
function loadJS(js, cb)
{
	let script = document.createElement('script')
	script.src = js

	if (typeof cb === 'function')
		script.onload = cb

	document.documentElement.firstChild.appendChild(script)
}
