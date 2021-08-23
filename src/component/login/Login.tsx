import React, { useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../api/api';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import './Login.css';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import ReactTooltip from 'react-tooltip';
import info from '../icons/info.svg';
import ReCAPTCHA from "react-google-recaptcha";

const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );

  const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:35%;
  margin-left:-15%;
`;
  

let Login=()=> {
    let history = useHistory()
    const mytoast:any = useRef(null);
    const recaptchaRef:any = useRef(null);

    const initialFormData = Object.freeze({
		email: '',
        password: '',
    });
    const [formData, setFormData] = useState<any>(initialFormData);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    let [loading, setLoading] = useState<any>(false);
    const [remember, setRemember] = useState<any>(false);
    const [ableToSubmit, setAbleToSubmit] = useState<any>(false);
    
    const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData,[name]:value});
    };
    
    useEffect(()=>{
        if(localStorage.getItem('email')!==''){
        setFormData({...formData, email: localStorage.getItem('email'), password : localStorage.getItem('password')});
        }
    },[]) 

    const formValidation = () =>{
        let errorEmail = '';
        let errorPassword = '';
        let isValid = true;

         if(formData.email === ''){
            errorEmail = '* Please enter a email address';
            isValid = false;
         }else
         if(!validEmailRegex.test(formData.email)){
            errorEmail = '* Please enter a valid email address';
            isValid = false ;
        }
            
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let numbers = /[0-9]/g;
        let specialcharacter = /[!@#\$%\^&\*]/g;
        if(formData.password === ''){
            errorPassword = '* Please enter a password';
            isValid = false;
        }
        setErrorEmail(errorEmail);
        setErrorPassword(errorPassword);
        return isValid
    }
    const handleVerifyRecaptch = (e: any) => {
        var recaptchaValue = recaptchaRef.current.getValue();
        if(recaptchaValue){
            setAbleToSubmit(true)
        }
    }
    const handleExpireRecaptcha = () => {
        setAbleToSubmit(false)
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();
        var recaptchaValue = recaptchaRef.current.getValue();
        if(recaptchaValue != ""){
            let isValid = formValidation();
            if(isValid){
                axiosInstance
                .post(`/api/customer/login/`, {
                    email: formData.email,
                    password: formData.password,
                })
                .then((res) => {
                    if(remember===true){
                        localStorage.setItem('email', formData.email );
                        localStorage.setItem('password', formData.password );
                        localStorage.setItem('remember', remember);
                    }   else if(remember===false){
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                        localStorage.removeItem('remember');
                    }

                    if(res.data.is_active)
                    {  
                        console.log(res.data);
                        localStorage.setItem('email', res.data.email);
                        localStorage.setItem('phone', res.data.phone);
                        localStorage.setItem('access_token', res.data.access);
                        localStorage.setItem('refresh_token', res.data.refresh);
                        localStorage.setItem('username', res.data.username);
                        localStorage.setItem('invoice', res.data.user_access.inv_statements);
                        localStorage.setItem('quotes', res.data.user_access.quotes);
                        localStorage.setItem('service_request', res.data.user_access.service_request);
                        localStorage.setItem('key_finder', res.data.user_access.key_finder);
                        localStorage.setItem('audit', res.data.user_access.audit);
                        localStorage.setItem('user_type', res.data.user_type);
                        axiosInstance.defaults.headers['Authorization'] =
                            'JWT ' + localStorage.getItem('access_token');
                        setLoading(false);
                        if(res.data.user_type==="primary"){
                            if(res.data.user_access.inv_statements || res.data.user_access.quotes){
                                history.push("/home/accounting");
                            }else {
                                history.push("/home/companydetails");
                            }
                            
                        }else if(res.data.user_type==='additional'){
                            if(res.data.last_login==null){
                                history.push("/changepassword");
                            }else {
                                if(res.data.user_access.inv_statements || res.data.user_access.quotes){
                                    history.push("/home/accounting");
                                }else {
                                    history.push("/home/companydetails");
                                }
                            }
                        }
                    }else {
                        mytoast.current.show({severity: 'error', detail: 'You are Disabled from primary user'});
                    }
                })
                .catch((error)=>{
                    mytoast.current.show({severity: 'error', detail: 'Wrong email or password'});
                    setLoading(false);
                })
                setLoading(true);

            }
        }
         
    }

    function reset() {
        history.push(`/forgot`);
    }
    function login() {
        history.push(`/createaccount`);
    }
      return (
          <>
        <div>
        {
            loading ? <div className='overlay-box1' style={{margin:0}}>
            <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
         </div> :''
        }
        <Toast ref={mytoast} />
        <ReactTooltip id="required"effect="solid" place="bottom" >
           "Password should be minimum 8 characters with atleast one uppercase, one lowercase, one special character and one numeric value"
        </ReactTooltip>
        </div>
        <div className="overview">
            
            <div className="d-flex justify-content-center own-login-container">
            
            <form onSubmit={handleSubmit} style={{marginTop:"4.375rem"}} noValidate>
                <div>
                  <label style={{fontSize:"1.875rem",textAlign:"center",marginBottom:"1.563rem"}}>Welcome</label>
                </div>
                <div className="form-group">
                    <input name="email" style={{width:"22.063rem",height:"2.5rem"}} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email ID" value={formData.email} onChange={handleInputChange}  required/>
                    <span className="errorMessage">{errorEmail}</span>
                </div>
                <div className="form-group">
                    <div className="row" style={{marginLeft:"0px"}}>
                        <input name="password"  style={{width:"22.063rem",height:"2.5rem",paddingRight:'35px'}} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={formData.password} onChange={handleInputChange} required/>
                        <img alt="info" data-for="required" data-tip="required" style={{cursor:"pointer", width:'1.25rem',padding:'0px',marginLeft:'-1.875rem'}} src={info}/>
                    </div>
                    <span className="errorMessage">{errorPassword}</span>
                </div>
                <div style={{display:"flex"}} >
                    <div className="form-group">
                        <div className="form-check">
                            <input style={{height:"1.125rem",width:"1.125rem",marginLeft:"-2.5rem" ,cursor:'pointer'}} className="form-check-input" name='remember' type="checkbox" id="gridCheck" checked={remember} onChange={(e)=>{setRemember(e.target.checked)}}/>
                            <label style={{marginLeft:"-0.625rem",paddingTop:'0.125rem',cursor:'pointer'}}  className="form-check-label" htmlFor="gridCheck">
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div>
                       <label className="create" onClick={reset} style={{marginLeft:"5.625rem"}}>
                            Reset Password ?
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <button style={{width:"22.063rem",height:"2.5rem",backgroundColor:"#009ED6"}} className="btn btn-primary" type="submit" disabled={!ableToSubmit}>Login</button>
                </div>
                <ReCAPTCHA
                    onChange={handleVerifyRecaptch}
                    ref={recaptchaRef}
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
                    onExpired={()=>{handleExpireRecaptcha()}}
                />
                <div>
                    <label className="create mt-2" onClick={login} style={{fontSize:"1rem",color:"#009ED6",fontWeight:"bold"}}>
                       Create Account 
                    </label>
                </div>
            </form>
            
            </div>
            </div> 
            </>
      );
    }

export default Login;  