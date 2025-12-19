import { useSelector } from "react-redux";
import { viewSlice } from "../../store/slices/viewSlice";

export const Ground = () => {
  const { getGroundCenter } = viewSlice.selectors;
  const { x, z } = useSelector(getGroundCenter);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.1, z]} receiveShadow>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color="#90EE90" />
    </mesh>
  );
};
