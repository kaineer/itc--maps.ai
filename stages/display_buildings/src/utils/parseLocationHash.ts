interface SuccessfullHash {
  fromHash: true;
  x: number;
  z: number;
}

interface FailedHash {
  fromHash: false;
}

export const parseLocationHash = (): SuccessfullHash | FailedHash => {
  const { hash } = window.location;
  const parts = hash.slice(1).split("&");

  if (hash && Array.isArray(parts) && parts.length > 1) {
    const [x, z] = parts.map((p) => Number(p.split("=")[1]));
    return {
      fromHash: true,
      x,
      z,
    };
  }
  return { fromHash: false };
};
//
