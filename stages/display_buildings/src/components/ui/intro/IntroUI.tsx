import { Footer } from "./Footer";
import { Hero } from "./Hero";
import classes from "./Intro.module.css";

export const IntroUI = () => (
  <div className={classes.intro}>
    <Hero />
    <Footer />
  </div>
);
