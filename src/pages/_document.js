/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { HelmetProvider } from 'react-helmet-async';

// Via https://github.com/vercel/next.js/blob/canary/examples/with-react-helmet/pages/_document.js

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const helmetContext = {};
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <HelmetProvider context={helmetContext}>
              <App {...props} />
            </HelmetProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      helmet: helmetContext.helmet,
    };
  }

  render() {
    const { helmet } = this.props;

    return (
      <Html {...helmet.htmlAttributes.toComponent()}>
        <Head>
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
        </Head>
        <body {...helmet.bodyAttributes.toComponent()}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
