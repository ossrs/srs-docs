import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import hldHdImage from "../../static/img/SRS-SingleNode-4.0-hd.png";
import hldSdImage from "../../static/img/SRS-SingleNode-4.0-sd.png";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (<>
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          <Translate id="homepage.subTitle"/>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/v4/doc/learning-path">
            {siteConfig.title}&nbsp;
            {translate({id: 'homepage.tutorial'})}
          </Link>
        </div>
      </div>
      <div className="container">
        <p>
          <a href={hldHdImage} target='_blank' rel='noreferrer'>
            <img src={hldSdImage}/>
          </a>
        </p>
      </div>
    </header>
  </>);
}

export default function Home() {
  return (
    <Layout
      title={`SRS (Simple Realtime Server)`}
      description={translate({id: 'homepage.subTitle'})}
    >
      <HomepageHeader/>
      <main>
        <HomepageFeatures/>
      </main>
    </Layout>
  );
}
