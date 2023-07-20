# SRS Security

请将任何安全漏洞报告到[这里](https://github.com/ossrs/srs/security/advisories)。

## CVE-2023-34105

Command injection in demonstration api-server for HTTP callback.

* Severity: **High**
* Advisory: [GHSA-vpr5-779c-cx62](https://github.com/ossrs/srs/security/advisories/GHSA-vpr5-779c-cx62)
* [CVE-2023-34105](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-34105)
* Not vulnerable: v5.0.157+, v5.0-b1+, v6.0.48+
* Vulnerable: v5.0.137-v5.0.156, v6.0.18-v6.0.47
* The patch: [1e43bb6](https://github.com/ossrs/srs/commit/1e43bb6b9fe7d6e0d5ffda6410d1206e8e7c1fb1) (v5.0.157), [1d878c2](https://github.com/ossrs/srs/commit/1d878c2daaf913ad01c6d0bc2f247116c8050338) (v6.0.48)

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/security-advisories-zh)
