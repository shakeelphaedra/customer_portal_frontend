import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav} from "react-bootstrap";
import './Sidebarr.css';
import accounting from '../icons/invoice.svg';
import estimates from '../icons/estimates.svg';
import service from '../icons/repairing-service.svg';
import manageUser from '../icons/profile.svg';
import manager from '../icons/manager.svg';
import audit from '../icons/shopping-list.svg';
import keys from '../icons/keys.svg';
import company from '../icons/location.svg';
import { NavLink, useHistory } from 'react-router-dom';
import logouticon from '../icons/log-out.svg';

let Sidebarr =()=> {
    const history = useHistory();
    const [username, setUsername] = useState<any>('');
    const [active, setActive] = useState<any>(false);
    
    useEffect(()=>{
        let username = localStorage.getItem('username');
        setUsername(username);
    },[]);

    let checkActive = () => {
      setActive(!active)
    }

    const changepassword = () =>{
        history.push('/changepassword');
    }
    
      return (
        <section className="sidebar-left-main">
          <div className="sidebar-left">
            <a href="#" className="action-btn">
              <i className="fa fa-angle-right" aria-hidden="true"></i></a>
            <ul>
              <li>
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <a href="#" ><img className='sideicons' alt="sidebar" src={accounting}/>
                      Pay Bills</a> : <NavLink  to="/home/accounting" ><img className='mr-3' alt="sidebar" src={accounting}/>
                      Pay Bills</NavLink>}
              </li>
              <li>
              { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <a href="#" ><img className='sideicons' alt="sidebar" src={estimates}/>
                      Estimations</a> : <NavLink  to="/home/estimations" ><img className='mr-3' alt="sidebar" src={estimates}/>
                      Estimations</NavLink>}
              </li>
              <li>
                <NavLink  to="/home/servicerequest"><img className='mr-3' alt="sidebar" src={service}/>
                      Request Service</NavLink>
              </li>
              <li>
                { localStorage.getItem('key_finder')=== 'true'?
                  <>
                    <a className="has-content" href="#" onClick={checkActive}><img className="mr-3" src={keys}/>
                      Manage Keys
                    </a>
 
                    <ul className={"inner " + active ? "active" : ""}>
                      <li>
                        <NavLink  to="/home/viewkeys"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/home/viewkeysgroup"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys Group
                        </NavLink>
                      </li>
                      <li>
                        <NavLink  to="/home/auditkeys">
                          Audit Keys<span className="text-danger text-bold ml-2">NEW</span>
                        </NavLink>
                      </li>
                    </ul>
                  </> : <>
                    <a className="has-content" href="#"><img className='mr-3' alt="sidebar" src={keys}/>
                      Manage Keys
                    </a>
                    <ul className="inner">
                      <li>
                        <a  href="#"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys
                        </a>
                      </li>
                      <li>
                        <a href="#"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys Group
                        </a>
                      </li>
                      <li>
                        <a  href="#">
                          Audit Keys<span className="text-danger text-bold ml-2">NEW</span>
                        </a>
                      </li>
                    </ul>
                  </>
                  }
             </li>
              <li>
              { localStorage.getItem('audit')=== 'true'? <NavLink  to="/home/auditreport"><img className='mr-3' alt="sidebar" src={audit}/>
                    Audit Trail</NavLink> : <a href="#" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={audit}/>
                    Audit Trail</a>}
              </li>
              <li> 
                 <NavLink   to="/home/companydetails" ><img className='mr-3' alt="sidebar" src={company}/>                
                    Company Locations</NavLink>
              </li>
             
           <li>
              <NavLink  to="/home/manageuser"><img className='mr-3' alt="sidebar" src={manageUser}/>
                    Manage Users</NavLink>
              </li>
           <li>
              { (localStorage.getItem('user_type')=== 'primary') ? <NavLink  to="/home/systemnumber"><img className='mr-3' alt="sidebar" src={manager}/>
                    System Number</NavLink> : ''}
            </li>
            </ul>
          </div>
          <div className="overly"></div>
		  	</section>
      );
    }
  


export default Sidebarr;  