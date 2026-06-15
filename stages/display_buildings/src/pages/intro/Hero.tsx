import classes from "./Hero.module.css";
import { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "react-router";

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
    <span className={classes.year}>2025-2026</span>
  </div>
);

const HeroTitle = () => (
  <h1 className={classes.title}>
    <span className={classes.titleAccent}>Метавселенная</span>
    <span className={classes.titleMain}>Екатеринбург</span>
  </h1>
);

const Icon = ({
  title,
  slug,
  path,
}: {
  title: string;
  slug: string;
  path?: string;
}) => (
  <span className={classes.featureItem}>
    <i className={`fas fa-${slug}`}></i>
    {path ? <Link to={path}>{title}</Link> : title}
  </span>
);

// const FeaturesBar = () => (
//   <div className={classes.featuresBar}>
//     <Icon title="3D-модели" slug="cube" path="/offers/create" />
//     <span className={classes.featureDot} />
//     <Icon title="Карта" slug="map-marker-alt" />
//     <span className={classes.featureDot} />
//     <Icon title="Ученики" slug="users" />
//   </div>
// );

const EnterLink = ({}: {}) => (
  <div style={{ display: "inline-flex", gap: "1rem", flexDirection: "column" }}>
    <Link className={classes.cta} to="/view">
      <span>Войти в метавселенную</span>
      <span className={classes.ctaIcon}>
        <i className="fas fa-arrow-right"></i>
      </span>
    </Link>
    <Link
      style={{ height: "56px", textAlign: "center", justifyContent: "center" }}
      className={classes.cta}
      to="/login"
    >
      <span>Войти с логином</span>
    </Link>
  </div>
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

const HeroContainer = ({}: {}) => (
  <div className={classes.container}>
    <div className={classes.content}>
      <TopLine />
      <HeroTitle />
      <p className={classes.subtitle}>
        3D-карта города Екатеринбург, разработанная школьниками города
      </p>
      {/* <FeaturesBar /> */}
      <EnterLink />
    </div>
    <HeroCollage />
  </div>
);

export const Hero = () => {
  return (
    <main className={classes.hero}>
      <HeroLayer name="image" />
      <HeroLayer name="light" />
      <HeroLayer name="shapes">
        <HeroShape id="shape1" />
        <HeroShape id="shape2" />
        <HeroShape id="shape3" />
      </HeroLayer>
      <HeroLayer name="logo">
        <img src="/images/Logo5.png" alt="" className={classes.logoWatermark} />
      </HeroLayer>
      <HeroContainer />
    </main>
  );
};
