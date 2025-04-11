// Rightbar.js
import React from "react";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md"; // Import icons
import styles from "./rightbar.module.css"; // Ensure your CSS module is correctly configured

const Rightbar = ({ recommand }) => {
  console.log(recommand);
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          {/* Replace Next.js Image with a standard img tag */}
          <img className={styles.bg} src="/astronaut.png" alt="Background" />
        </div>
        <div className={styles.text}>
          <span className={styles.notification}> Recommendations</span>
          <h3 className={styles.title}>
            Adjust Ventilation, Activate Cooling Systems
          </h3>
          <h3 className={styles.title}>
            Enhance Ventilation, Dehumidification Systems
          </h3>
          <h3 className={styles.title}>
            Ventilation Improvement, Inert Gas Injection
          </h3>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>Improve </span>
          <h3 className={styles.title}>Adjust Ventilation:</h3>
          <p className={styles.desc}>
            If possible, increase ventilation to promote air circulation and
            help dissipate heat. Adequate ventilation is essential for
            preventing the formation of hotspots within the storage.
          </p>
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>Improve </span>
          <h3 className={styles.title}>Inert Gas Injection:</h3>
          <p className={styles.desc}>
            Consider the injection of inert gases, such as nitrogen or carbon
            dioxide, into the storage environment. Inert gases displace
            oxygen and create an atmosphere less conducive to combustion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
