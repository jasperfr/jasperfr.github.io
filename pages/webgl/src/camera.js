const Camera = {

  speed: 0.2,
  velocity: v3.create(0, 0, 0),
  position: v3.create(2.75, 5, 7),
  front: v3.create(0, 0, 0),
  up: v3.create(0, 1, 0),
  pitch: 0.0,
  yaw: 0.0,

  forward() {
    const temp = v3.create(0, 0, 0);
    v3.add(temp, this.front, temp);
    v3.mul(temp, this.speed, temp);
    temp[1] = 0;
    v3.add(temp, this.position, this.position);
  },

  backward() {
    const temp = v3.create(0, 0, 0);
    v3.add(temp, this.front, temp);
    v3.mul(temp, -this.speed, temp);
    temp[1] = 0;
    v3.add(temp, this.position, this.position);
  },

  left() {
    const temp = v3.cross(this.front, this.up);
    v3.normalize(temp, temp);
    v3.mul(temp, -this.speed, temp);
    temp[1] = 0;
    v3.add(temp, this.position, this.position);
  },

  right() {
    const temp = v3.cross(this.front, this.up);
    v3.normalize(temp, temp);
    v3.mul(temp, this.speed, temp);
    temp[1] = 0;
    v3.add(temp, this.position, this.position);
  },

  get viewMatrix() {
    return m4.inverse(this.matrix);
  },

  get matrix() {
    const temp = v3.create(0, 0, 0);
    v3.add(temp, Camera.position, temp);
    v3.add(temp, Camera.front, temp);

    const direction = v3.create(
      Math.cos(Math.radians(this.yaw)) * Math.cos(Math.radians(this.pitch)),
      Math.sin(Math.radians(this.pitch)),
      Math.sin(Math.radians(this.yaw)) * Math.cos(Math.radians(this.pitch))
    )
    v3.normalize(direction, this.front);

    const v = m4.lookAt(
      Camera.position,
      temp,
      Camera.up
    );

    return v;
  }
}
