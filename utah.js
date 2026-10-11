(() => {
    const BACKGROUND = "#101010"
    const FOREGROUND = "#FF50FF"
    utah.width = 800
    utah.height = 800
    const ctx = utah.getContext("2d")

    let vertices = []
    let faces = []

    async function readJson() {
        try {
            const response = await fetch('./utah_teapot.json');

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            for (let i = 0; i < data.vertices.length; i += 3) {
                vertices.push({
                    x: data.vertices[i],
                    y: data.vertices[i + 1],
                    z: data.vertices[i + 2],
                })
            }

            for (let i = 0; i < data.faces.length; i++) {
                faces.push(
                    data.faces[i]
                )
            }

        } catch (error) {
            console.error(error);
        }
    }

    function clear() {
        ctx.fillStyle = BACKGROUND
        ctx.fillRect(0, 0, utah.width, utah.height)
    }

    function point({ x, y }) {
        const SIZE = 8
        ctx.fillStyle = "#e0FF00"
        ctx.fillRect(x, y, SIZE, SIZE)
    }

    function line(p1, p2) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = FOREGROUND;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    function display(p) {
        return {
            x: (p.x + 1) / 2 * utah.width,
            y: (1 - (p.y + 1) / 2) * utah.height
        }
    }

    function project({ x, y, z }) {
        return {
            x: x / z,
            y: y / z,
        }
    }

    function translate_z({ x, y, z }, distanceZ) {
        return {
            x,
            y,
            z: z + distanceZ,
        }
    }

    function rotate_xz({ x, y, z }, angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return {
            x: x * c - z * s,
            y,
            z: x * s + z * c,
        }
    }

    function move_down() {
        for (const v of vertices) {
            v.y -= 1.5
        }
    }

    let wire_frame = true;
    let points = false;
    let both = false;

    let distanceZ = 5
    let angle = 0
    const FPS = 60
    function frame() {
        let dt = 1 / FPS;
        angle += (Math.PI / 2) * dt
        // distanceZ += dt;
        clear()
        if (points === true || both == true) {
            for (const v of vertices) {
                point(display(project(translate_z(rotate_xz(v, angle), distanceZ))))
            }
        }

        if (wire_frame === true || both == true) {
            for (const f of faces) {
                for (i = 0; i < f.length; i++) {
                    const a = vertices[f[i]]
                    const b = vertices[f[(i + 1) % f.length]]
                    line(
                        display(project(translate_z(rotate_xz(a, angle), distanceZ))),
                        display(project(translate_z(rotate_xz(b, angle), distanceZ)))
                    )
                }
            }
        }

        setTimeout(frame, 1000 / FPS)
    }

    scene = 1;
    function switch_scenes() {
        if (scene > 3) {
            scene = 1;
        }

        if (scene === 1) {
            wire_frame = false;
            points = false;
            both = true;
        }
        if (scene === 2) {
            wire_frame = false;
            points = true;
            both = false;
        }
        if (scene === 3) {
            wire_frame = true;
            points = false;
            both = false;
        }

        scene += 1;
        console.log(scene)
        setTimeout(switch_scenes, 2000)
    }

    let running = false;
    async function start() {
        const teapot = await readJson()
        move_down()
        running = true;
        console.log("running")
        if (running === true) {
            setTimeout(frame, 1000 / FPS)
            setTimeout(switch_scenes, 1000)
        }
    }
    start()
})();