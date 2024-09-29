// pages/_app.js
import '../styles/globals.css'; // Asegúrate de tener el archivo globals.css en styles

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
