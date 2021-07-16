import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect, Route, useHistory } from "react-router";

/* import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Redirect, Route, useHistory } from "react-router";

import Home from './Home';
import Services from './Servics';
import Product from './Product';
import Industries from './Industries';
import News from './News';
import About from './About';
import ContactUs from './ContactUs'; */
import './Header.css';
import logolocks from '../icons/logo.png';
import axiosInstance from '../../api/api';

function Header(props:any) {
    const [acces, setAccess] = useState("");
    const [username, setUsername] = useState<any>("");

    React.useEffect(() => {
        let token:any = localStorage.getItem('refresh_token'); 
          let user:any = localStorage.getItem('username'); 
          debugger
          setAccess(token);
          setUsername(user);
        window.addEventListener("storage",(e) => {
            debugger
        });   
        window.addEventListener('storage', () => {
          let token:any = localStorage.getItem('refresh_token'); 
          let user:any = localStorage.getItem('username'); 
          debugger
          setAccess(token);
          setUsername(user);
        });
    }, [])
    const history = useHistory();
    const logout =()=> {
        try {
            setAccess("");
            setUsername("");
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            axiosInstance.defaults.headers['Authorization'] = null;
            history.push('/');
        }
        catch (e) {
            console.log(e);
        }
    };
    
    const icon = () =>{
        history.push('/home/companydetails');
    }
    const login = () =>{
        history.push('/');
    }
      return (
        <header className="header">
            <nav className="navbar navbar-expand-lg navbar-light bg-light p-0">
                <a className="navbar-brand mr-0" href="#">
                    <img style={{float:'left',cursor:'pointer'}} alt="locks" src={logolocks}  onClick={localStorage.getItem("access_token")? icon : login} width="200"/>
                </a>
                {
                    acces ? <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle userInfo" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="d-md-inline-block d-none">Welcome</span> <strong>{username}</strong>
                            <span className="userImg"></span>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#" onClick={logout}>LOGOUT</a>
                        </div>
                    </li>
                </ul> : ''
                }
                
            </nav>
        </header>
      )
  }

export default Header;  