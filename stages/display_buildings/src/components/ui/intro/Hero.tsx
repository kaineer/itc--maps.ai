import classes from "./Hero.module.css";
import { ReactNode, MouseEvent } from "react";
import clsx from "clsx";
import { uiSlice } from "@slices/uiSlice";
import { useDispatch } from "react-redux";

interface LayerProps {
  name: string;
  children?: ReactNode;
}

const HeroLayer = ({ name, children }: LayerProps) => (
  <div className={clsx(classes.layer, classes[name])}>
    {children ? children : null}
  </div>
);

type ShapeType = "shape1" | "shape2" | "shape3";
interface ShapeProps {
  id: ShapeType;
}

const HeroShape = ({ id }: ShapeProps) => (
  <div className={clsx(classes.shape, classes[id])}></div>
);

const TopLine = () => (
  <div className={classes.topLine}>
    <span className={classes.kct}>Колледж Цифровых Технологий</span>
    <span className={classes.divider}>/</span>
    <span className={classes.year}>2025</span>
  </div>
);

const HeroTitle = () => (
  <h1 className={classes.title}>
    <span className={classes.titleAccent}>Метавселенная</span>
    <span className={classes.titleMain}>Екатеринбург</span>
  </h1>
);

const Icon = ({ title, slug }: { title: string; slug: string }) => (
  <span className={classes.featureItem}>
    <i className={`fas fa-${slug}`}></i>
    {title}
  </span>
);

const FeaturesBar = () => (
  <div className={classes.featuresBar}>
    <Icon title="3D-модели" slug="cube" />
    <span className={classes.featureDot} />
    <Icon title="Карта" slug="map-marker-alt" />
    <span className={classes.featureDot} />
    <Icon title="Ученики" slug="users" />
  </div>
);

const EnterLink = ({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <a className={classes.cta} href="#" onClick={onClick}>
    <span>Войти в метавселенную</span>
    <span className={classes.ctaIcon}>
      <i className="fas fa-arrow-right"></i>
    </span>
  </a>
);

const CollageItem = ({ id, img }: { id: string; img: string }) => (
  <div className={clsx(classes.collageItem, "item" + id)}>
    <img src={"/images/" + img} alt="" />
  </div>
);

const HeroCollage = () => (
  <div className={classes.collage}>
    <div className={classes.collageGrid}>
      <CollageItem id="1" img="bg.png" />
      <CollageItem id="2" img="bg2.png" />
      <CollageItem id="3" img="bg3.png" />
      <CollageItem id="4" img="bg4.png" />
      <CollageItem id="5" img="bg5.png" />
    </div>
  </div>
);

const HeroContainer = ({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <div className={classes.container}>
    <div className={classes.content}>
      <TopLine />
      <HeroTitle />
      <p className={classes.subtitle}>
        3D-карта города Екатеринбург, разработанная школьниками города
      </p>
      <FeaturesBar />
      <EnterLink onClick={onClick} />
    </div>
    <HeroCollage />
  </div>
);

export const Hero = () => {
  const { selectLoginMode } = uiSlice.actions;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectLoginMode());
  };

  return (
    <main className={classes.hero}>
      <HeroLayer name="image" />
      <HeroLayer name="light" />
      <HeroLayer name="shapes">
        <HeroShape id="1" />
        <HeroShape id="2" />
        <HeroShape id="3" />
      </HeroLayer>
      <HeroLayer name="logo">
        <img src="/images/Logo5.png" alt="" className={classes.logoWatermark} />
      </HeroLayer>
      <HeroContainer onClick={handleClick} />
    </main>
  );
};
