import Document, { Html, Head, Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      // See https://github.com/nfl/react-helmet#server-usage
      helmet: Helmet.rewind(),
    };
  }

  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  // get helmetHeadComponents () {
  //   // remove htmlAttributes which is not for <head> but for <html>
  //   console.log('this.props.helmet', this.props.helmet)
  //   return ;
  // }

  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes') // remove htmlAttributes which is not for <head> but for <html>
      .map((el) => this.props.helmet[el].toComponent())
      .filter((el) => Array.isArray(el) && el.length > 0);
  }

  render() {
    console.log('this.helmetHeadComponents', this.helmetHeadComponents);
    return (
      <Html {...this.helmetHtmlAttrComponents}>
        <Head>
          <Helmet
            htmlAttributes={{ lang: 'en' }}
            title="Hello next.js!"
            meta={[{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]}
          />
          {this.helmetHeadComponents}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
