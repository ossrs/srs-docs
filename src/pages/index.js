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
import useIsBrowser from "@docusaurus/core/lib/client/exports/useIsBrowser";

function HomepageHeader() {
  const context = useDocusaurusContext();
  const isBrowser = useIsBrowser();
  const shanghaiTimezone = function () {
    return [
      'Asia/Shanghai', 'Asia/Harbin', 'Asia/Chongqing', 'Asia/Kashgar', 'Asia/Urumqi'
    ].includes(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } ();
  const enLanguage = context.i18n.currentLocale === 'en-us';
  const alwaysShowCloudService = function() {
    if (!isBrowser) return false;
    return window.location.hostname === 'localhost' || window.location.href.indexOf('cloud=1') > 0;
  } ();

  React.useEffect(() => {
    console.log(`?cloud=1 to show cloud service, current: ${alwaysShowCloudService}`);
  }, []);

  return (<>
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{context.siteConfig.title}</h1>
        <p className="hero__subtitle">
          <Translate id="homepage.subTitle"/>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/v6/doc/getting-started">
            {translate({id: 'homepage.getStarted'})}
          </Link>&nbsp;
          {(alwaysShowCloudService || (enLanguage && !shanghaiTimezone)) &&
            <Link className="button button--secondary button--lg" to="/cloud">
              {translate({id: 'homepage.cloudService'})}
            </Link>
          }
        </div>
      </div>
      <div className={clsx('container', styles.imageHLD)}>
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
      <img src='https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/index'/>
    </Layout>
  );
}
