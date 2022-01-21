const positionToChunkIndex = (x, y, z) => {
    return { x: Math.round(x / 16) + 0, y: Math.round(y / 16) + 0, z: Math.round(z / 16) + 0 };
};

const chunkIndexToPosition = (x, y, z) => {
    return { x: x * 16, y: y * 16, z: z * 16 };
};

const blockAt = (chunk, x, y, z) => {
    return chunk[y][x][z] != 0;
};
