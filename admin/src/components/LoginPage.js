// LoginPage.jsx
const React = require("react");

// function LoginPage() {
//   return React.createElement(
//     'div',
//     null,
//     React.createElement('h1', null, 'Iniciar sesión en Webunal'),
//     React.createElement('a', { href: '/webunal-login/google' }, 'Iniciar sesión con Google')
//   );
// }

function LoginPage({
  siteName = "Nombre del sitio web",
  siteSubtitle = "CMS - Gestor de contenidos",
  loginInstructions = "Accede con tu correo institucional @unal.edu.co, serás redirigido para validar tu identidad.",
  contactEmail = "XXXXXXXX@unal.edu.co",
}) {
  // Estilos en línea
  const styles = {
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Altura de toda la ventana
      width: '100vw',  // Ancho de toda la ventana
      margin: 0,       // Elimina márgenes
      padding: 0,      // Elimina padding
      backgroundImage: 'url(/background.png)', // Imagen de fondo
      backgroundSize: 'cover', // Ajusta la imagen para cubrir todo el fondo
      backgroundRepeat: 'no-repeat', // Evita que se repita
      backgroundPosition: 'center', // Centra la imagen
    },
    loginCard: {
      width: '452px',
      borderRadius: '20px 40px 20px 40px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    loginImageSection: {
      height: '33%',
      width: '100%',
    },
    loginImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    loginContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3px',
      flexGrow: 1,
    },
    loginTitle: {
      fontSize: '30px',
      marginBottom: '0px',
      marginLeft: '30px',
      color: '#333',
      alignSelf: 'flex-start',
    },
    loginSubtitle: {
      fontSize: '24px',
      marginTop: '0px',
      paddingLeft: '30px',
      color: '#332f2f',
      alignSelf: 'flex-start',
    },
    loginText: {
      fontSize: '15px',
      textAlign: 'left',
      paddingLeft: '30px',
    },
    loginGoogle: {
      textAlign: 'center',
      marginTop: 'auto',
      padding: '0px 0',
      position: 'relative',
      bottom: '5px',
      top: '25px',
      borderRadius: '5px',
    },
    googleLoginButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      border: '2px rgb(55, 53, 53) solid',
      borderRadius: '8px 12px 8px 12px',
      cursor: 'pointer',
      height: '45px',
    },
    googleIcon: {
      marginRight: '10px',
    },
    googleText: {
      fontSize: '16px',
      margin: '0px 0',
      fontWeight: 'bold',
    },
    divider: {
      width: '85%',
      height: '1px',
      backgroundColor: '#a2a3a4',
      margin: '50px auto',
    },
    loginFooter: {
      textAlign: 'center',
      marginTop: 'auto',
      padding: '0px 0',
      position: 'relative',
      bottom: '50px',
    },
    accessProblems: {
      color: '#666',
      fontSize: '14px',
      margin: '0px 0',
    },
    accessProblems2: {
      color: '#677d29',
      fontSize: '14px',
      margin: '0px 0',
      fontWeight: 'bold',
    },
    loginContentP: {
      margin: '4px 0',
    },
  };

  return (
    React.createElement(
      'div',
      { style: styles.loginContainer },
      React.createElement(
        'div',
        { style: styles.loginCard },
        React.createElement(
          'div',
          { style: styles.loginImageSection },
          React.createElement('img', { src: '/image.png', alt: 'Login background', style: styles.loginImage })
        ),
        React.createElement(
          'div',
          { style: styles.loginContent },
          React.createElement('h2', { style: styles.loginTitle }, siteName),
          React.createElement('p', { style: styles.loginSubtitle }, siteSubtitle),
          React.createElement('p', { style: styles.loginText }, loginInstructions),
          React.createElement(
            'div',
            { style: styles.loginGoogle },
            React.createElement(
              'a',
              {
                style: styles.googleLoginButton,
                href: '/webunal-login/google',
              },
              React.createElement('img', {
                src: '/google.png',
                style: styles.googleIcon,
                width: 24,
                height: 24,
              }),
              React.createElement('p', { style: styles.googleText }, 'ACCEDER CON GOOGLE')
            )
          )
        ),
        React.createElement('hr', { style: styles.divider }),
        React.createElement(
          'div',
          { style: styles.loginFooter },
          React.createElement('h4', null, '¿Tienes problemas para acceder?'),
          React.createElement('p', { style: styles.accessProblems }, 'Informar de un problema al siguiente correo'),
          React.createElement('p', { style: styles.accessProblems2 }, contactEmail)
        )
      )
    )
  );
}

module.exports.default = LoginPage;

// function LoginPage() {
//   return (
//     <div>
//       <h1>Iniciar sesión en Webunal</h1>
//       <a href="/webunal-login/google">Iniciar sesión con Google</a>
//     </div>
//   );
// }

// export default LoginPage;
