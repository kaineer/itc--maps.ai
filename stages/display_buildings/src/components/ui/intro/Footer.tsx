import classes from "./Footer.module.css";

const FooterLogo = () => (
  <div className={classes.logoRow}>
    <img
      src="/images/Logo5.png"
      className={classes.logoImg}
      alt="АНПОО Колледж Цифровых Технологий"
    ></img>

    <p className={classes.orgName}>АНПОО Колледж Цифровых Технологий</p>
  </div>
);

const FooterContacts = () => (
  <div className={classes.contacts}>
    <h3 className={classes.contactsTitle}>Контакты</h3>
    <div className={classes.contactItem}>
      <i className="fas fa-phone"></i>
      <a href="tel:+73432867859">+7 (343) 286-78-59</a>
    </div>
    <div className={classes.contactItem}>
      <i className="fas fa-envelope"></i>
      <a href="mailto:it-college@it-college.ru">it-college@it-college.ru</a>
    </div>
    <div className={classes.contactItem}>
      <i className="fas fa-globe"></i>
      <a href="https://it-college.ru" target="_blank" rel="noopener noreferrer">
        it-college.ru
      </a>
    </div>
  </div>
);

const FooterLegalInfo = () => (
  <div className={classes.legalInfo}>
    <p>ИНН: 6671145189 | ОГРН: 1216600011429</p>
    <p>г. Екатеринбург, ул. Чкалова, д. 3</p>
    <p className={classes.copyright}>
      &copy; 2025 АНПОО «Колледж Цифровых Технологий». Все права защищены.
    </p>
  </div>
);

const FooterSocials = () => (
  <div className={classes.socials}>
    <a
      href="https://vk.com/itcollege"
      className={classes.link}
      aria-label="VKontakte"
    >
      <i className="fab fa-vk"></i>
    </a>
    <a
      href="https://t.me/Eka_BIT"
      className={classes.link}
      aria-label="Telegram"
    >
      <i className="fab fa-telegram"></i>
    </a>
  </div>
);

export const Footer = () => (
  <div className={classes.footer}>
    <div className={classes.container}>
      <FooterLogo />
      <FooterContacts />
      <FooterLegalInfo />
      <FooterSocials />
    </div>
  </div>
);
