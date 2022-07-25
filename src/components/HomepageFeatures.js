import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Translate, {translate} from '@docusaurus/Translate';

const FeatureList = [
  {
    title: translate({id: 'homepage.easyToUseName'}),
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: <Translate id='homepage.easyToUse' />,
  },
  {
    title: translate({id: 'homepage.focusOnName'}),
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: <Translate id='homepage.focusOn' />,
  },
  {
    title: translate({id: 'homepage.highEfficiencyName'}),
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: <Translate id='homepage.highEfficiency' />,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
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
