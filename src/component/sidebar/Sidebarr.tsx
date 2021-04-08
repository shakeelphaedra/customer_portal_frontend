import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav} from "react-bootstrap";
import './Sidebarr.css';
import accounting from '../icons/accounting.svg';
import quotation from '../icons/Quotation.svg';
import service from '../icons/service.svg';
import manage from '../icons/add-group.svg';
import audit from '../icons/audit.svg';
import keys from '../icons/keys.svg';
import company from '../icons/company.svg';
import axiosInstance from '../../api/api';
import { NavLink, useHistory } from 'react-router-dom';
import logouticon from '../icons/log-out.svg';

let Sidebarr =()=> {
    const history = useHistory();
    const [username, setUsername] = useState<any>('');

     const logout =()=> {
        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            axiosInstance.defaults.headers['Authorization'] = null;
            history.push('/');
        }
        catch (e) {
            console.log(e);
        }
    };
    useEffect(()=>{
        let username = localStorage.getItem('username');
        setUsername(username);
    },[]);

   

    const changepassword = () =>{
        history.push('/changepassword');
    }
    
      return (
        <>
        <div>
        <Nav className="col-md-12 d-none d-md-block sidebar">
        <div className="sidebarhead">Welcome <p style={{textAlign:"center"}}>{username}</p> </div>
          <hr className='line' />
            <ul className="nav">
              <li className="nav-item text-start w-100">
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <span className="sidetext p-1 pl-4  nav-link" style={{cursor:'not-allowed'}} ><img className='sideicons' alt="sidebar" src={accounting}/>
                    <span className='linktext ml-2'>Pay Bills</span></span> : <NavLink className="sidetext p-1 pl-4  nav-link nav-link"  to="/home/accounting" ><img className='sideicons' alt="sidebar" src={accounting}/>
                    <span className='linktext ml-2'>Pay Bills</span></NavLink>}
              </li>
              <li className="nav-item text-start w-100">
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')  ? <span className="sidetext p-1 pl-4  nav-link" style={{cursor:'not-allowed'}} ><img className='sideicons' alt="sidebar" src={quotation}/>
                    <span className='linktext ml-2'>Estimations</span></span> : <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/estimations" ><img className='sideicons' alt="sidebar" src={quotation}/>
                    <span className='linktext ml-2'>Estimations</span></NavLink>}
              </li>
              <li className="nav-item text-start w-100">
                <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/servicerequest"><img className='sideicons' alt="sidebar" src={service}/>
                    <span className='linktext ml-2'>Request Service</span></NavLink>
              </li>
              <li className="nav-item text-start w-100">
                { localStorage.getItem('key_finder')=== 'true'?
                  <>
                    <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/viewkeys"><img className='sideicons' alt="sidebar" src={keys}/>
                      <span className='linktext ml-2'>Manage Keys</span>
                    </NavLink>
                    <NavLink className="sidetext p-1 pl-4  nav-link ml-2" to="/home/viewkeysgroup"><img className='sideicons' alt="sidebar" src={keys}/>
                      <span className='linktext ml-2'>Manage Keys Group</span>
                    </NavLink>
                  </> : <span className="sidetext p-1 pl-4  nav-link" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={keys}/>
                    <span className='linktext ml-2'>Manage Keys</span></span>}
              </li>
              <li className="nav-item text-start w-100">
                { localStorage.getItem('audit')=== 'true'? <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/auditreport"><img className='sideicons' alt="sidebar" src={audit}/>
                    <span className='linktext ml-2'>Audit Trail</span></NavLink> : <span className="sidetext p-1 pl-4  nav-link" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={audit}/>
                    <span className='linktext ml-2'>Audit Trail</span></span>}
              </li>
              <li className="nav-item text-start w-100">
                <NavLink className="sidetext p-1 pl-4  nav-link"  to="/home/companydetails" ><img className='sideicons' alt="sidebar" src={company}/>                
                    <span className='linktext ml-2'>Company Locations</span></NavLink>
              </li>
              <li className="nav-item text-start w-100">
                <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/manageuser"><img className='sideicons' alt="sidebar" src={manage}/>
                    <span className='linktext ml-2'>Manage Users</span></NavLink>
              </li>
              <li className="nav-item text-start w-100">
                { (localStorage.getItem('user_type')=== 'primary') ? <NavLink className="sidetext p-1 pl-4  nav-link" to="/home/systemnumber"><img className='sideicons' alt="sidebar" src={manage}/>
                    <span className='linktext ml-2'>System Number</span></NavLink> : ''}
              </li>
            </ul>
                    <div>
                        <span style={{marginTop:"0.625rem",marginRight:"3.125rem",marginBottom:'1.25rem',fontSize:'1rem'}} className="detail-created" onClick={()=>changepassword()}>Change Password</span>
                        <hr className='line' />
                        <span style={{marginTop:".5rem",marginRight:"4rem",marginBottom:'.4rem'}} className="detail-created" onClick={()=>logout()}><img style={{float:"left",marginRight:"1rem",width:'1.5rem'}} alt="sidebar" src={logouticon}/>Logout</span>
                    </div>
                
            
        </Nav>      
         </div>
        </>
      );
    }
  

export default Sidebarr;  