/* ============================================================
   «ОДИН ДЕНЬ С OSHBOARD» В ОБЪЁМЕ — полёт над площадью в Самарканде.

   Плоская сцена (story.js + story.css) остаётся основой: её видят телефоны,
   слабые устройства и те, кто просил меньше движения. Здесь — надстройка для
   компьютера: вместо нарисованного силуэта настоящая объёмная площадь с тремя
   медресе, посреди неё стоит экран программы, и камера летит к нему вслед за
   прокруткой — от рассвета, когда она смотрит на купола сверху, через площадь
   днём, до ночи с огнями в арках. Экраны программы сменяются на нём по главам.

   Ничего не снято и не скачано: площадь собрана из простых фигур прямо здесь.
   Движок (three.js, лежит у нас в js/vendor) подгружается только когда раздел
   близко к экрану и устройство потянет — на первую загрузку сайта он не влияет.
   Не завёлся (нет WebGL, ошибка) — остаётся плоская сцена, сайт цел.
   ============================================================ */
(function () {
  'use strict';
  var s = document.getElementById('day');
  if (!s) return;
  var sky = s.querySelector('.story-sky');
  if (!sky) return;

  // Кому не включаем: меньше движения, узкий экран, слабое устройство
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if (matchMedia('(max-width:900px)').matches || matchMedia('(pointer:coarse)').matches) return;
  if ((navigator.hardwareConcurrency || 4) < 4) return;
  try {
    var probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
  } catch (e) { return; }

  var started = false;
  // Грузим движок заранее — когда до раздела осталось полтора экрана
  var near = new IntersectionObserver(function (en) {
    if (!en[0].isIntersecting || started) return;
    started = true; near.disconnect();
    import(new URL('js/vendor/three.module.min.js', document.baseURI).href).then(build).catch(function () { /* остаёмся на плоской сцене */ });
  }, { rootMargin: '150% 0px' });
  near.observe(s);

  function build(T) {
    var canvas = document.createElement('canvas');
    canvas.className = 'st-gl';
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    var scene = new T.Scene();
    scene.fog = new T.Fog(0x000000, 60, 210);
    var camera = new T.PerspectiveCamera(46, 1, 0.5, 600);

    /* ---------- небо: купол с переходом от зенита к горизонту */
    var skyMat = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color() }, bottom: { value: new T.Color() } },
      vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying float h; void main(){ float t = smoothstep(-0.05, 0.75, h); gl_FragColor = vec4(mix(bottom, top, t), 1.0); }'
    });
    scene.add(new T.Mesh(new T.SphereGeometry(400, 24, 16), skyMat));

    /* ---------- свет */
    var hemi = new T.HemisphereLight(0xffffff, 0x3a2e28, 0.6);
    var sun = new T.DirectionalLight(0xffffff, 1);
    scene.add(hemi, sun);
    var sunBall = new T.Mesh(new T.SphereGeometry(7, 20, 14), new T.MeshBasicMaterial({ color: 0xffe2a0, fog: false }));
    var moon = new T.Mesh(new T.SphereGeometry(4.5, 20, 14), new T.MeshBasicMaterial({ color: 0xe6eaf6, fog: false, transparent: true, opacity: 0 }));
    moon.position.set(90, 110, -230);
    scene.add(sunBall, moon);

    /* ---------- звёзды */
    var starPos = new Float32Array(900 * 3);
    for (var i = 0; i < 900; i++) {
      var a = Math.random() * Math.PI * 2, e = Math.random() * 0.48 * Math.PI + 0.06, r = 360;
      starPos[i * 3] = Math.cos(a) * Math.cos(e) * r; starPos[i * 3 + 1] = Math.sin(e) * r; starPos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r;
    }
    var starGeo = new T.BufferGeometry();
    starGeo.setAttribute('position', new T.BufferAttribute(starPos, 3));
    var stars = new T.Points(starGeo, new T.PointsMaterial({ color: 0xffffff, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    scene.add(stars);

    /* ---------- материалы площади */
    var brick = new T.MeshStandardMaterial({ color: 0xc9a078, roughness: 0.92, metalness: 0, flatShading: true });
    var brickDark = new T.MeshStandardMaterial({ color: 0xa97f5c, roughness: 0.95, flatShading: true });
    var tile = new T.MeshStandardMaterial({ color: 0x2aa9c4, roughness: 0.45, metalness: 0.1, flatShading: true });
    var tileDeep = new T.MeshStandardMaterial({ color: 0x1c5fa8, roughness: 0.5, flatShading: true });
    var gold = new T.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.35, metalness: 0.6 });
    // проёмы арок: днём — тень, ночью — тёплый свет изнутри
    var glow = new T.MeshStandardMaterial({ color: 0x2a1c14, roughness: 1, emissive: 0xffb866, emissiveIntensity: 0 });
    var groundMat = new T.MeshStandardMaterial({ color: 0xb8956f, roughness: 1 });
    var paveMat = new T.MeshStandardMaterial({ color: 0xcdb08c, roughness: 1 });

    function archShape(w, h) {
      var sh = new T.Shape();
      sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, h * 0.58);
      sh.quadraticCurveTo(-w / 2, h * 0.92, 0, h);
      sh.quadraticCurveTo(w / 2, h * 0.92, w / 2, h * 0.58);
      sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0);
      return new T.ShapeGeometry(sh, 10);
    }
    function box(w, h, d, mat, x, y, z) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; }
    function arch(w, h, x, y, z) { var m = new T.Mesh(archShape(w, h), glow); m.position.set(x, y, z); return m; }

    function minaret(x, z, h) {
      var g = new T.Group();
      var shaft = new T.Mesh(new T.CylinderGeometry(0.72, 0.95, h, 10), brick); shaft.position.y = h / 2;
      var band = new T.Mesh(new T.CylinderGeometry(0.98, 0.98, 0.9, 10), tileDeep); band.position.y = h * 0.72;
      var crown = new T.Mesh(new T.CylinderGeometry(1.15, 0.8, 1.1, 10), tile); crown.position.y = h + 0.5;
      var cap = new T.Mesh(new T.SphereGeometry(0.85, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), tile); cap.position.y = h + 1.05; cap.scale.y = 1.25;
      g.add(shaft, band, crown, cap); g.position.set(x, 0, z);
      return g;
    }
    function dome(x, y, z, r) {
      var g = new T.Group();
      var drum = new T.Mesh(new T.CylinderGeometry(r * 0.86, r * 0.92, r * 1.1, 14), tileDeep); drum.position.y = r * 0.55;
      var cap = new T.Mesh(new T.SphereGeometry(r, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), tile); cap.position.y = r * 1.25; cap.scale.y = 1.32;
      var tip = new T.Mesh(new T.ConeGeometry(0.16, 1.5, 6), gold); tip.position.y = r * 2.72;
      g.add(drum, cap, tip); g.position.set(x, y, z);
      return g;
    }
    // Медресе: длинный корпус, высокий портал с аркой, два минарета, два купола
    function madrasah(x, z, rot) {
      var g = new T.Group();
      g.add(box(26, 7, 14, brick, 0, 3.5, 0));
      g.add(box(26.4, 0.7, 14.4, tileDeep, 0, 7.2, 0));
      g.add(box(10, 14, 3.4, brick, 0, 7, 7.4));
      g.add(box(10.5, 1, 3.8, tile, 0, 14.4, 7.4));
      g.add(arch(6, 10.5, 0, 0.2, 9.14));
      g.add(box(0.9, 12.6, 0.5, tileDeep, -3.9, 6.5, 9.1), box(0.9, 12.6, 0.5, tileDeep, 3.9, 6.5, 9.1));
      [-10.2, -6.9, 6.9, 10.2].forEach(function (ax) { g.add(arch(2.1, 2.6, ax, 0.3, 7.03), arch(2.1, 2.5, ax, 3.9, 7.03)); });
      g.add(minaret(-13.6, 7.2, 17), minaret(13.6, 7.2, 17));
      g.add(dome(-7.5, 7.5, -1.5, 2.7), dome(7.5, 7.5, -1.5, 2.7));
      g.position.set(x, 0, z); g.rotation.y = rot;
      return g;
    }
    scene.add(madrasah(-30, 0, Math.PI / 2), madrasah(30, 0, -Math.PI / 2), madrasah(0, -30, 0));

    // земля и мощёная площадь с рисунком плит
    var ground = new T.Mesh(new T.PlaneGeometry(900, 900), groundMat); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    var pave = new T.Mesh(new T.PlaneGeometry(46, 52), paveMat); pave.rotation.x = -Math.PI / 2; pave.position.set(0, 0.03, 4); scene.add(pave);
    var lines = new T.GridHelper(48, 12, 0x8f7354, 0x8f7354); lines.position.set(0, 0.06, 4); lines.material.transparent = true; lines.material.opacity = 0.35; scene.add(lines);
    // дальний город: низкие дома и редкие купола, чтобы горизонт не был пустым
    var rnd = (function () { var x = 20261116; return function () { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }; })();
    for (var k = 0; k < 70; k++) {
      var ang = rnd() * Math.PI * 2, dist = 70 + rnd() * 110;
      var bx = Math.cos(ang) * dist, bz = Math.sin(ang) * dist;
      if (bz > 40 && Math.abs(bx) < 60) continue; // перед камерой чисто
      var w = 5 + rnd() * 9, h = 2.5 + rnd() * 5;
      scene.add(box(w, h, 5 + rnd() * 9, rnd() > 0.5 ? brick : brickDark, bx, h / 2, bz));
      if (rnd() > 0.72) scene.add(dome(bx, h, bz, 1.6 + rnd() * 1.4));
    }
    // фонари у входов — тёплые огни ночью
    var lamps = [];
    [[-14, 10], [14, 10], [-14, -6], [14, -6], [0, -12]].forEach(function (pp) {
      var l = new T.PointLight(0xffb060, 0, 46, 1.6); l.position.set(pp[0], 5, pp[1]); scene.add(l); lamps.push(l);
    });

    /* ---------- экран программы: стоит в воздухе посреди площади, камера летит к нему и вокруг него
       Как кофейник в образце руководителя: главный предмет сцены — сам продукт. Картинки те же,
       что в плоской версии; между главами одна плавно сменяет другую. */
    var SCREEN_W = 17.6, SCREEN_H = 11;
    var screen = new T.Group();
    screen.position.set(2, 8.2, 8);
    var body = new T.Mesh(new T.BoxGeometry(SCREEN_W + 0.7, SCREEN_H + 0.7, 0.5), new T.MeshStandardMaterial({ color: 0x15171c, roughness: 0.35, metalness: 0.6 }));
    body.position.z = -0.27;
    var faceGeo = new T.PlaneGeometry(SCREEN_W, SCREEN_H);
    var faceA = new T.Mesh(faceGeo, new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false }));
    var faceB = new T.Mesh(faceGeo, new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false, transparent: true, opacity: 0 }));
    faceB.position.z = 0.02;
    // мягкое свечение вокруг экрана — заметнее к ночи
    var halo = new T.Mesh(new T.PlaneGeometry(SCREEN_W * 1.9, SCREEN_H * 2.1), new T.MeshBasicMaterial({ color: 0xff7a4d, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: T.AdditiveBlending,
      alphaMap: (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'); var gr = g.createRadialGradient(64, 64, 6, 64, 64, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })() }));
    halo.position.z = -0.6;
    // тонкая стойка до земли: экран не «висит ни на чём»
    var pole = new T.Mesh(new T.CylinderGeometry(0.16, 0.22, 2.6, 8), new T.MeshStandardMaterial({ color: 0x15171c, roughness: 0.4, metalness: 0.6 }));
    pole.position.set(0, -SCREEN_H / 2 - 1.5, -0.3);
    var foot = new T.Mesh(new T.CylinderGeometry(2.2, 2.4, 0.22, 20), pole.material); foot.position.set(0, -SCREEN_H / 2 - 2.75, -0.3);
    screen.add(halo, body, faceA, faceB, pole, foot);
    scene.add(screen);

    var shots = ['assets/img/story-tg.webp'].concat([].slice.call(s.querySelectorAll('img.st-screen')).map(function (im) { return im.getAttribute('src'); }));
    var textures = [], loader = new T.TextureLoader();
    shots.forEach(function (src, i) {
      loader.load(new URL(src, document.baseURI).href, function (tx2) {
        tx2.colorSpace = T.SRGBColorSpace; tx2.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        textures[i] = tx2;
        if (i === shownStep || (shownStep < 0 && i === 0)) { faceA.material.map = tx2; faceA.material.needsUpdate = true; dirty = true; }
      });
    });
    var shownStep = -1, fade = 0, dirty = true;
    function showStep(i) {
      if (i === shownStep || !textures[i]) return;
      if (shownStep < 0) { faceA.material.map = textures[i]; faceA.material.needsUpdate = true; shownStep = i; dirty = true; return; }
      // новая картинка проявляется поверх старой
      faceB.material.map = textures[i]; faceB.material.needsUpdate = true; faceB.material.opacity = 0;
      shownStep = i; fade = 0.0001;
    }

    /* ---------- путь камеры: сверху на рассвете → к экрану днём → облёт на закате → отлёт ночью */
    var pathPos = new T.CatmullRomCurve3([
      new T.Vector3(-14, 46, 98), new T.Vector3(-14, 15, 44), new T.Vector3(1, 9, 31),
      new T.Vector3(15, 10, 33), new T.Vector3(3, 15, 46)
    ]);
    var pathLook = new T.CatmullRomCurve3([
      new T.Vector3(0, 7, 0), new T.Vector3(1.5, 8, 6), new T.Vector3(2, 8.2, 8),
      new T.Vector3(2, 8.2, 8), new T.Vector3(2, 8.6, 6)
    ]);

    /* ---------- небо и свет по времени суток */
    var KEYS = [
      { p: 0.00, top: 0x1d2440, bottom: 0xf0a565, sun: 0xffb27a, power: 0.9, hemi: 0.42 },
      { p: 0.30, top: 0x2f66a8, bottom: 0xbcd6e8, sun: 0xfff4e0, power: 1.55, hemi: 0.78 },
      { p: 0.55, top: 0x2c5f9e, bottom: 0xc8dbe6, sun: 0xfff0d8, power: 1.5, hemi: 0.75 },
      { p: 0.78, top: 0x241f47, bottom: 0xf09a52, sun: 0xff8d4d, power: 0.95, hemi: 0.4 },
      { p: 1.00, top: 0x04060d, bottom: 0x1a1d38, sun: 0x8fa6e6, power: 0.16, hemi: 0.16 }
    ];
    var cA = new T.Color(), cB = new T.Color(), look = new T.Vector3();
    function grade(p) {
      var i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
      var a = KEYS[i], b = KEYS[i + 1], t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
      skyMat.uniforms.top.value.copy(cA.setHex(a.top)).lerp(cB.setHex(b.top), t);
      skyMat.uniforms.bottom.value.copy(cA.setHex(a.bottom)).lerp(cB.setHex(b.bottom), t);
      scene.fog.color.copy(skyMat.uniforms.bottom.value);
      sun.color.copy(cA.setHex(a.sun)).lerp(cB.setHex(b.sun), t);
      sun.intensity = a.power + (b.power - a.power) * t;
      hemi.intensity = a.hemi + (b.hemi - a.hemi) * t;
      hemi.color.copy(skyMat.uniforms.top.value).lerp(cA.setHex(0xffffff), 0.55);
    }
    var smooth = function (a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

    /* ---------- размер и кадр */
    var W = 0, H = 0, mx = 0, my = 0, tx = 0, ty = 0, shownP = -1, visible = false, raf = 0;
    function size() {
      var r = sky.getBoundingClientRect();
      if (r.width === W && r.height === H) return;
      W = r.width; H = r.height;
      renderer.setSize(W, H, false);
      camera.aspect = W / Math.max(1, H);
      // на широком экране текст слева, сцену чуть сдвигаем вправо — купола не прячутся под заголовком
      camera.setViewOffset(W, H, -W * 0.2, 0, W, H);
      camera.updateProjectionMatrix();
      shownP = -1;
    }
    function frame() {
      raf = 0;
      if (!visible) return;
      size();
      var p = Number(s.style.getPropertyValue('--p')) || 0;
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
      var moving = Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001;
      showStep(Number(s.getAttribute('data-step')) || 0);
      if (fade > 0) {
        fade = Math.min(1, fade + 0.045);
        faceB.material.opacity = fade;
        if (fade >= 1) { faceA.material.map = faceB.material.map; faceA.material.needsUpdate = true; faceB.material.opacity = 0; fade = 0; }
        dirty = true;
      }
      if (p !== shownP || moving || dirty) {
        dirty = false;
        shownP = p;
        grade(p);
        pathPos.getPoint(p, camera.position);
        pathLook.getPoint(p, look);
        // лёгкий отклик на мышь: сцена «дышит», а не стоит картинкой
        camera.position.x += mx * 3.2; camera.position.y += -my * 1.6;
        camera.lookAt(look);
        // солнце идёт по дуге с востока на запад
        var arc = Math.PI * Math.min(1, p / 0.86);
        var sx = -Math.cos(arc) * 190, sy = Math.sin(arc) * 150 - 14, sz = -150;
        sunBall.position.set(sx, sy, sz); sun.position.set(sx, Math.max(8, sy), sz + 60);
        sunBall.material.color.copy(sun.color).lerp(cA.setHex(0xffffff), 0.25);
        var night = smooth(0.8, 0.97, p);
        sunBall.visible = night < 0.98; moon.material.opacity = night; stars.material.opacity = night * 0.95;
        glow.emissiveIntensity = smooth(0.66, 0.95, p) * 1.7;
        // экран чуть поворачивается за мышью и светится к ночи
        screen.rotation.y = mx * 0.18; screen.rotation.x = my * 0.08;
        halo.material.opacity = 0.1 + smooth(0.6, 0.95, p) * 0.34;
        for (var j = 0; j < lamps.length; j++) lamps[j].intensity = smooth(0.7, 0.95, p) * 260;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (visible && !raf) raf = requestAnimationFrame(frame); }

    // Первый кадр рисуем ДО того, как показать холст: иначе на миг мигнул бы чёрный прямоугольник
    sky.insertBefore(canvas, sky.firstChild);
    visible = true; size(); frame();
    s.classList.add('story-3d');

    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }, { rootMargin: '10% 0px' }).observe(s);
    window.addEventListener('resize', function () { shownP = -1; kick(); });
    window.addEventListener('pointermove', function (e) { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; }, { passive: true });
    // потеряли графику (свернули надолго, сменили видеокарту) — возвращаем плоскую сцену
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); visible = false; s.classList.remove('story-3d'); });
  }
})();
