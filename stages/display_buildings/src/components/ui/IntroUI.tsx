import { useDispatch } from "react-redux";
import { uiSlice } from "../../store/uiSlice";
import { MouseEvent } from "react";
// import classes from "./IntroUI.module.css";

const IntroStyle = () => (
  <style type="text/css">
    {`.container {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          scroll-behavior: smooth;
          font-family:
              "Inter",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
          color: #1a1a2e;
          background-color: #ffffff;
          line-height: 1.6;
          overflow-x: hidden;
      }

      a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
      }

      a:hover {
          color: #bc00ff;
      }

      button {
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
      }

      .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0a0f;
      }

      .hero__layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
      }

      .hero__layer--image {
          background: url("house.png") center center / cover no-repeat;
          filter: blur(2px) saturate(0.3) brightness(0.4);
          transform: scale(1.05);
          z-index: 1;
      }

      .hero__layer--light {
          background: linear-gradient(
              160deg,
              rgba(15, 10, 30, 0.7) 0%,
              rgba(60, 20, 80, 0.5) 50%,
              rgba(15, 10, 30, 0.8) 100%
          );
          z-index: 2;
      }

      .hero__layer--gradient {
          background:
              radial-gradient(
                  ellipse 80% 50% at 20% 40%,
                  rgba(188, 0, 255, 0.15) 0%,
                  transparent 50%
              ),
              radial-gradient(
                  ellipse 60% 40% at 80% 60%,
                  rgba(120, 0, 200, 0.12) 0%,
                  transparent 50%
              ),
              radial-gradient(
                  ellipse 50% 30% at 50% 80%,
                  rgba(188, 0, 255, 0.08) 0%,
                  transparent 50%
              );
          z-index: 3;
      }

      .hero__layer--binary {
          z-index: 4;
          opacity: 0.15;
      }

      .hero__layer--shapes {
          z-index: 5;
      }

      .hero__shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 20s ease-in-out infinite;
      }

      .hero__shape--1 {
          width: 500px;
          height: 500px;
          background: rgba(188, 0, 255, 0.2);
          top: -10%;
          right: -5%;
          animation-delay: 0s;
      }

      .hero__shape--2 {
          width: 400px;
          height: 400px;
          background: rgba(100, 0, 180, 0.15);
          bottom: -5%;
          left: -5%;
          animation-delay: -7s;
      }

      .hero__shape--3 {
          width: 300px;
          height: 300px;
          background: rgba(150, 50, 255, 0.1);
          top: 50%;
          left: 30%;
          animation-delay: -14s;
      }

      @keyframes float {
          0%,
          100% {
              transform: translate(0, 0) scale(1);
          }
          33% {
              transform: translate(30px, -30px) scale(1.05);
          }
          66% {
              transform: translate(-20px, 20px) scale(0.95);
          }
      }

      .hero__layer--logo {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 6;
      }

      .hero__logo-watermark {
          width: 45%;
          max-width: 550px;
          height: auto;
          opacity: 0.03;
          filter: brightness(2);
      }

      .hero__container {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          width: 100%;
          max-width: 1400px;
          padding: 2rem 4rem;
      }

      .hero__content {
          flex: 1;
          max-width: 550px;
          animation: fadeInLeft 1s ease-out;
      }

      @keyframes fadeInLeft {
          from {
              opacity: 0;
              transform: translateX(-40px);
          }
          to {
              opacity: 1;
              transform: translateX(0);
          }
      }

      @keyframes fadeInUp {
          from {
              opacity: 0;
              transform: translateY(30px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }

      .hero__top-line {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: fadeInUp 1s ease-out 0.1s backwards;
      }

      .hero__kct {
          color: #d966ff;
      }

      .hero__divider {
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
      }

      .hero__year {
          color: rgba(255, 255, 255, 0.5);
      }

      .hero__title {
          font-family:
              "Inter",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
          animation: fadeInUp 1s ease-out 0.2s backwards;
      }

      .hero__title-accent {
          display: block;
          background: linear-gradient(
              135deg,
              #fff 0%,
              rgba(255, 255, 255, 0.85) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
      }

      .hero__title-main {
          display: block;
          background: linear-gradient(135deg, #d966ff 0%, #bc00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
      }

      .hero__subtitle {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 420px;
          animation: fadeInUp 1s ease-out 0.3s backwards;
      }

      .hero__features-bar {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: #fff;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4a4a68;
          margin-bottom: 2rem;
          animation: fadeInUp 1s ease-out 0.4s backwards;
      }

      .hero__feature-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
      }

      .hero__feature-item i {
          color: #bc00ff;
          font-size: 0.8rem;
      }

      .hero__features-dot {
          width: 3px;
          height: 3px;
          background: #bc00ff;
          border-radius: 50%;
      }

      .hero__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: linear-gradient(135deg, #d966ff 0%, #bc00ff 100%);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
              0 14px 38px rgba(188, 0, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
          text-decoration: none;
      }

      .hero__cta:hover {
          background: linear-gradient(135deg, #c73aff 0%, #a000e0 100%);
          border-color: rgba(255, 255, 255, 0.24);
          box-shadow:
              0 14px 38px rgba(188, 0, 255, 0.36),
              inset 0 1px 0 rgba(255, 255, 255, 0.16);
          color: #ffffff;
      }

      .hero__cta:active {
          background: #8a00c6;
          box-shadow:
              0 10px 24px rgba(188, 0, 255, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #ffffff;
      }

      .hero__cta-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.24);
          color: inherit;
      }

      .hero__cta:hover .hero__cta-icon {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.32);
      }

      .hero__collage {
          flex: 1;
          max-width: 600px;
          position: relative;
          animation: fadeInRight 1s ease-out 0.3s backwards;
      }

      @keyframes fadeInRight {
          from {
              opacity: 0;
              transform: translateX(40px);
          }
          to {
              opacity: 1;
              transform: translateX(0);
          }
      }

      .hero__collage-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: 1fr;
          gap: 0.85rem;
      }

      .hero__collage-item {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.02);
      }

      .hero__collage-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .hero__collage-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
              135deg,
              rgba(188, 0, 255, 0.1) 0%,
              transparent 50%
          );
          pointer-events: none;
      }

      .hero__collage-item--empty::after {
          display: none;
      }

      .hero__collage-item:hover {
          transform: scale(1.05) translateY(-5px);
          box-shadow: 0 30px 80px rgba(188, 0, 255, 0.3);
          z-index: 10;
      }

      .hero__collage-item:hover img {
          transform: scale(1.1);
      }

      .hero__collage-item--1 {
          animation: floatItem1 6s ease-in-out infinite;
          border-radius: 24px 24px 8px 24px;
      }

      .hero__collage-item--2 {
          animation: floatItem2 7s ease-in-out infinite;
          border-radius: 24px 24px 24px 8px;
      }

      .hero__collage-item--3 {
          animation: floatItem3 8s ease-in-out infinite;
          border-radius: 8px 24px 24px 24px;
      }

      .hero__collage-item--4 {
          animation: floatItem4 6.5s ease-in-out infinite;
          border-radius: 24px 8px 24px 24px;
      }

      .hero__collage-item--5 {
          animation: floatItem5 7.5s ease-in-out infinite;
          border-radius: 18px;
      }

      .hero__collage-item--6 {
          animation: floatItem6 7s ease-in-out infinite;
          border-radius: 20px;
      }

      .hero__collage-item--empty {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.02) 100%
          );
          color: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(2px);
      }

      .hero__collage-placeholder {
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1.4;
          padding: 0.75rem;
      }

      @keyframes floatItem1 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(-5px, -10px);
          }
      }

      @keyframes floatItem2 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(5px, -8px);
          }
      }

      @keyframes floatItem3 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(-8px, 5px);
          }
      }

      @keyframes floatItem4 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(6px, 8px);
          }
      }

      @keyframes floatItem5 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(-6px, 7px);
          }
      }

      @keyframes floatItem6 {
          0%,
          100% {
              transform: translate(0, 0);
          }
          50% {
              transform: translate(5px, -6px);
          }
      }

      .hero__collage-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(
              circle,
              rgba(188, 0, 255, 0.3) 0%,
              transparent 70%
          );
          filter: blur(60px);
          z-index: -1;
          animation: pulseGlow 4s ease-in-out infinite;
      }

      @keyframes pulseGlow {
          0%,
          100% {
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1);
          }
          50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.1);
          }
      }

      .footer {
          position: relative;
          background: #f8f8fb;
          border-top: 1px solid #d0d0e0;
          padding: 4rem 2rem;
      }

      .footer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
              90deg,
              transparent 0%,
              #bc00ff 50%,
              transparent 100%
          );
      }

      .footer__container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem 4rem;
      }

      .footer__logo-row {
          display: flex;
          align-items: center;
          gap: 2rem;
      }

      .footer__logo-img {
          width: 80px;
          height: auto;
          display: block;
      }

      .footer__org-name {
          font-family:
              "Inter",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a2e;
          line-height: 1.4;
      }

      .footer__legal-info {
          color: #4a4a68;
          font-size: 0.875rem;
          line-height: 1.6;
      }

      .footer__legal-info p {
          display: inline;
      }

      .footer__legal-info p:not(:last-child)::after {
          content: " | ";
      }

      .footer__copyright {
          color: #7a7a95;
          font-size: 0.875rem;
      }

      .footer__contacts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
      }

      .footer__contacts-title {
          font-family:
              "Inter",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #bc00ff;
      }

      .footer__contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #4a4a68;
          font-size: 1rem;
      }

      .footer__contact-item i {
          color: #bc00ff;
          font-size: 1.125rem;
          width: 20px;
      }

      .footer__contact-item a:hover {
          color: #bc00ff;
      }

      .footer__socials {
          display: flex;
          gap: 1rem;
      }

      .footer__social-link {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #bc00ff;
          transition: all 0.3s ease;
          border: 2px solid #d0d0e0;
      }

      .footer__social-link:hover {
          background: #bc00ff;
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(188, 0, 255, 0.3);
          border-color: #bc00ff;
      }

      @media (max-width: 1024px) {
          .hero__container {
              flex-direction: column;
              text-align: center;
              gap: 3rem;
              padding: 3rem 2rem;
          }

          .hero__content {
              max-width: 100%;
              animation: fadeInUp 1s ease-out;
          }

          .hero__top-line {
              justify-content: center;
          }

          .hero__subtitle {
              max-width: 100%;
          }

          .hero__features-bar {
              justify-content: center;
          }

          .hero__collage {
              max-width: 500px;
              width: 100%;
              animation: fadeInUp 1s ease-out 0.3s backwards;
          }

          .hero__collage-grid {
              gap: 0.75rem;
          }

          .hero__collage-item {
              border-radius: 16px !important;
          }
      }

      @media (max-width: 768px) {
          .hero__container {
              padding: 2rem 1rem;
              gap: 2rem;
          }

          .hero__title {
              margin-bottom: 0.5rem;
              line-height: 1.2;
          }

          .hero__subtitle {
              margin-bottom: 1rem;
          }

          .hero__features-bar {
              padding: 0.625rem 1rem;
              gap: 0.6rem;
              font-size: 0.7rem;
          }

          .hero__cta {
              padding: 0.875rem 1.5rem;
              font-size: 0.85rem;
          }

          .hero__collage {
              max-width: 400px;
          }

          .hero__collage-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 0.5rem;
          }

          .hero__collage-item {
              border-radius: 12px !important;
          }

          .hero__shape--1 {
              width: 250px;
              height: 250px;
          }

          .hero__shape--2 {
              width: 200px;
              height: 200px;
          }

          .hero__shape--3 {
              width: 150px;
              height: 150px;
          }

          .hero__logo-watermark {
              width: 60%;
              max-width: 350px;
          }

          .footer {
              padding: 2rem 1rem;
          }

          .footer__container {
              grid-template-columns: 1fr;
              gap: 2rem;
          }

          .footer__logo-img {
              width: 60px;
          }

          .footer__org-name {
              font-size: 1rem;
          }

          .footer__socials {
              flex-wrap: wrap;
          }
      }

      @media (max-width: 480px) {
          .hero__top-line {
              font-size: 0.65rem;
              gap: 0.5rem;
          }

          .hero__title {
              font-size: 2rem;
              line-height: 1.15;
          }

          .hero__subtitle {
              font-size: 0.85rem;
          }

          .hero__features-bar {
              flex-wrap: wrap;
              border-radius: 12px;
              padding: 0.5rem 0.75rem;
              gap: 0.4rem;
              font-size: 0.65rem;
          }

          .hero__feature-item i {
              display: none;
          }

          .hero__cta {
              padding: 0.75rem 1.25rem;
              font-size: 0.8rem;
          }

          .hero__collage {
              max-width: 320px;
          }

          .hero__logo-watermark {
              width: 70%;
          }

          .footer__contact-item {
              font-size: 0.875rem;
          }

          .footer__social-link {
              width: 40px;
              height: 40px;
              font-size: 1.125rem;
          }

          .footer__logo-img {
              width: 50px;
          }
      }

     `}
  </style>
);

const IntroFooter = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__logo-row">
        <img
          src="/images/Logo5.png"
          alt="АНПОО Колледж Цифровых Технологий"
          className="footer__logo-img"
        />
        <p className="footer__org-name">АНПОО «Колледж Цифровых Технологий»</p>
      </div>

      <div className="footer__contacts">
        <h3 className="footer__contacts-title">Контакты</h3>
        <div className="footer__contact-item">
          <i className="fas fa-phone"></i>
          <a href="tel:+73432867859">+7 (343) 286-78-59</a>
        </div>
        <div className="footer__contact-item">
          <i className="fas fa-envelope"></i>
          <a href="mailto:it-college@it-college.ru">it-college@it-college.ru</a>
        </div>
        <div className="footer__contact-item">
          <i className="fas fa-globe"></i>
          <a
            href="https://it-college.ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            it-college.ru
          </a>
        </div>
      </div>

      <div className="footer__legal-info">
        <p>ИНН: 6671145189 | ОГРН: 1216600011429</p>
        <p>г. Екатеринбург, ул. Чкалова, д. 3</p>
        <p className="footer__copyright">
          &copy; 2025 АНПОО «Колледж Цифровых Технологий». Все права защищены.
        </p>
      </div>

      <div className="footer__socials">
        <a
          href="https://vk.com/itcollege"
          className="footer__social-link"
          aria-label="VKontakte"
        >
          <i className="fab fa-vk"></i>
        </a>
        <a
          href="https://t.me/Eka_BIT"
          className="footer__social-link"
          aria-label="Telegram"
        >
          <i className="fab fa-telegram"></i>
        </a>
      </div>
    </div>
  </footer>
);

const Hero = ({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <main className="hero">
    <div className="hero__layer hero__layer--image"></div>

    <div className="hero__layer hero__layer--light"></div>

    <div className="hero__layer hero__layer--gradient"></div>

    <div className="hero__layer hero__layer--shapes">
      <div className="hero__shape hero__shape--1"></div>
      <div className="hero__shape hero__shape--2"></div>
      <div className="hero__shape hero__shape--3"></div>
    </div>

    <div className="hero__layer hero__layer--logo">
      <img
        src="/images/Logo5.png"
        alt=""
        className="hero__logo-watermark"
      ></img>
    </div>

    <div className="hero__container">
      <HeroContent onClick={onClick} />
      <HeroCollage />
    </div>
  </main>
);

const HeroFeatureItem = ({
  title,
  iconName,
}: {
  title: string;
  iconName: string;
}) => (
  <div className="hero__feature-item">
    <i className={`fas fs-${iconName}`}></i>
    {title}
  </div>
);

const HeroContent = ({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <div className="hero__content">
    <div className="hero__top-line">
      <span className="hero__kct">Колледж Цифровых Технологий</span>
      <span className="hero__divider">/</span>
      <span className="hero__year">2025</span>
    </div>

    <h1 className="hero__title">
      <span className="hero__title-accent">Метавселенная</span>
      <span className="hero__title-main">Екатеринбург</span>
    </h1>

    <p className="hero__subtitle">
      Подзаголовок: 3D-карта города Екатеринбурга разработанная школьниками
      города
    </p>

    <div className="hero__features-bar">
      <HeroFeatureItem title="3D-модели" iconName="cube" />
      <span className="hero__features-dot"></span>
      <HeroFeatureItem title="Карта" iconName="map-marker-alt" />
      <span className="hero__features-dot"></span>
      <HeroFeatureItem title="Ученики" iconName="users" />
    </div>

    <a className="hero__cta" href="#" onClick={onClick}>
      <span className="hero__cta-text">Войти в метавселенную</span>
      <span className="hero__cta-icon">
        <i className="fas fa-arrow-right"></i>
      </span>
    </a>
  </div>
);

const HeroCollage = () => (
  <div className="hero__collage">
    <div className="hero__collage-grid">
      <div className="hero__collage-item hero__collage-item--1">
        <img src="/images/bg.png" alt=""></img>
      </div>
      <div className="hero__collage-item hero__collage-item--2">
        <img src="/images/bg2.png" alt=""></img>
      </div>
      <div className="hero__collage-item hero__collage-item--3">
        <img src="/images/bg3.png" alt=""></img>
      </div>
      <div className="hero__collage-item hero__collage-item--4">
        <img src="/images/bg4.png" alt=""></img>
      </div>
      <div className="hero__collage-item hero__collage-item--5">
        <img src="/images/bg5.png" alt=""></img>
      </div>
      <div className="hero__collage-item hero__collage-item--empty hero__collage-item--6">
        <span className="hero__collage-placeholder">***</span>
      </div>
    </div>
    <div className="hero__collage-glow"></div>
  </div>
);

export const IntroUI = () => {
  const dispatch = useDispatch();
  const { selectViewMode } = uiSlice.actions;

  const handleButtonClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(selectViewMode());
  };

  return (
    <>
      <IntroStyle />
      <div className="container">
        <Hero onClick={handleButtonClick} />
        <IntroFooter />
      </div>
    </>
  );
};
