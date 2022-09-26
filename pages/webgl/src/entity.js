class Entity {
    constructor(geometry, x, y, z) {
        this.geometry = geometry;
        this.position = { x: x, y: y, z: z };
        this.velocity = { x: x, y: y, z: z };
        this.fnUpdate = null;
    }

    update() {
        this.fnUpdate?.();
    }

    render(gl, program, viewMatrix, projectionMatrix) {
        geometry.translate(this.geometry, this.position.x, this.position.y, this.position.z);
        geometry.render(gl, this.geometry, program, viewMatrix, projectionMatrix);
    }
}
