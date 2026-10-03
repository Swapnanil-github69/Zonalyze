import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ExploreSpatialVisualProps {
  className?: string;
}

export const ExploreSpatialVisual: React.FC<ExploreSpatialVisualProps> = ({
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 1, 1000);
    camera.position.set(120, 130, 140);
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

    const group = new THREE.Group();
    scene.add(group);

    // 1. Terrain Ground Surface (Midnight Navy #0B1D2A Plate)
    const groundGeo = new THREE.BoxGeometry(170, 2.5, 170);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1d2a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.25;
    ground.receiveShadow = true;
    group.add(ground);

    // 2. Restrained Coordinate Grid Lines (Muted Blue Grey #91B9C5)
    const gridHelper = new THREE.GridHelper(160, 16, 0x91b9c5, 0x245568);
    (gridHelper.material as THREE.Material).opacity = 0.18;
    (gridHelper.material as THREE.Material).transparent = true;
    gridHelper.position.y = 0.04;
    group.add(gridHelper);

    // 3. Concentric Distance Buffer Rings (AI Cyan #78D6E7 & Muted Blue Grey)
    const createRing = (radius: number, color: number, opacity: number) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.35, radius + 0.35, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.06;
      group.add(ring);
    };

    createRing(30, 0x78d6e7, 0.45);
    createRing(55, 0x91b9c5, 0.25);

    // 4. Roads / Street Grid (Deep Ocean Teal #123747)
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x06151f,
      roughness: 0.9,
    });
    const addRoad = (w: number, l: number, x: number, z: number, rotY = 0) => {
      const rGeo = new THREE.PlaneGeometry(w, l);
      const rMesh = new THREE.Mesh(rGeo, roadMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.rotation.z = rotY;
      rMesh.position.set(x, 0.08, z);
      rMesh.receiveShadow = true;
      group.add(rMesh);
    };

    addRoad(8, 160, 0, 0, 0);
    addRoad(160, 8, 0, 0, 0);
    addRoad(6, 160, -36, 0, 0);
    addRoad(160, 6, 0, 36, 0);
    addRoad(6, 110, 28, -20, Math.PI / 5);

    // 5. Green Spaces & Parks (Geographic Sage #A8C8B5 Tone)
    const parkMat = new THREE.MeshStandardMaterial({
      color: 0x1b3830,
      roughness: 0.85,
    });
    const addPark = (w: number, d: number, x: number, z: number) => {
      const pGeo = new THREE.PlaneGeometry(w, d);
      const pMesh = new THREE.Mesh(pGeo, parkMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(x, 0.1, z);
      pMesh.receiveShadow = true;
      group.add(pMesh);
    };

    addPark(30, 32, 22, -22);
    addPark(24, 26, -26, 22);

    // 6. Architectural Building Masses (Dark Teal #0D3442 & Ocean Blue #245568)
    const bGeo = new THREE.BoxGeometry(1, 1, 1);
    const bMatDark = new THREE.MeshStandardMaterial({
      color: 0x0d3442,
      roughness: 0.65,
      metalness: 0.25,
    });
    const bMatAccent = new THREE.MeshStandardMaterial({
      color: 0x123747,
      roughness: 0.6,
      metalness: 0.3,
    });

    const buildingBlocks: [number, number, number, number, number][] = [
      [-18, -18, 12, 14, 12],
      [-18, -34, 10, 10, 10],
      [-32, -18, 10, 12, 10],
      [-18, 16, 10, 14, 10],
      [-18, 32, 8, 10, 8],
      [-48, 18, 12, 12, 12],
      [18, -45, 12, 16, 12],
      [36, -45, 10, 12, 10],
      [18, 18, 12, 20, 12],
      [18, 34, 10, 14, 10],
      [36, 18, 10, 12, 10],
      [36, 34, 12, 18, 12],
    ];

    buildingBlocks.forEach(([bx, bz, bw, bh, bd], idx) => {
      const mat = idx % 2 === 0 ? bMatDark : bMatAccent;
      const bMesh = new THREE.Mesh(bGeo, mat);
      bMesh.scale.set(bw, bh, bd);
      bMesh.position.set(bx, bh / 2 + 0.12, bz);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      group.add(bMesh);
    });

    // 7. Spatial Relationship Ray Lines (Connecting Center to Nodes)
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x78d6e7,
      dashSize: 2,
      gapSize: 1.5,
      opacity: 0.6,
      transparent: true,
    });

    const createRay = (start: THREE.Vector3, end: THREE.Vector3) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      group.add(line);
    };

    createRay(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(22, 0.2, -22));
    createRay(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(-36, 0.2, 0));
    createRay(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.2, 36));

    // 8. Focal Selected Location Pin
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, 0, 0);

    const haloGeo = new THREE.RingGeometry(2.5, 3.8, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x78d6e7,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.15;
    pinGroup.add(halo);

    const stemGeo = new THREE.CylinderGeometry(0.35, 0.35, 18, 16);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      metalness: 0.5,
      roughness: 0.25,
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 9;
    stem.castShadow = true;
    pinGroup.add(stem);

    const beaconGeo = new THREE.SphereGeometry(2.6, 32, 32);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7f8,
      roughness: 0.2,
      metalness: 0.4,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 19;
    beacon.castShadow = true;
    pinGroup.add(beacon);

    const innerPipGeo = new THREE.SphereGeometry(1.1, 16, 16);
    const innerPipMat = new THREE.MeshBasicMaterial({ color: 0x78d6e7 });
    const innerPip = new THREE.Mesh(innerPipGeo, innerPipMat);
    innerPip.position.y = 19;
    pinGroup.add(innerPip);

    group.add(pinGroup);

    // 9. Natural Atmospheric Daylight & Soft Fill
    const hemiLight = new THREE.HemisphereLight(0xe8f0f1, 0x0b1d2a, 1.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xe8f0f1, 1.8);
    sunLight.position.set(80, 120, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // 10. Mouse Interaction & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.3;
      mouseY = y * 0.2;
    };
    container.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetRotY = time * 0.03 + mouseX;
      targetRotX = mouseY;

      group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.05;

      const pulse = Math.sin(time * 2.8) * 0.15 + 1;
      halo.scale.set(pulse, pulse, 1);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || 520;
      const h = containerRef.current.clientHeight || 420;
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
      roadMat.dispose();
      parkMat.dispose();
      bGeo.dispose();
      bMatDark.dispose();
      bMatAccent.dispose();
      lineMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
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
      className={`relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden bg-[#0B1D2A] border border-white/[0.16] shadow-2xl ${className}`}
    >
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle Integrated Overlay Caption */}
      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#0B1D2A]/90 backdrop-blur-md border border-white/[0.16] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-left">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#78D6E7] uppercase font-semibold block">
            LOCATION CONTEXT MODEL
          </span>
          <span className="text-xs font-medium text-[#F4F7F8] font-sans">
            Built footprints, green spaces, transit axes, and radial proximity buffers.
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#91B9C5] bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.16] shrink-0 font-medium">
          Deterministic 3D Viewport
        </span>
      </div>
    </div>
  );
};
