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
              <li className={"" + ((window.location.pathname==="/home/accounting")? "active" : "")}>
                { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <a href="#" ><img className='sideicons' alt="sidebar" src={accounting}/>
                      Pay Bills</a> : <NavLink  to="/home/accounting" ><img className='mr-3' alt="sidebar" src={accounting}/>
                      Pay Bills</NavLink>}
              </li>
              <li className={"" + ((window.location.pathname==="/home/estimations")? "active" : "")}>
              { (localStorage.getItem('invoice')=== 'false' || localStorage.getItem('quotes')=== 'false')   ? <a href="#" ><img className='sideicons' alt="sidebar" src={estimates}/>
                      Estimations</a> : <NavLink  to="/home/estimations" ><img className='mr-3' alt="sidebar" src={estimates}/>
                      Estimations</NavLink>}
              </li>
              <li className={"" + ((window.location.pathname==="/home/servicerequest")? "active" : "")}>
                <NavLink  to="/home/servicerequest"><img className='mr-3' alt="sidebar" src={service}/>
                      Request Service</NavLink>
              </li>
              <li onClick={checkActive} className={"inner " + ((["/home/viewkeys","/home/viewkeysgroup","/home/auditkeys"].includes(window.location.pathname)||active===true) ? "active" : "")}>
                { localStorage.getItem('key_finder')=== 'true'?
                  <>
                    <a className="has-content" href="#" ><img className="mr-3" src={keys}/>
                      Manage Keys
                    </a>
 
                    <ul >
                      <li className={"" + ((window.location.pathname==="/home/viewkeys")? "active" : "")}>
                        <NavLink  to="/home/viewkeys"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys
                        </NavLink>
                      </li>
                      <li className={"" + ((window.location.pathname==="/home/viewkeysgroup")? "active" : "")}>
                        <NavLink to="/home/viewkeysgroup"><img className='mr-3' alt="sidebar" src={keys}/>
                          Manage Keys Group
                        </NavLink>
                      </li>
                      <li className={"" + ((window.location.pathname==="/home/auditkeys")? "active" : "")}>
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
              <li className={"" + ((window.location.pathname==="/home/auditreport")? "active" : "")}>
              { localStorage.getItem('audit')=== 'true'? <NavLink  to="/home/auditreport"><img className='mr-3' alt="sidebar" src={audit}/>
                    Audit Trail</NavLink> : <a href="#" style={{cursor:'not-allowed'}}><img className='sideicons' alt="sidebar" src={audit}/>
                    Audit Trail</a>}
              </li>
              <li className={"" + ((window.location.pathname==="/home/companydetails")? "active" : "")}> 
                 <NavLink   to="/home/companydetails" ><img className='mr-3' alt="sidebar" src={company}/>                
                    Company Locations</NavLink>
              </li>
             
           <li className={"" + ((window.location.pathname==="/home/manageuser")? "active" : "")}>
              <NavLink  to="/home/manageuser"><img className='mr-3' alt="sidebar" src={manageUser}/>
                    Manage Users</NavLink>
              </li>
           <li className={"" + ((window.location.pathname==="/home/systemnumber")? "active" : "")}>
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