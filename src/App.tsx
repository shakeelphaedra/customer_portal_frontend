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
import Header from './component/header/Header';
import NotFound from './component/NotFound';
import { useEffect } from 'react';
import KeyAuditConfirmation from './component/KeyAuditConfirmation/KeyAuditConfirmation';

require('dotenv').config()
function App(props:any) {
  const history = useHistory();

  useEffect(()=>{
     console.log(window);
  },[])

  const icon = () =>{
    history.push('/home/companydetails');
  }
  const login = () =>{
    history.push('/');
  }

  return (
    <div className="App">
      <div className='row'>
        <div className='col-2' >
           <img style={{width:'10.7rem',float:'left',cursor:'pointer'}} alt="locks" src={logolocks}  onClick={localStorage.getItem("access_token")? icon : login} />
        </div>
        <div className='col-6 align-items-center m-0 justify-content-end d-flex'>
          <p style={{fontStyle:'italic',textAlign:'right', margin: 0}}>Thank you for supporting Small Business</p>
        </div>
        <div className='col-2  align-items-center justify-content-center d-flex' style={{textAlign:'left'}}>
          <img style={{width:'1.55rem',margin:0}} alt="heart" src={heart} />
          <img style={{width:'1.55rem',margin:0}} alt="door" src={door} />
          <img style={{width:'1.55rem',margin:0}} alt="locks" src={key} />
          
        </div>
        <div className='col-2 align-items-center justify-content-center d-flex'>
            <p style={{fontSize:'1rem',textAlign:'left', margin: 0,fontStyle:'italic'}}>#YYC Local</p>
          </div>
      </div>
          <Route exact path="/" component={Login} />
          <Route exact path="/KeyAudit/:id" component={KeyAuditConfirmation} />
          <Route path="/home" component={Home} />
          {localStorage.getItem("access_token")?<Header />: history.push('/')}
          <Route path="/createaccount" component={CreateAccount} />
          <Route path='/forgot' component={Forget}/>
          <Route path='/changepassword' component={ChangePassword}/>
          <Route path='/resetpassword' component={ResetPassword}/>
        <Footer />
        <Route path='*' component={NotFound} />
    </div>
  );
}

export default App;
