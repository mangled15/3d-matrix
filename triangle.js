const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"
triangle.width = 800
triangle.height = 800
const ctx = triangle.getContext("2d")

function clear() {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, triangle.width, triangle.height)
}

function point({ x, y }) {
    const s = 20
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x - s / 2, y - s / 2, s, s)
}

function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    // -1..1 => 0..2 => 0..1 => 0..w
    return {
        x: (p.x + 1) / 2 * triangle.width,
        y: (1 - (p.y + 1) / 2) * triangle.height,
    }
}

function project({ x, y, z }) {
    return {
        x: x / z,
        y: y / z
    }
}

function translate_z({ x, y, z }, dz) {
    return {
        x, y, z: z + dz
    }
}

function rotate_xz({ x, y, z }, angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return {
        x: x * c - z * s,
        y,
        z: x * s + z * c
    }
}

const vs = [
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: -0, y: 0.25, z: -0.25 },
]

const fs = [
    [0, 1, 2, 3],
]

const static = [
    { x: -0, y: 0.25, z: -0.25 },
]

const scf = [
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
]

const FPS = 60;
let dz = 1;
let angle = 0;

function frame() {
    let dt = 1 / FPS
    angle += Math.PI / 2 * dt
    // dz += 1 * dt
    clear()
    // points rendering
    // for (const v of vs) {
    //     point(screen(project(translate_z(rotate_xz(v, angle), dz))))
    // }
    // line rendering
    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i + 1) % f.length]]
            line(screen(project(translate_z(rotate_xz(a, angle), dz))),
                screen(project(translate_z(rotate_xz(b, angle), dz))))
        }
    }

    // static point rendering
    // for (const sv of static) {
    //     point(screen(project(translate_z(sv, dz))))
    // }
    // static line rendering
    for (const sc of scf) {
        const a = vs[sc[0]];
        const b = vs[sc[1]];
        line(screen(project(translate_z(a, dz))),
            screen(project(translate_z(rotate_xz(b, angle), dz))))
    }
    setTimeout(frame, 1000 / FPS)
}

setTimeout(frame, 1000 / FPS)