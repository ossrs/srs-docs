import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Translate, {translate} from '@docusaurus/Translate';
import easyToUse from '../../static/img/easy-to-use-xs.png';
import foucsOn from '../../static/img/focus-on-xs.png';
import highEfficiency from '../../static/img/high-efficiency-xs.png';

const FeatureList = [
  {
    title: translate({id: 'homepage.easyToUseName'}),
    Image: easyToUse,
    description: <Translate id='homepage.easyToUse' />,
  },
  {
    title: translate({id: 'homepage.focusOnName'}),
    Image: foucsOn,
    description: <Translate id='homepage.focusOn' />,
  },
  {
    title: translate({id: 'homepage.highEfficiencyName'}),
    Image: highEfficiency,
    description: <Translate id='homepage.highEfficiency' />,
  },
];

function Feature({ Image, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Image} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (<>
    <section className={styles.features}>
        <div className="container text--center margin-bottom--xl">
          <div className="row">
            {FeatureList.map((e, index) => {
              return <Feature key={index} {...e}></Feature>;
            })}
          </div>
        </div>
    </section>
  </>);
}
