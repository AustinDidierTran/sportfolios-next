This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, make sure you have your two projects at the same level:

![](projects.png)

## Certificates

Create your certificates:

```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Put your files (localhost.crt and localhost.key) in a folder at the root named certificates:

![](certificates.png)

If you have a problem with your certificates you can consult this article:

```bash
https://anmagpie.medium.com/secure-your-local-development-server-with-https-next-js-81ac6b8b3d68

```

## NPM

After, install npm:

```bash
npm install
```

## conf.js

Then, create a file name conf.js at the root, copy the content from conf-template.js

## Run it

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

# React | Next.js : Best practices for a perfomant app

## Loadable component :

#### Use case

- Overloaded DOM
- Complex/Large components that aren't immediatly necessary on the page
- Component that don't render immediatly in the viewport

#### How to use

1. `import loadable from '@loadable/component'`
2. With the component that will become loadable:
   `const MyComponent = loadable(() => import('../MyComponent'));`
3. In the return/render function:
   `<MyComponent />`

---

## Material-ui

- Use named imports when posssible
- `material-ui/icons` is known for increasing bundle size massively, avoid it if possible.

---

## Image compression

- Set the width and height attributes of images inline :
  `<img width="200px" height="200px" />`

---

## Large library/Default and Named imports

- **AVOID** :

  - ![](https://i.imgur.com/gtONOHM.png)

- **DO INSTEAD** :
  - ![](https://i.imgur.com/xEEU7V4.png)

## LightHouse Performance and PWA audits

### General tips

Lighthouse audits may vary when performed. It is recommended to average at least 5 runs to establish standards.

**Important :** one should note that any chrome extensions and/or devTools extensions may hinder Lighthouse audits and result in poor performance score. It is better to test in a browser with **no** extensions or in incognito mode.

### Hardware recommended

- 4-8 GB of RAM
- At least 2 dedicated core
- If possible, run on a dedicated machine

### External factors

- Comment and/or remove non-determinist code
- Run Lighthouse with devTools in horizontal mode, if devTools take to much space, it may influence audits
- Use localhost
- Anti-virus software can influence audits

### Official doc

- **Variability** : https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md
- **Performance audits** : https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md#performance

---
