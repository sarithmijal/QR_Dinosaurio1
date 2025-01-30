// Crear la escena
const scene = new THREE.Scene();

// Crear la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Posición de la cámara

// Crear el renderizador con mejor rendimiento
const renderer = new THREE.WebGLRenderer({ antialias: false }); // Desactivamos el antialiasing
renderer.setPixelRatio(window.devicePixelRatio * 0.5); // Reducimos la resolución para mejorar rendimiento
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Activa sombras para mayor realismo
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Usar sombras más simples
document.body.appendChild(renderer.domElement);

// Agregar iluminación optimizada
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Reduce la intensidad
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // Baja la intensidad
directionalLight.position.set(3, 5, 3);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Crear los controles de órbita para rotar la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Movimiento suave
controls.dampingFactor = 0.25; // Suavidad
controls.screenSpacePanning = false; // No permitir el desplazamiento fuera del plano
controls.maxPolarAngle = Math.PI / 2; // Limitar el ángulo de visión

// Cargar el modelo GLB con todas las animaciones
const loader = new THREE.GLTFLoader();
const animateMixers = [];
const clock = new THREE.Clock();

loader.load('models/pbr_velociraptor_animated (2).glb', function (gltf) {
    console.log('Modelo cargado correctamente');
    const model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(model);

    const mixer = new THREE.AnimationMixer(model);
    if (gltf.animations.length > 0) {
        gltf.animations.forEach((clip, index) => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity); // Permitir que se repita cada animación
            action.play(); // Activa todas las animaciones
            action.timeScale = 1.2; // Ajusta velocidad de animación
            console.log(`Animación ${index + 1}: ${clip.name}`);
        });
    }
    animateMixers.push(mixer);
}, undefined, function (error) {
    console.error('Error al cargar el modelo:', error);
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar las animaciones
    const delta = clock.getDelta();
    animateMixers.forEach((mixer) => {
        mixer.update(delta);
    });

    // Actualizar controles
    controls.update();
    renderer.render(scene, camera);
}

animate();
