import './App.css';
import Footer from './component/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import logolocks from './component/icons/logolocks1.png';
import heart from './component/icons/heart.svg';
import lock from './component/icons/lock.2a916e83.webp';
import door from './component/icons/door.a7527e00.webp';
import key from './component/icons/key.png';
import { Redirect, Route, useHistory } from "react-router";
import CreateAccount from './component/login/CreateAccount';
import Login from './component/login/Login';
import Home from './component/header/Home';
import Forget from './component/login/Forget';
import ChangePassword from './component/login/ChangePassword';
import ResetPassword from './component/login/ResetPassword';
import NotFound from './component/NotFound';
import { useEffect, useState } from 'react';
import KeyAuditConfirmation from './component/KeyAuditConfirmation/KeyAuditConfirmation';
import Header from './component/header/Header';

require('dotenv').config()
function App(props:any) {
  const history = useHistory();
  const [acces, setAccess] = useState("");
  const [username, setUsername] = useState<any>("");
  useEffect(()=>{
    let token:any = localStorage.getItem('refresh_token'); 
    let user:any = localStorage.getItem('username'); 
    setAccess(token);
    setUsername(user);
     console.log(window);
  },[])

  const icon = () =>{
    history.push('/home/companydetails');
  }
  const login = () =>{
    history.push('/');
  }
  const logout =()=> {
    try {
        setAccess("");
        setUsername("");
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        history.push('/');
    }
    catch (e) {
        console.log(e);
    }
};



  return (
    <div className="main-page">
        <Header acces={acces} username={username} logout={logout}/>
              <Route exact path="/" component={Login} />
              <Route exact path="/KeyAudit/:id" component={KeyAuditConfirmation} />
              <Route path="/home" component={Home} />
              <Route path="/createaccount" component={CreateAccount} />
              <Route path='/forgot' component={Forget}/>
              <Route path='/changepassword' component={ChangePassword}/>
              <Route path='/resetpassword' component={ResetPassword}/>
        
        <footer className="footer">
          <h6>© 2020 Calgary Lock & Safe. All Rights Reserved. Some logos are copyright of their respective holders. Some images courtesy of Freepik.com.</h6>
        </footer>
    </div>
  );
}

export default App;
