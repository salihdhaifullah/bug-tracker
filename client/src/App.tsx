import './App.css';
import GoogleLogin from 'react-google-login';

const App = () => {

  const responseGoogle = (response: any) => {
    console.log(response);
  }

  return (
    <div className="App">
      <GoogleLogin 
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      clientId='428793859469-rupr140v093qh7tn0tmmtmg9t0al9bdj.apps.googleusercontent.com'
      />
    </div>
  );
}

export default App;
