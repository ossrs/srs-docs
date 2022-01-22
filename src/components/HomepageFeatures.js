import React from 'react';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and used to get your website up and running
        quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your docs into the{' '}
        <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same
        header and footer.
      </>
    ),
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
  return (
    <section className={styles.features}>
      <div className="container">
        <p>
          <Translate
            id="homepage.subTitle"
            description="SRS is a simple, high efficiency and realtime video server, supports RTMP/WebRTC/HLS/HTTP-FLV/SRT."
          >
            SRS is a simple, high efficiency and realtime video server, supports RTMP/WebRTC/HLS/HTTP-FLV/SRT.
          </Translate>
        </p>
        <p>
          <img src="https://ossrs.net/wiki/images/SRS-Overview-4.0.png" />
        </p>

        <p>
          <Translate
            id="homepage.overview"
            description="Note: Please see {overview}"
            values={{
              overview: (
                <Link to="https://www.processon.com/view/link/619f29791efad425fd699fd2">
                  <Translate id="homepage.overviewLink" description="processon.com/view/link/619f29791efad425fd699fd2">
                    processon.com/view/link/619f29791efad425fd699fd2
                  </Translate>
                </Link>
              ),
            }}
          >
            {'Note: Please see {overview}'}
          </Translate>
        </p>
      </div>
    </section>
  );
}
