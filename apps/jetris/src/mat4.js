/* https://vorg.github.io/pex/docs/pex-geom/Mat4.html */

function Mat4(a11, a12, a13, a14,
    a21, a22, a23, a24,
    a31, a32, a33, a34,
    a41, a42, a43, a44) {
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;
    this.a14 = a14;
    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;
    this.a24 = a24;
    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;
    this.a34 = a34;
    this.a41 = a41;
    this.a42 = a42;
    this.a43 = a43;
    this.a44 = a44;

    if (typeof (this.a11) == 'undefined') {
        this.reset();
    }
}

Mat4.prototype.set4x4r = function (a11, a12, a13, a14,
    a21, a22, a23, a24,
    a31, a32, a33, a34,
    a41, a42, a43, a44) {
    this.a11 = a11;
    this.a12 = a12;
    this.a13 = a13;
    this.a14 = a14;
    this.a21 = a21;
    this.a22 = a22;
    this.a23 = a23;
    this.a24 = a24;
    this.a31 = a31;
    this.a32 = a32;
    this.a33 = a33;
    this.a34 = a34;
    this.a41 = a41;
    this.a42 = a42;
    this.a43 = a43;
    this.a44 = a44;
    return this;
};

Mat4.prototype.mul4x4r = function (b11, b12, b13, b14,
    b21, b22, b23, b24,
    b31, b32, b33, b34,
    b41, b42, b43, b44) {
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a14 = this.a14;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a24 = this.a24;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;
    var a34 = this.a34;
    var a41 = this.a41;
    var a42 = this.a42;
    var a43 = this.a43;
    var a44 = this.a44;
    this.a11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    this.a12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    this.a13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    this.a14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    this.a21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    this.a22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    this.a23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    this.a24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    this.a31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    this.a32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    this.a33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    this.a34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    this.a41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    this.a42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    this.a43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    this.a44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
};

Mat4.prototype.asMul = function (a, b) {
    var a11 = a.a11;
    var a12 = a.a12;
    var a13 = a.a13;
    var a14 = a.a14;
    var a21 = a.a21;
    var a22 = a.a22;
    var a23 = a.a23;
    var a24 = a.a24;
    var a31 = a.a31;
    var a32 = a.a32;
    var a33 = a.a33;
    var a34 = a.a34;
    var a41 = a.a41;
    var a42 = a.a42;
    var a43 = a.a43;
    var a44 = a.a44;
    var b11 = b.a11;
    var b12 = b.a12;
    var b13 = b.a13;
    var b14 = b.a14;
    var b21 = b.a21;
    var b22 = b.a22;
    var b23 = b.a23;
    var b24 = b.a24;
    var b31 = b.a31;
    var b32 = b.a32;
    var b33 = b.a33;
    var b34 = b.a34;
    var b41 = b.a41;
    var b42 = b.a42;
    var b43 = b.a43;
    var b44 = b.a44;
    this.a11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    this.a12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    this.a13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    this.a14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    this.a21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    this.a22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    this.a23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    this.a24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    this.a31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    this.a32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    this.a33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    this.a34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    this.a41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    this.a42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    this.a43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    this.a44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
};

Mat4.prototype.mul = function (b) {
    return this.asMul(this, b);
};

Mat4.prototype.copy = function (m) {
    this.a11 = m.a11;
    this.a12 = m.a12;
    this.a13 = m.a13;
    this.a14 = m.a14;
    this.a21 = m.a21;
    this.a22 = m.a22;
    this.a23 = m.a23;
    this.a24 = m.a24;
    this.a31 = m.a31;
    this.a32 = m.a32;
    this.a33 = m.a33;
    this.a34 = m.a34;
    this.a41 = m.a41;
    this.a42 = m.a42;
    this.a43 = m.a43;
    this.a44 = m.a44;
    return this;
};

Mat4.create = function () {
    return new Mat4();
};

Mat4.prototype.dup = function () {
    return Mat4.create().copy(this);
};

Mat4.prototype.reset = function () {
    this.set4x4r(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    return this;
};

Mat4.prototype.rotate = function (theta, x, y, z) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    this.mul4x4r(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s,
        0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s,
        0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c,
        0, 0, 0, 0, 1);
    return this;
};

Mat4.prototype.toArray = function () {
    return [
        this.a11, this.a21, this.a31, this.a41,
        this.a12, this.a22, this.a32, this.a42,
        this.a13, this.a23, this.a33, this.a43,
        this.a14, this.a24, this.a34, this.a44];
};

Mat4.prototype.printDebug = function () {
    console.log(this.a11 + ' ' + this.a21 + ' ' + this.a31 + ' ' + this.a41);
    console.log(this.a12 + ' ' + this.a22 + ' ' + this.a32 + ' ' + this.a42);
    console.log(this.a13 + ' ' + this.a23 + ' ' + this.a33 + ' ' + this.a43);
    console.log(this.a14 + ' ' + this.a24 + ' ' + this.a34 + ' ' + this.a44);
}