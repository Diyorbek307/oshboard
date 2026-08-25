/* ============================================================
   ГЛОБУС МИРА в hero — вращаемый мышкой на 360°.

   Точки континентов заранее посчитаны из карты Земли и лежат в
   window.__GLOBE_DOTS (js/globe-data.js). Требует Three.js.

   Почему свой поворот, а не OrbitControls: контролов в r128 нет
   отдельным файлом, а нам нужен только «схватить и крутить» с
   инерцией и авто-вращением в покое — это два десятка строк.
   ============================================================ */
(function () {
  var cv = document.getElementById('globe');
  if (!cv || typeof THREE === 'undefined') return;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var host = cv.parentElement;
  var W = host.clientWidth, H = host.clientHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.z = 6.2;

  var renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H, false);

  function cssVar(n, d) {
    return (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d);
  }
  function accent() { return new THREE.Color(cssVar('--primary', '#F97316')); }

  var R = 2.35;
  var world = new THREE.Group();
  scene.add(world);

  /* матовый шар-океан */
  var ocean = new THREE.Mesh(
    new THREE.SphereGeometry(R, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0x0a1320, emissive: 0x060b12, shininess: 12, specular: 0x0c1a2c })
  );
  world.add(ocean);

  /* сетка параллелей/меридианов, еле видная */
  var grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(R * 1.001, 24, 16)),
    new THREE.LineBasicMaterial({ color: 0x1b3350, transparent: true, opacity: 0.35 })
  );
  world.add(grid);

  /* точки континентов из данных карты */
  function ll2v(lon, lat, r) {
    var phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(th),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(th)
    );
  }
  var DOTS = (window.__GLOBE_DOTS || []);
  var n = DOTS.length / 2;
  var lp = new Float32Array(n * 3);
  for (var i = 0; i < n; i++) {
    var v = ll2v(DOTS[i * 2], DOTS[i * 2 + 1], R * 1.012);
    lp[i * 3] = v.x; lp[i * 3 + 1] = v.y; lp[i * 3 + 2] = v.z;
  }
  var landGeo = new THREE.BufferGeometry();
  landGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  var landMat = new THREE.PointsMaterial({
    color: accent(), size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.95
  });
  var land = new THREE.Points(landGeo, landMat);
  world.add(land);

  /* атмосфера: свечение по краю через back-side */
  var glow = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.14, 48, 48),
    new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false,
      uniforms: { c: { value: accent() } },
      vertexShader:
        'varying float in_;void main(){vec3 nn=normalize(normalMatrix*normal);' +
        'vec3 e=normalize((modelViewMatrix*vec4(position,1.)).xyz);' +
        'in_=pow(1.0-abs(dot(nn,e)),2.2);' +
        'gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:
        'varying float in_;uniform vec3 c;void main(){gl_FragColor=vec4(c,in_*0.9);}'
    })
  );
  scene.add(glow);

  /* метки городов + Самарканд крупнее и с пульсом */
  var cities = [
    { name: 'Самарканд', lon: 66.97, lat: 39.65, big: true },
    { name: 'Ташкент',  lon: 69.24, lat: 41.31 },
    { name: 'Дубай',    lon: 55.27, lat: 25.20 },
    { name: 'Стамбул',  lon: 28.98, lat: 41.01 },
    { name: 'Москва',   lon: 37.62, lat: 55.75 }
  ];
  cities.forEach(function (ct) {
    var pos = ll2v(ct.lon, ct.lat, R * 1.02);
    var sz = ct.big ? 0.12 : 0.06;
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(sz, 16, 16),
      new THREE.MeshBasicMaterial({ color: ct.big ? 0xffe6cf : accent().getHex() })
    );
    m.position.copy(pos); world.add(m);
    if (ct.big) {
      var ring = new THREE.Mesh(
        new THREE.RingGeometry(0.14, 0.17, 32),
        new THREE.MeshBasicMaterial({ color: accent(), transparent: true, opacity: 0.9, side: THREE.DoubleSide })
      );
      ring.position.copy(pos); ring.lookAt(pos.clone().multiplyScalar(2));
      world.add(ring); ct._ring = ring;
    }
  });

  /* дуги-перелёты от Самарканда к городам */
  function arc(a, b) {
    var va = ll2v(a.lon, a.lat, R * 1.02), vb = ll2v(b.lon, b.lat, R * 1.02);
    var mid = va.clone().add(vb).multiplyScalar(0.5).setLength(R * (1.25 + va.distanceTo(vb) * 0.06));
    var curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
    var g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: accent(), transparent: true, opacity: 0.5 }));
  }
  var sam = cities[0];
  cities.slice(1).forEach(function (c) { world.add(arc(sam, c)); });

  /* звёзды позади */
  var starN = 260, spos = new Float32Array(starN * 3);
  for (var k = 0; k < starN; k++) {
    var rr = 14 + Math.random() * 10, a1 = Math.random() * Math.PI * 2, a2 = Math.acos(2 * Math.random() - 1);
    spos[k * 3] = rr * Math.sin(a2) * Math.cos(a1);
    spos[k * 3 + 1] = rr * Math.cos(a2);
    spos[k * 3 + 2] = rr * Math.sin(a2) * Math.sin(a1);
  }
  var starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(spos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 })));

  /* свет */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xfff0e6, 1.15); key.position.set(-4, 3, 5); scene.add(key);

  /* --- ВРАЩЕНИЕ МЫШКОЙ --- */
  world.rotation.y = -1.9;   // стартуем на Средней Азии — виден Самарканд
  world.rotation.x = 0.34;
  var dragging = false, lastX = 0, lastY = 0, velY = 0.0016, velX = 0;

  function down(e) {
    dragging = true;
    var p = e.touches ? e.touches[0] : e;
    lastX = p.clientX; lastY = p.clientY;
    var hint = document.getElementById('globeHint'); if (hint) hint.classList.add('gone');
  }
  function move(e) {
    if (!dragging) return;
    var p = e.touches ? e.touches[0] : e;
    var dx = p.clientX - lastX, dy = p.clientY - lastY;
    lastX = p.clientX; lastY = p.clientY;
    world.rotation.y += dx * 0.006;
    world.rotation.x += dy * 0.006;
    world.rotation.x = Math.max(-1.2, Math.min(1.2, world.rotation.x));
    velY = dx * 0.006; velX = dy * 0.006;
  }
  function up() { dragging = false; }
  cv.addEventListener('pointerdown', down);
  addEventListener('pointermove', move, { passive: true });
  addEventListener('pointerup', up);
  cv.addEventListener('touchstart', down, { passive: true });
  cv.addEventListener('touchmove', function (e) { move(e); }, { passive: true });
  cv.addEventListener('touchend', up);

  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }
  addEventListener('resize', resize, { passive: true });

  /* цвета в такт теме */
  new MutationObserver(function () {
    var c = accent();
    landMat.color = c; glow.material.uniforms.c.value = c;
    if (sam._ring) sam._ring.material.color = c;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  var t = 0;
  function frame() {
    t += 0.016;
    if (!dragging) {
      velY += (0.0016 - velY) * 0.02;   // инерция -> плавное авто-вращение
      velX += (0 - velX) * 0.05;
      world.rotation.y += velY;
      world.rotation.x += velX;
    }
    if (sam._ring) {
      var s2 = 1 + Math.sin(t * 2.2) * 0.25;
      sam._ring.scale.set(s2, s2, s2);
      sam._ring.material.opacity = 0.75 - Math.sin(t * 2.2) * 0.35;
    }
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
  if (reduce) renderer.render(scene, camera);
})();
