import "../../styles/globals.css";
import type { AppProps } from "next/app";
import store from "../redux/store";
import { Provider } from "react-redux";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />;
      </Provider>
    </>
  );
}

export default MyApp;
