(() => {
    const BACKGROUND = "#101010"
    const FOREGROUND = "#50FF50"
    piemol.width = 800
    piemol.height = 800
    const ctx = piemol.getContext("2d")

    function clear() {
        ctx.fillStyle = BACKGROUND
        ctx.fillRect(0, 0, piemol.width, piemol.height)
    }

    function point({ x, y }) {
        const s = 20
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
    }

    function line(p1, p2) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = FOREGROUND;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke();
    }

    function display(p) {
        return {
            x: (p.x + 1) / 2 * piemol.width,
            y: (1 - (p.y + 1) / 2) * piemol.height,
        }
    }

    function project({ x, y, z }) {
        return {
            x: x / z,
            y: y / z,
        }
    }

    function translate_z({ x, y, z }, dt) {
        return {
            x,
            y,
            z: z += dt
        }
    }

    cubes = [
        [
            { x: -0.25, y: 0.25, z: 0.5 },
            { x: 0.25, y: 0.25, z: 0.5 },
            { x: 0.25, y: -0.25, z: 0.5 },
            { x: -0.25, y: -0.25, z: 0.5 },

            { x: -0.25, y: 0.25, z: 1 },
            { x: 0.25, y: 0.25, z: 1 },
            { x: 0.25, y: -0.25, z: 1 },
            { x: -0.25, y: -0.25, z: 1 },
        ]
    ]

    const vertices = [
        { x: -0.25, y: 0.25, z: 0.5 },
        { x: 0.25, y: 0.25, z: 0.5 },
        { x: 0.25, y: -0.25, z: 0.5 },
        { x: -0.25, y: -0.25, z: 0.5 },

        { x: -0.25, y: 0.25, z: 1 },
        { x: 0.25, y: 0.25, z: 1 },
        { x: 0.25, y: -0.25, z: 1 },
        { x: -0.25, y: -0.25, z: 1 },
    ]

    const faces = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ]

    function render_cube({ x, y, z }, playerX, playerZ) {
        const cube_vertices = [
            { x: -0.25 + x + playerX, y: 0.25 + y, z: 0.5 + z },
            { x: 0.25 + x + playerX, y: 0.25 + y, z: 0.5 + z },
            { x: 0.25 + x + playerX, y: -0.25 + y, z: 0.5 + z },
            { x: -0.25 + x + playerX, y: -0.25 + y, z: 0.5 + z },

            { x: -0.25 + x + playerX, y: 0.25 + y, z: 1 },
            { x: 0.25 + x + playerX, y: 0.25 + y, z: 1 },
            { x: 0.25 + x + playerX, y: -0.25 + y, z: 1 },
            { x: -0.25 + x + playerX, y: -0.25 + y, z: 1 },
        ];

        const cube_faces = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
        ]


        for (const cube_face of cube_faces) {
            for (let i = 0; i < cube_face.length; i++) {
                const a = cube_vertices[cube_face[i]];
                const b = cube_vertices[cube_face[(i + 1) % cube_face.length]];
                if (a.z >= 0 && b.z >= 0) {
                    line(
                        display(project(translate_z(a, playerZ))),
                        display(project(translate_z(b, playerZ)))
                    )
                }

            }
        }

    }

    let distZ = 0
    const SPEED = 0.01

    // CHATGPT!!!
    const keys = new Set();

    window.addEventListener("keydown", (e) => {
        if (["KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft"]
            .includes(e.code)) {
            e.preventDefault();
        }

        keys.add(e.code);
    }, { passive: false });

    window.addEventListener("keyup", (e) => {
        keys.delete(e.code);
    });

    // Prevent stuck keys when the window loses focus
    window.addEventListener("blur", () => {
        keys.clear();
    });
    // CHATGPT END!!!

    playerZ = 0
    playerX = 0

    const FPS = 60
    function frame() {
        const dt = 1 / FPS

        clear()

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";

        // Render text
        ctx.fillText("Controls: W,A,S,D", 10, 25);

        if (keys.has("KeyS")) {
            playerZ += SPEED
        }
        if (keys.has("KeyD")) {
            playerX -= SPEED
        }
        if (keys.has("KeyA")) {
            playerX += SPEED
        }

        if (playerZ >= -0.4) {
            // movement
            if (keys.has("KeyW")) {
                playerZ -= SPEED
            }
        }

        render_cube({ x: 0, y: 0, z: 0 }, playerX, playerZ)
        render_cube({ x: 0.5, y: 0, z: 0 }, playerX, playerZ)
        render_cube({ x: -0.5, y: 0, z: 0 }, playerX, playerZ)
        render_cube({ x: 0, y: 0.5, z: 0 }, playerX, playerZ)
        render_cube({ x: 0, y: 1, z: 0 }, playerX, playerZ)

        setTimeout(frame, 1000 / FPS)
    }

    setTimeout(frame, 1000 / FPS)

})();