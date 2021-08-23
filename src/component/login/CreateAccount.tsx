import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance, {baseURL} from '../../api/api';
import './Login.css';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import ReactTooltip from 'react-tooltip';
import info from '../icons/info.svg';
const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-right:-18%;
`;

let CreateAccount=()=>{
    let history = useHistory();
    const toast:any = useRef(null);

    const initialFormData = Object.freeze({
        accountnumber:'',
        email: '',
        confirm_email:'',
        firstname:'',
        lastname:'',
        phonenumber:'',
        password: '',
    });
    const [formData, setFormData] = useState<any>(initialFormData);
    const [loading, setLoading] = useState<any>(false);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData,[name]:value});
    };
      
    const formValidation= () =>{
        let isValid = true;
        const node = toast.current;
        let numbers = /[0-9]/g;
        let lowerCaseLetters = /[a-z]/g;
        let upperCaseLetters = /[A-Z]/g;
        let specialcharacter = /[!+@#\$%\^&\*]/g;
        let reWhiteSpace = new RegExp(/^\s+$/);
        debugger
        if(formData.accountnumber === '' || formData.email === '' || formData.firstname === '' || formData.lastname === '' || formData.phonenumber === '' || formData.password === ''){
            if(node){
            node.show({severity: 'error', detail: "Please Enter all fields"});
            }
            isValid = false ;
        }else if(formData.phonenumber.match(lowerCaseLetters) || formData.phonenumber.match(upperCaseLetters) || formData.phonenumber.match(specialcharacter) || formData.phonenumber.includes(' ')){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid Phone Number"});
                }
            isValid = false ;
        }else if(!validEmailRegex.test(formData.email)){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid Email Address"});
                }
            isValid = false ;
        }else if(!(formData.email === formData.confirm_email)){
            if(node){
                node.show({severity: 'error',  detail: "Email Address is not matched"});
                }
            isValid = false ;
        }else if(!(formData.password.trim().length >= 8 && formData.password.match(numbers) && formData.password.match(lowerCaseLetters) && formData.password.match(upperCaseLetters) && formData.password.match(specialcharacter))){
            if(node){
                node.show({severity: 'error',  detail: "Password should be minimum 8 characters with atleast one uppercase, one lowercase, one special character and one numeric value"});
                }
            isValid = false;
        }
        return isValid
    }

    const handleSubmit = (e:any) => {
		e.preventDefault();
        let isValid = formValidation();
        if(isValid){
            setLoading(true);
        try {
            axiosInstance
			.post(`/api/customer/create/primary/`, {
				account_number: formData.accountnumber,
                email: formData.email,
                confirm_email : formData.confirm_email,
                first_name: formData.firstname,
                last_name: formData.lastname,
                phone: formData.phonenumber,
                password: formData.password,
			})
			.then((res) => {
                let node = toast.current;
                if(res.data.status===200){
                    //history.push('/');
                    setFormData({...formData,accountnumber:'',
                    email: '',
                    confirm_email:'',
                    firstname:'',
                    lastname:'',
                    phonenumber:'',
                    password: '',})
                     if(node){
                       node.show({severity: 'success', detail: res.data.message});
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    if(node){
                       node.show({severity: 'error', detail: res.data.message});
                    }
                }
                
            });
            //setLoading(true);
        } catch(error){
            setLoading(false);
             throw error;
        }
    }
  }

    function login() {
        history.push(`/`);
    
       }
      return (
        <div >
            {
                loading ? <div className='overlay-box1'>
                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
            </div> :''
            }
            <Toast ref={toast} />
            <ReactTooltip id="required"effect="solid" place="bottom" >
            "Password should be minimum 8 characters with atleast one uppercase, one lowercase, one special character and one numeric value"
            </ReactTooltip>
	            <div className="d-flex justify-content-center own-login-container">
                    
                    <form onSubmit={handleSubmit} style={{marginTop:"4.375rem"}} > 
                        <div>
                          <label style={{fontSize:"1.875rem",textAlign:"center",marginBottom:"1.563rem"}}>Create an Account</label>
                        </div>
                        <div className="row">
                            <div className="col" style={{paddingBottom:'0.625rem'}}>
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="accountnumber"  className="form-control"   placeholder="Account Number *" value={formData.accountnumber} onChange={handleInputChange}/>
                            </div>
                            <div className="col">
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="phonenumber" className="form-control"   placeholder="Phone Number *" value={formData.phonenumber} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={{paddingBottom:'0.625rem'}}>
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="email" type="email"  className="form-control"  placeholder="Email ID *" value={formData.email} onChange={handleInputChange}/>
                            </div>
                            <div className="col">
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="confirm_email" type="email"  className="form-control"  placeholder="Confirm Email ID *" value={formData.confirm_email} onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" style={{paddingBottom:'0.625rem'}}>
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="firstname" className="form-control" id="exampleInputEmail1"  placeholder="First Name *" value={formData.firstname} onChange={handleInputChange}/>
                            </div>
                            <div className="col">
                                <input style={{width:"15.625rem",height:"2.5rem"}} name="lastname" className="form-control"  placeholder="Last Name *"  value={formData.lastname} onChange={handleInputChange}/>
                            </div>
                        </div>
                            <div className="col">
                                <div className="row" style={{marginLeft:"-0.75rem"}}>
                                    <input style={{width:"33.125rem",height:"2.5rem"}} name="password" type="password" className="form-control"  placeholder="Password*" value={formData.password} onChange={handleInputChange}/>
                                    <img alt="info" data-for="required" data-tip="required" style={{cursor:"pointer", width:'1.25rem',padding:'0px',marginLeft:'-1.563rem'}} src={info}/>
                                </div>
                            </div>
                        <br></br>
                        
                        <div>
                            <button style={{width:"33.125rem",height:"2.5rem",backgroundColor:"#009ED6",borderColor:"#009ED6"}} className="btn btn-primary" type="submit">Create</button>
                        </div>
                        <div>
                            <label className="mt-4 text-center">
                              <span className="create" onClick={login} style={{marginLeft:".4rem",marginTop:"-2rem",fontSize:"1rem",color:"#009ED6",fontWeight:"bold"}}>
                               Log In 
                            </span>
                            </label>
                            
                        </div>
                    </form>
                </div>
            </div>
      );
    }

export default CreateAccount;  