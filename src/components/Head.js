import NextHead from "next/head";

const Head = () => (
  <NextHead>
    <title>Racial Justice Act Demo tool</title>
    <link rel="icon" href="https://paperprisons.org/images/favicon.png" />
    {/* Google Tag Manager */}
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M10EKLMHHL');
        `
      }}
    />
  </NextHead>
);

export default Head;
