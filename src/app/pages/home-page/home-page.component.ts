import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GroundProjectedEnv } from 'three/examples/jsm/objects/GroundProjectedEnv';
import { Pane } from 'tweakpane';
import { Reflector } from 'three/examples/jsm/objects/Reflector';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef: ElementRef;

  //* Stage Properties

  @Input() public fieldOfView: number = 75;

  @Input('nearClipping') public nearClippingPane: number = 0.01;

  @Input('farClipping') public farClippingPane: number = 1000;

  //? Scene properties
  private width: number = window.innerWidth;

  private height: number = window.innerHeight / 2;

  private camera: THREE.PerspectiveCamera;

  private controls: OrbitControls;

  private ambientLight: THREE.AmbientLight;

  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  public colorSelection: String = '#c8823c';
  public frameColor: String = '#FFDD00';

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: any;

  private lens: any;
  private frame: any;
  private earLeft: any;
  private earRight: any;
  private earRightBack: any;
  private earLeftBack: any;
  private nose: any;
  private directionalLight: THREE.DirectionalLight;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();

  private renderer: THREE.WebGLRenderer;

  private cubeLoader = new THREE.CubeTextureLoader();

  private scene: THREE.Scene;

  // public pane = new Pane();

  /**
   *Animate the model
   *
   * @private
   * @memberof HomePageComponent
   */
  private animateModel() {
    if (this.model) {
      // this.model.rotation.z += 0.005;
    }
  }

  /**
   *create controls
   *
   * @private
   * @memberof HomePageComponent
   */
  private createControls = () => {
    const renderer = new CSS2DRenderer({
      element: this.canvasRef.nativeElement,
    });

    renderer.setSize(this.width, this.height);
    // renderer.domElement.style.position = 'absolute';
    // renderer.domElement.style.top = '0px';
    // document.body.appendChild(renderer.domElement);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
    // this.controls.maxDistance = 80;
    // this.controls.minDistance = 20;
    // this.controls.target.set(0, -5, 0);
    this.controls.update();
  };

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  public params = {
    clearcoat: 1,
    clearcoatRoughness: 0.39,
    metalness: 0.4,
    color: { r: 255, g: 0, b: 0 },
  };

  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // this.scene.background = new THREE.Color(0xd4d4d8);

    let envoronmentMap = this.cubeLoader.load([
      '/assets/nature/px.png',
      '/assets/nature/nx.png',
      '/assets/nature/py.png',
      '/assets/nature/ny.png',
      '/assets/nature/pz.png',
      '/assets/nature/nz.png',
    ]);
    // envoronmentMap.mapping = THREE.EquirectangularReflectionMapping;
    // envoronmentMap.encoding = THREE.sRGBEncoding;
    let env = new GroundProjectedEnv(
      envoronmentMap
      //   {
      //   height: 1,
      // }
    );
    env.scale.setScalar(100);
    this.scene.add(env);

    this.scene.background = envoronmentMap;

    this.loaderGLTF.load('assets/RAYBAN.glb', (gltf: GLTF) => {
      this.model = gltf.scene;

      // this.model.position.y = -5;
      this.lens = gltf.scene.children.find((child) => child.name === 'lens');
      this.frame = gltf.scene.children.find((child) => child.name === 'frame');

      this.earLeft = gltf.scene.children.find(
        (child) => child.name === 'earleft'
      );
      this.earRight = gltf.scene.children.find(
        (child) => child.name === 'earRight'
      );
      this.nose = gltf.scene.children.find((child) => child.name === 'nose');

      this.earLeftBack = gltf.scene.children.find(
        (child) => child.name === 'earleftBack'
      );
      this.earRightBack = gltf.scene.children.find(
        (child) => child.name === 'earRightBack'
      );

      let frameMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#D3B13D'),
        metalness: 1,
        roughness: 0.2,
        side: THREE.FrontSide,
        envMap: envoronmentMap,
      });
      let backMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#3B3930'),
        metalness: 0.5,
        roughness: 0.6,
        side: THREE.FrontSide,
        envMap: envoronmentMap,
      });

      let lensMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#b8b8b8'),
        metalness: 0.66,
        roughness: 0.16,
        envMap: envoronmentMap,
        // roughness: 0.2,
        // envMap: cubeRenderTarget.texture,
        transparent: true,
        opacity: 0.8,
        transmission: 0.6,

        // transmission: 0.1,
        side: THREE.FrontSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.39,
      });
      let noseMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        metalness: 0,
        roughness: 0.56,
        envMap: envoronmentMap,
        // roughness: 0.2,
        // envMap: cubeRenderTarget.texture,
        transparent: true,
        opacity: 0.8,
        transmission: 0.6,

        // transmission: 0.1,
        side: THREE.FrontSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.39,
      });
      this.frame.material = frameMaterial;
      this.earLeft.material = frameMaterial;
      this.earRight.material = frameMaterial;
      this.earLeftBack.material = backMaterial;
      this.earRightBack.material = backMaterial;
      this.nose.material = noseMaterial;

      this.lens.material = lensMaterial;
      this.lens.material.thickness = 0.05;
      // this.pane
      //   .addInput(this.camera.position, 'x', { min: -3, max: 3 })
      //   .on('change', () => {
      //     this.camera.updateProjectionMatrix();
      //     this.controls.update();
      //   });
      // this.pane
      //   .addInput(this.camera.position, 'y', { min: -3, max: 3 })
      //   .on('change', () => {
      //     this.camera.updateProjectionMatrix();
      //     this.controls.update();
      //   });
      // this.pane
      //   .addInput(this.camera.position, 'z', {
      //     min: -3,
      //     max: 3,
      //   })
      //   .on('change', () => {
      //     this.camera.updateProjectionMatrix();
      //     this.controls.update();
      //   });
      // this.pane.addInput(this.lens.material, 'thickness', { min: 0, max: 1 });
      // this.pane.addInput(this.params, 'color').on('change', () => {
      //   this.lens.material.color.setRGB(
      //     this.params.color.r / 255,
      //     this.params.color.g / 255,
      //     this.params.color.b / 255
      //   );
      // this.lens.material.needsUpdate = true;
      // console.log(this.lens.material);
      // });

      // console.log(this.model);
      // var box = new THREE.Box3().setFromObject(this.model);
      // box.getCenter(this.model.position); // this re-sets the mesh position
      // this.model.position.multiplyScalar(-1);
      this.scene.add(
        this.frame,
        this.lens,
        this.earLeft,
        this.earRight,
        this.earLeftBack,
        this.earRightBack,
        this.nose
      );
    });
    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.x = 0.2523;
    this.camera.position.y = 0.15;
    this.camera.position.z = 0.2608695652;

    const groundMirror = new Reflector(new THREE.PlaneGeometry(50, 50), {
      color: new THREE.Color(0x8c8c8c),
      textureWidth: this.width * window.devicePixelRatio,
      textureHeight: this.height * window.devicePixelRatio,
    });
    groundMirror.position.y = -0.015;
    groundMirror.rotateX(-Math.PI / 2);
    // groundMirror.layers.set(1);
    this.scene.add(groundMirror);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    this.directionalLight.position.set(0, 1, 0);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.light1 = new THREE.PointLight(0xffffff, 1);
    this.light1.position.set(0, 200, 400);
    this.scene.add(this.light1);
    // this.light2 = new THREE.PointLight(0x4b371c, 10);
    // this.light2.position.set(500, 100, 0);
    // this.scene.add(this.light2);
    this.light3 = new THREE.PointLight(0xffffff, 1);
    this.light3.position.set(0, 100, -500);
    this.scene.add(this.light3);
    // this.light4 = new THREE.PointLight(0x4b371c, 10);
    // this.light4.position.set(-500, 300, 500);
    // this.scene.add(this.light4);
  }

  private getAspectRatio() {
    return this.width / this.height;
    // return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof CubeComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(
      window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio
    );
    // this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setSize(this.width, this.height);
    let component: HomePageComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.animateModel();
      requestAnimationFrame(render);
    })();
  }

  public setLensColor() {
    const r = parseInt(this.colorSelection.substr(1, 2), 16);
    const g = parseInt(this.colorSelection.substr(3, 2), 16);
    const b = parseInt(this.colorSelection.substr(5, 2), 16);
    // console.log(r, g, b);
    this.lens.material.color.setRGB(r / 255, g / 255, b / 255);
  }
  public setframeColor() {
    const r = parseInt(this.frameColor.substr(1, 2), 16);
    const g = parseInt(this.frameColor.substr(3, 2), 16);
    const b = parseInt(this.frameColor.substr(5, 2), 16);
    // console.log(r, g, b);
    this.frame.material.color.setRGB(r / 255, g / 255, b / 255);
    this.earLeft.material.color.setRGB(r / 255, g / 255, b / 255);
    this.earRight.material.color.setRGB(r / 255, g / 255, b / 255);
  }

  private sceneTraverse(obj: THREE.Object3D, fn: Function) {
    if (!obj) return;

    fn(obj);
    if (obj.children?.length > 0) {
      obj.children.forEach((o) => {
        this.sceneTraverse(o, fn);
      });
    }
  }
  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight / 2;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(
      window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio
    );

    // this.renderer.render(this.scene, this.camera);
  }
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
    window.addEventListener('resize', () => this.resize());
  }
  ngOnDestroy(): void {
    this.sceneTraverse(this.scene, (o: any) => {
      if (o.geometry) {
        o.geometry.dispose();
      }
      if (o.material) {
        if (o.material.length) {
          for (let i = 0; i < o.material.length; ++i) {
            o.material[i].dispose();
          }
        } else {
          o.material.dispose();
        }
      }
    });
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    window.removeEventListener('resize', this.resize);
  }
}
