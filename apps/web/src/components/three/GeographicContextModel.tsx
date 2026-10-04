import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface GeographicContextModelProps {
  className?: string;
}

export const GeographicContextModel: React.FC<GeographicContextModelProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 1000);
    camera.position.set(130, 140, 150);
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

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 1. Terrain Ground Surface (Midnight Navy #0B1D2A Architectural Plate)
    const groundGeo = new THREE.BoxGeometry(190, 3, 190);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1d2a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    modelGroup.add(ground);

    // 2. Coordinate Grid Lines (Muted Blue Grey #91B9C5)
    const gridHelper = new THREE.GridHelper(180, 18, 0x91b9c5, 0x123747);
    (gridHelper.material as THREE.Material).opacity = 0.18;
    (gridHelper.material as THREE.Material).transparent = true;
    gridHelper.position.y = 0.05;
    modelGroup.add(gridHelper);

    // 3. Concentric Distance Rings (500m, 1000m, 1500m contextual buffers)
    const createRing = (radius: number, color: number, opacity: number) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.4, radius + 0.4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.08;
      modelGroup.add(ring);
    };

    createRing(30, 0x78d6e7, 0.45);
    createRing(58, 0x91b9c5, 0.25);
    createRing(82, 0x245568, 0.18);

    // 4. Muted Geographic Blue Waterway (Ocean Blue #245568)
    const waterCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-90, 0.1, -45),
      new THREE.Vector3(-45, 0.1, -10),
      new THREE.Vector3(10, 0.1, 15),
      new THREE.Vector3(50, 0.1, 40),
      new THREE.Vector3(90, 0.1, 60),
    ]);
    const waterPoints = waterCurve.getPoints(50);
    const waterShape = new THREE.Shape();
    waterShape.moveTo(-90, -52);
    waterPoints.forEach((p: THREE.Vector3) => waterShape.lineTo(p.x, p.z));
    waterShape.lineTo(90, 72);
    waterShape.lineTo(90, 52);
    for (let i = waterPoints.length - 1; i >= 0; i--) {
      waterShape.lineTo(waterPoints[i].x, waterPoints[i].z - 14);
    }
    waterShape.closePath();

    const waterGeo = new THREE.ShapeGeometry(waterShape);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x245568,
      roughness: 0.3,
      metalness: 0.2,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = 0.09;
    waterMesh.receiveShadow = true;
    modelGroup.add(waterMesh);

    // 5. Roads / Street Arterials (Deep Corridors)
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x06151f,
      roughness: 0.9,
    });
    const addRoad = (w: number, l: number, x: number, z: number, rotY = 0) => {
      const rGeo = new THREE.PlaneGeometry(w, l);
      const rMesh = new THREE.Mesh(rGeo, roadMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.rotation.z = rotY;
      rMesh.position.set(x, 0.12, z);
      rMesh.receiveShadow = true;
      modelGroup.add(rMesh);
    };

    addRoad(10, 180, 0, 0, 0);
    addRoad(180, 9, 0, 0, 0);
    addRoad(7, 180, -45, 0, 0);
    addRoad(180, 7, 0, 45, 0);
    addRoad(7, 120, 35, -20, Math.PI / 6);

    // 6. Natural Green Spaces & Parks (Geographic Sage #A8C8B5)
    const parkMat = new THREE.MeshStandardMaterial({
      color: 0x1b3830,
      roughness: 0.85,
    });
    const addPark = (w: number, d: number, x: number, z: number) => {
      const pGeo = new THREE.PlaneGeometry(w, d);
      const pMesh = new THREE.Mesh(pGeo, parkMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(x, 0.14, z);
      pMesh.receiveShadow = true;
      modelGroup.add(pMesh);
    };

    addPark(34, 38, 26, -26);
    addPark(28, 30, -32, 28);
    addPark(22, 22, -62, -28);

    // Trees inside parks
    const treeGeo = new THREE.ConeGeometry(2, 5, 5);
    const treeMat = new THREE.MeshStandardMaterial({
      color: 0x142a24,
      roughness: 0.8,
    });
    const treePositions = [
      [18, -20],
      [24, -30],
      [32, -18],
      [36, -32],
      [-26, 22],
      [-36, 32],
      [-30, 36],
      [-60, -25],
      [-65, -30],
    ];
    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      tree.position.set(tx, 2.5, tz);
      tree.castShadow = true;
      modelGroup.add(tree);
    });

    // 7. Architectural Building Masses (Dark Teal #0D3442 & Ocean Blue #245568)
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
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

    const buildingBlocks: [number, number, number, number, number][] = [
      [-22, -22, 14, 18, 14],
      [-22, -40, 12, 12, 12],
      [-38, -22, 12, 14, 12],
      [-38, -40, 14, 22, 14],
      [-22, 18, 12, 16, 12],
      [-22, 38, 10, 12, 10],
      [-60, 20, 14, 10, 14],
      [-60, 42, 12, 14, 12],
      [22, -54, 14, 20, 14],
      [42, -54, 12, 16, 12],
      [22, 22, 14, 26, 14],
      [22, 42, 12, 18, 12],
      [42, 22, 12, 14, 12],
      [42, 42, 14, 22, 14],
      [65, 25, 12, 12, 12],
    ];

    buildingBlocks.forEach(([bx, bz, bw, bh, bd], idx) => {
      const mat = idx % 3 === 0 ? bMatDark : idx % 2 === 0 ? bMatAccent : bMatLight;
      const bMesh = new THREE.Mesh(buildingGeo, mat);
      bMesh.scale.set(bw, bh, bd);
      bMesh.position.set(bx, bh / 2 + 0.15, bz);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      modelGroup.add(bMesh);
    });

    // 8. Focal Selected Geographic Point Marker
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, 0, 0);

    const footRingGeo = new THREE.RingGeometry(3, 4.2, 32);
    const footRingMat = new THREE.MeshBasicMaterial({
      color: 0x78d6e7,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const footRing = new THREE.Mesh(footRingGeo, footRingMat);
    footRing.rotation.x = -Math.PI / 2;
    footRing.position.y = 0.2;
    pinGroup.add(footRing);

    const stemGeo = new THREE.CylinderGeometry(0.35, 0.35, 24, 16);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      metalness: 0.5,
      roughness: 0.25,
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 12;
    stem.castShadow = true;
    pinGroup.add(stem);

    const beaconGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      roughness: 0.2,
      metalness: 0.4,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 24;
    beacon.castShadow = true;
    pinGroup.add(beacon);

    const innerPipGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const innerPipMat = new THREE.MeshBasicMaterial({ color: 0x78d6e7 });
    const innerPip = new THREE.Mesh(innerPipGeo, innerPipMat);
    innerPip.position.y = 24;
    pinGroup.add(innerPip);

    modelGroup.add(pinGroup);

    // 9. Natural Atmospheric Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0xe8f0f1, 0x0b1d2a, 1.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xe8f0f1, 1.8);
    sunLight.position.set(100, 140, 80);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // 10. Mouse Interaction & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.4;
      mouseY = y * 0.3;
    };
    container.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetRotationY = time * 0.035 + mouseX;
      targetRotationX = mouseY;

      modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.05;
      modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * 0.05;

      const pulse = Math.sin(time * 3) * 0.15 + 1;
      footRing.scale.set(pulse, pulse, 1);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || 540;
      const h = containerRef.current.clientHeight || 440;
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
      buildingGeo.dispose();
      bMatDark.dispose();
      bMatAccent.dispose();
      bMatLight.dispose();
      footRingGeo.dispose();
      footRingMat.dispose();
      stemGeo.dispose();
      stemMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      innerPipGeo.dispose();
      innerPipMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden bg-[#0B1D2A] border border-white/[0.16] shadow-2xl group ${className}`}
    >
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Integrated Editorial Overlay Caption */}
      <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0B1D2A]/90 backdrop-blur-md border border-white/[0.16] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#78D6E7] uppercase font-semibold">
            GEOGRAPHIC CONTEXT
          </div>
          <div className="text-xs font-medium text-[#F4F7F8] font-sans">
            A layered architectural view of the surrounding built form and open envelopes.
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-[#91B9C5] bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.16] shrink-0 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#78D6E7]" />
          <span>Spatial Intelligence Model</span>
        </div>
      </div>
    </div>
  );
};
