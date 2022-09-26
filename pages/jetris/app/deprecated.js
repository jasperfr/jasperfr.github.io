function boardBounce() {
    if(gy > 1) return;
    bx = bx / 1.2;
    by = by / 1.3;
    boardRotate /= 1.1;
    $('#game').css('transform', `translateX(${bx}px) translateY(${by}px) rotate(${boardRotate}deg)`);
}
