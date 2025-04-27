# <center>OWASP Top 10</center>
---
The OWASP Top 10 is a community-driven “awareness document” that ranks the most critical web-application security risks to help developers and organizations prioritize fixes  ([OWASP Top Ten](https://owasp.org/www-project-top-ten/?utm_source=chatgpt.com)). First published in 2004, it has evolved through major rewrites in 2007, a risk-focused methodology in 2010, a data-driven update in 2013, additions of modern threats in 2017, and a root-cause redesign in 2021  ([GitHub - owasp-top/owasp-top-2004: Welcome to the OWASP Top 10 2004 ](https://github.com/owasp-top/owasp-top-2004), [GitHub - owasp-top/owasp-top-2007: Welcome to the OWASP Top 10 2007 ️](https://github.com/owasp-top/owasp-top-2007), [OWASP Top 10 - 2010](https://css.csail.mit.edu/6.858/2011/readings/owasp-top-10.pdf), [History of All OWASP Top 10 over the years - Medium](https://medium.com/%40dramkumar/history-of-all-owasp-top-10-over-the-years-9470c0adf43d?utm_source=chatgpt.com)).

## What Is the OWASP Top 10?
Imagine a “most wanted” list—but for website bugs that let hackers in. OWASP (Open Web Application Security Project) asks security experts worldwide: “Which flaws hurt the most?” The Top 10 is their answer, updated every few years to reflect new hacker tricks and software trends  ([GitHub - owasp-top/owasp-top-2004: Welcome to the OWASP Top 10 2004 ](https://github.com/owasp-top/owasp-top-2004)).

---

## 2004–2007: The First List of “Oopsies”
OWASP’s inaugural list simply named the ten most common coding mistakes in web apps  ([GitHub - owasp-top/owasp-top-2004: Welcome to the OWASP Top 10 2004 ](https://github.com/owasp-top/owasp-top-2004)):
- **A1 Unvalidated Input** (e.g. SQL injection)
- **A2 Broken Access Control**
- **A3 Broken Auth & Session Management**
- **A4 Cross-Site Scripting (XSS)**
- **A5 Buffer Overflow**
- **A6 Injection Flaws**
- **A7 Improper Error Handling**
- **A8 Insecure Storage**
- **A9 Denial of Service**
- **A10 Insecure Configuration**

---

## 2007–2010: A Full Rewrite
2007 saw a complete re-write: the list was trimmed to pure web-app issues and reordered by expert opinion  ([GitHub - owasp-top/owasp-top-2007: Welcome to the OWASP Top 10 2007 ️](https://github.com/owasp-top/owasp-top-2007)). In 2010 OWASP made it crystal-clear this is about **risk** (likelihood × impact), not just “what’s most common”  ([OWASP Top 10 - 2010](https://css.csail.mit.edu/6.858/2011/readings/owasp-top-10.pdf)). Two old items returned, two were dropped, and new ones appeared:
- **Added**: Security Misconfiguration (A6), Unvalidated Redirects & Forwards (A10)
- **Removed**: Malicious File Execution, Info Leakage & Error Handling

**2010 Top 10**  ([OWASP Top 10 - 2010](https://css.csail.mit.edu/6.858/2011/readings/owasp-top-10.pdf)):
A1 Injection · A2 XSS · A3 Broken Auth · A4 Insecure Direct Object References · A5 CSRF · A6 Security Misconfiguration · A7 Insecure Crypto Storage · A8 Failure to Restrict URL Access · A9 Insufficient Transport Layer Protection · A10 Unvalidated Redirects & Forwards

---

## 2010–2013: Data Drives the List
In 2013 OWASP turned to real vulnerability datasets (500K+ flaws) to rank items by measured prevalence  ([History of All OWASP Top 10 over the years - Medium](https://medium.com/%40dramkumar/history-of-all-owasp-top-10-over-the-years-9470c0adf43d?utm_source=chatgpt.com)). The Top 10 items stayed similar to 2010 but shuffled slightly and renamed for clarity:
- **A6** became **Sensitive Data Exposure**
- **A7** became **Missing Function-Level Access Control**
- **A9** became **Using Known Vulnerable Components**

**2013 Top 10**  ([History of All OWASP Top 10 over the years - Medium](https://medium.com/%40dramkumar/history-of-all-owasp-top-10-over-the-years-9470c0adf43d?utm_source=chatgpt.com)):
A1 Injection · A2 Broken Auth & Session Mgmt · A3 XSS · A4 Insecure Direct Object References · A5 Security Misconfiguration · A6 Sensitive Data Exposure · A7 Missing Function Level Access Control · A8 CSRF · A9 Using Known Vulnerable Components · A10 Unvalidated Redirects & Forwards

---

## 2013–2017: Modern Attack Techniques
By 2017 new threats—like XML External Entities (XXE) and Insecure Deserialization—were too big to ignore. OWASP added them and merged some older categories:
**2017 Top 10**  ([OWASP Top Ten 2017 | 2017 Top 10 | OWASP Foundation](https://owasp.org/www-project-top-ten/2017/Top_10)):
A1 Injection · A2 Broken Auth · A3 Sensitive Data Exposure · A4 XXE · A5 Broken Access Control · A6 Security Misconfiguration · A7 XSS · A8 Insecure Deserialization · A9 Using Components with Known Vulnerabilities · A10 Insufficient Logging & Monitoring

---

## 2017–2021: Root Causes & New Failures
The 2021 edition shifts focus from symptoms (e.g. “Sensitive Data Exposure”) to **root causes** (e.g. “Cryptographic Failures”) and adds two brand-new areas—Insecure Design and Software Integrity failures—plus SSRF:
**2021 Top 10**  ([OWASP Top 10:2021](https://owasp.org/Top10/)):
A01 Broken Access Control · A02 Cryptographic Failures · A03 Injection · A04 Insecure Design · A05 Security Misconfiguration · A06 Vulnerable & Outdated Components · A07 Identification & Auth Failures · A08 Software & Data Integrity Failures · A09 Security Logging & Monitoring Failures · A10 Server-Side Request Forgery

---

## Key Takeaways, ELI5
- **2004–2007**: “Here are the ten biggest coding oopsies.”
- **2010**: “Let’s rank by how risky these oopsies are.”
- **2013**: “Show me the data—let numbers decide.”
- **2017**: “New hacker tricks need new categories.”
- **2021**: “Fix the root causes (design, crypto, integrity), not just the symptoms.”
