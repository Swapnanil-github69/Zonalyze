import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ArchitecturalSurroundingsSceneProps {
  className?: string;
}

export const ArchitecturalSurroundingsScene: React.FC<ArchitecturalSurroundingsSceneProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 1000);
    camera.position.set(140, 160, 170);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // 1. Ground Surface (Midnight Navy #0B1D2A Architectural Plate)
    const groundGeo = new THREE.BoxGeometry(210, 4, 210);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1d2a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -2;
    ground.receiveShadow = true;
    cityGroup.add(ground);

    // 2. Restrained Coordinate Grid (Muted Blue Grey #91B9C5)
    const grid = new THREE.GridHelper(200, 20, 0x91b9c5, 0x123747);
    (grid.material as THREE.Material).opacity = 0.16;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = 0.05;
    cityGroup.add(grid);

    // 3. Water Body (Ocean Blue #245568)
    const waterGeo = new THREE.PlaneGeometry(32, 206);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x245568,
      roughness: 0.3,
      metalness: 0.2,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(65, 0.08, 0);
    water.receiveShadow = true;
    cityGroup.add(water);

    // 4. Roads (Deep Corridors)
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x06151f,
      roughness: 0.9,
    });
    const createRoad = (w: number, l: number, x: number, z: number, rotY = 0) => {
      const rGeo = new THREE.PlaneGeometry(w, l);
      const rMesh = new THREE.Mesh(rGeo, roadMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.rotation.z = rotY;
      rMesh.position.set(x, 0.12, z);
      rMesh.receiveShadow = true;
      cityGroup.add(rMesh);
    };

    createRoad(14, 200, -10, 0);
    createRoad(200, 14, 0, 15);
    createRoad(10, 200, -65, 0);
    createRoad(200, 10, 0, -50);
    createRoad(10, 140, 30, -30, Math.PI / 4);

    // 5. Green Spaces (Geographic Sage #A8C8B5)
    const parkMat = new THREE.MeshStandardMaterial({
      color: 0x1b3830,
      roughness: 0.85,
    });
    const park = new THREE.Mesh(new THREE.PlaneGeometry(42, 46), parkMat);
    park.rotation.x = -Math.PI / 2;
    park.position.set(18, 0.15, -18);
    park.receiveShadow = true;
    cityGroup.add(park);

    const pocketPark = new THREE.Mesh(new THREE.PlaneGeometry(28, 32), parkMat);
    pocketPark.rotation.x = -Math.PI / 2;
    pocketPark.position.set(-38, 0.15, 45);
    pocketPark.receiveShadow = true;
    cityGroup.add(pocketPark);

    // Small Tree Elements
    const treeGeo = new THREE.ConeGeometry(2.4, 6, 6);
    const treeMat = new THREE.MeshStandardMaterial({
      color: 0x142a24,
      roughness: 0.8,
    });
    const treeLocations = [
      [10, -10],
      [16, -22],
      [24, -14],
      [30, -26],
      [12, -30],
      [-32, 40],
      [-42, 48],
      [-36, 52],
      [-44, 38],
    ];
    treeLocations.forEach(([tx, tz]) => {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      tree.position.set(tx, 3.1, tz);
      tree.castShadow = true;
      cityGroup.add(tree);
    });

    // 6. Buildings with Varied Proportions (Dark Teal #0D3442 & Ocean Blue #245568)
    const bGeo = new THREE.BoxGeometry(1, 1, 1);
    const bMatDark = new THREE.MeshStandardMaterial({
      color: 0x0d3442,
      roughness: 0.7,
      metalness: 0.2,
    });
    const bMatAccent = new THREE.MeshStandardMaterial({
      color: 0x123747,
      roughness: 0.65,
      metalness: 0.25,
    });
    const bMatLight = new THREE.MeshStandardMaterial({
      color: 0x245568,
      roughness: 0.6,
      metalness: 0.3,
    });

    const buildingData: [number, number, number, number, number][] = [
      // Central West Cluster
      [-36, -16, 16, 28, 16],
      [-36, 10, 18, 42, 18],
      [-36, 40, 14, 20, 14],
      // Far West Corridor
      [-82, -16, 14, 22, 14],
      [-82, 10, 16, 32, 16],
      [-82, 40, 14, 18, 14],
      // Central Plaza Enclave
      [16, 42, 18, 46, 18],
      [16, 72, 16, 26, 16],
      [-36, -72, 18, 30, 18],
      [16, -72, 16, 24, 16],
      // Waterfront Promenade
      [38, 38, 16, 34, 16],
      [38, 68, 14, 26, 14],
      [38, -50, 14, 22, 14],
    ];

    buildingData.forEach(([bx, bz, bw, bh, bd], idx) => {
      const mat = idx % 3 === 0 ? bMatDark : idx % 2 === 0 ? bMatAccent : bMatLight;
      const bMesh = new THREE.Mesh(bGeo, mat);
      bMesh.scale.set(bw, bh, bd);
      bMesh.position.set(bx, bh / 2 + 0.15, bz);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      cityGroup.add(bMesh);
    });

    // 7. Selected Location Marker (AI Cyan #78D6E7 Halo)
    const markerGroup = new THREE.Group();
    markerGroup.position.set(-10, 0, 15);

    const haloGeo = new THREE.RingGeometry(3, 4.4, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x78d6e7,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.22;
    markerGroup.add(halo);

    const postGeo = new THREE.CylinderGeometry(0.35, 0.35, 24, 16);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      metalness: 0.5,
      roughness: 0.25,
    });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 12;
    post.castShadow = true;
    markerGroup.add(post);

    const sphereGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      roughness: 0.2,
      metalness: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 25;
    sphere.castShadow = true;
    markerGroup.add(sphere);

    const pipGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const pipMat = new THREE.MeshBasicMaterial({ color: 0x78d6e7 });
    const pip = new THREE.Mesh(pipGeo, pipMat);
    pip.position.y = 25;
    markerGroup.add(pip);

    cityGroup.add(markerGroup);

    // 8. Natural Atmospheric Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xe8f0f1, 0x0b1d2a, 1.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xe8f0f1, 1.8);
    dirLight.position.set(130, 170, 95);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // 9. Pointer Interaction & Gentle Camera Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.35;
      mouseY = y * 0.25;
    };
    container.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetRotationY = time * 0.03 + mouseX;
      targetRotationX = mouseY;

      cityGroup.rotation.y += (targetRotationY - cityGroup.rotation.y) * 0.04;
      cityGroup.rotation.x += (targetRotationX - cityGroup.rotation.x) * 0.04;

      const pulse = Math.sin(time * 2.5) * 0.12 + 1;
      halo.scale.set(pulse, pulse, 1);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || 560;
      const h = containerRef.current.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      groundGeo.dispose();
      groundMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      roadMat.dispose();
      parkMat.dispose();
      treeGeo.dispose();
      treeMat.dispose();
      bGeo.dispose();
      bMatDark.dispose();
      bMatAccent.dispose();
      bMatLight.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      postGeo.dispose();
      postMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      pipGeo.dispose();
      pipMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-[420px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden bg-[#0B1D2A] border border-white/[0.16] shadow-2xl ${className}`}
    >
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Subtle Legend */}
      <div className="absolute top-4 left-4 z-10 bg-[#0B1D2A]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.16] text-left flex flex-wrap items-center gap-3 text-[11px] font-sans text-[#F4F7F8]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#123747] border border-white/20" />
          <span className="font-medium text-[#A8C0CA]">Buildings</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#06151f]" />
          <span className="font-medium text-[#A8C0CA]">Roads</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1b3830]" />
          <span className="font-medium text-[#A8C0CA]">Green Spaces</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#78D6E7]" />
          <span className="font-semibold text-white">Location</span>
        </div>
      </div>

      {/* Bottom Editorial Caption */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#0B1D2A]/90 backdrop-blur-md px-4 py-3 rounded-xl border border-white/[0.16] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-left">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#78D6E7] uppercase font-semibold block">
            ARCHITECTURAL CONTEXT MODEL
          </span>
          <span className="text-xs text-[#F4F7F8] font-sans font-medium">
            Physical scale spatial simulation of built form & open buffers.
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#91B9C5] bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.16] shrink-0 font-medium">
          Multi-Layered Simulation
        </span>
      </div>
    </div>
  );
};
