import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import axiosInstance from '../../api/api';
import save from '../icons/floppy-disk.svg';
//import MultiSelect from "react-multi-select-component";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Select from 'react-select';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: #ccc;
  top:40%;
  margin-left:-16%;
`;

const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );

let AddNewUser = (props:any) =>{
    let history = useHistory();
    const toast: any = useRef();
    const initialFormData = Object.freeze({
        first_name:'',
        last_name:'',
        email: '',
        phone:'',
        key_finder:false,
        service_request:false,
        inv_statements:false,
        quotes: false,
        hs_signatory:false,
        add_user:false,
        audit:false,
    });
    const [formData, setFormData] = useState(initialFormData);
    const [file, setFile] = useState<any>([]);
    const [selected, setSelected] = useState<any>([]);
    const [loading, setLoading] = useState<any>(false);
    const options = file.map((item: any,i: any)=>{ 
            return (
            { label: item.file_number+((item.location===null)?'':" - "+item.location), value: item.id})
      });


    const handleChange = (event:any) => {
        setSelected(Array.isArray(event) ? event.map(x => x.value) : []);
      }

    const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
        let name = e.target.name;
        let value = e.target.value;
        setFormData({...formData,[name]:value});
        
    };
    const handleCheckboxChange = (e: { target: { name: any; checked:any }; }) =>{
        let name = e.target.name;
        let checked = e.target.checked;
        setFormData({...formData,[name]:checked});
        
    };

    useEffect(() =>{
        const fetchDataAsync = async () => {
            try {
                const api = '/api/customer/user/file-numbers/';
                let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
                setFile(response.data.data);
                return file;
            }catch(error){
                throw error;
            }
         }   
         fetchDataAsync()
      },[]);
    

    function cancel() {
        props.addnewuser(false);
    
       }

       const formValidation = () =>{
        let isValid = true;
        const node = toast.current;
        let numbers = /[0-9]/g;
         if(formData.first_name === ''){
            if(node){
                node.show({severity: 'error',  detail: "Please enter First Name"});
                }
            isValid = false;
         }else if(formData.last_name === ''){
            if(node){
                node.show({severity: 'error',  detail: "Please enter Last Name"});
                }
            isValid = false;
         }else if(formData.email=== ''){
            if(node){
                node.show({severity: 'error',  detail: "Please enter Email Address"});
                }
            isValid = false ;
        }else if(!validEmailRegex.test(formData.email)){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid Email Address"});
                }
            isValid = false ;
        }else if(formData.phone === ''){
            if(node){
                node.show({severity: 'error',  detail: "Please enter Phone Number"});
                }
            isValid = false ;
        }else if(!formData.phone.match(numbers)){
            if(node){
                node.show({severity: 'error',  detail: "Please enter a valid Phone Number"});
                }
            isValid = false ;
        }
        return isValid
    }


    const handleSubmit = (e:any) => {
		e.preventDefault();
        let isValid = formValidation();
        if(isValid){
        try{
            setLoading(true);
        axiosInstance
			.post(`/api/customer/manage/user/`, {
                first_name:formData.first_name,
                last_name:formData.last_name,
                email:formData.email,
                file_numbers:selected,
                phone:formData.phone,
                useraccess:
                 {
                    key_finder: formData.key_finder,
                    service_request: formData.service_request,
                    inv_statements:formData.inv_statements,
                    quotes: formData.quotes,
                    hs_signatory:formData.hs_signatory,
                    add_user:formData.add_user,
                    audit:formData.audit,
                } ,
                method: "post"
            },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
                let node = toast.current;
                if(res.data.status===200){
                    setLoading(false);
                    props.addnewuser(false);
                    props.addtoast();
                    setFormData({...formData, 
                        first_name:'',
                        last_name:'',
                        email: '',
                        phone:'',
                        key_finder:false,
                        service_request:false,
                        inv_statements:false,
                        quotes: false,
                        hs_signatory:false,
                        add_user:false,
                        audit:false,
                     });
                     setSelected([]);
                   
                   
                } else {
                    setLoading(false);
                    if(node){
                    node.show({severity: 'error',  detail: res.data.message});
                    }
                }
            })
            .catch((error)=>{
                setLoading(false);
                if(toast.current){
                toast.current.show({severity: 'error',  detail: "Server error try again"});
                }
                
            })
           
        } catch(error){
             throw error;
        }
    }
    }
 
        return(
            <>
            <div>
            
            <Toast ref={toast} />
               <div style={{height:"calc(100vh - 7rem)",backgroundColor:'white'}} className="content" >
               {loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
                </div> :''}
                <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                                <div className="col-6">
                                    <p style={{color:"#fff",textAlign:"left",marginTop:"0.6rem"}}>Add New User</p>
                                </div>
                                <div className="col-6">
                                    <span className="detail-created" onClick={handleSubmit} ><img style={{marginRight:"0.5rem",marginLeft:'0.625rem',width:'1rem'}} alt="save" src={save} />Save</span>
                                    <span className="detail-created" onClick={cancel}>x</span>
                                </div>
                        </div>
                    </div>
                </div><br/>
                <div className="row" style={{padding:"20px"}}>
                    <div className="col-4">
                        <input type="text" name="first_name" className="form-control" placeholder="Enter First Name *" value={formData.first_name} onChange={handleInputChange}/>
                    </div>
                    <div className="col-4">
                        <input type="text" name="last_name" className="form-control" placeholder="Enter Last Name *" value={formData.last_name} onChange={handleInputChange}/>
                    </div>
                    <div className="col-4">
                        <input type="text" name='email' className="form-control" placeholder="Enter Email ID *" value={formData.email} onChange={handleInputChange}/>
                    </div>
                    </div>
                    <div className="row" style={{padding:"1.25rem"}}>
                    <div className="col-4">
                        {/* <MultiSelect
                            options={options}
                            value={options.filter((obj: { value: any; }) => selected.includes(obj.value))} 
                            onChange={handleChange}
                            labelledBy={"Select"}
                        /> */}
                        <Select
                            className="dropdown"
                            placeholder="Select System Number *"
                            value={options.filter((obj: { value: any; }) => selected.includes(obj.value))} // set selected values
                            options={options} // set list of the data
                            onChange={handleChange} // assign onChange function
                            isMulti
                            isClearable
                        />
                    </div>
                    <div className="col-4">
                        <input type="text" name='phone' className="form-control" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange}/>
                    </div>
                    <div>
                </div>
                
                </div>
                <br></br>
                
                <div  style={{backgroundColor:'#fff'}}>
                
                <div className="form-check">
                    <div className="row">
                        <div  style={{backgroundColor:"	#F0F0F0",marginLeft:"-1.5rem",marginBottom:"1.25rem", height:"3.125rem"}} className="col-12">
                            <span style={{float:"left",fontWeight:500,fontSize:"1.1rem",padding:"0.625rem"}}>Assign Permissions</span>
                        </div>
                        
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="key_finder" checked={formData.key_finder} className="form-check-input" type="checkbox"  id="flexCheckDefault" onChange={handleCheckboxChange} disabled={!props.permissions.key_finder}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                               Manage Keys
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="service_request" checked={formData.service_request}  className="form-check-input" type="checkbox"  id="flexCheckDefault1" onChange={handleCheckboxChange} disabled={!props.permissions.service_request}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Request Service
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="inv_statements" checked={formData.inv_statements} className="form-check-input" type="checkbox"  id="flexCheckDefault2" onChange={handleCheckboxChange} disabled={!props.permissions.inv_statements}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Pay Bills
                            </label>
                        </div>
                    </div><br></br>
                    <div className="row">
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}}  name="quotes"  className="form-check-input" type="checkbox"  checked={formData.quotes} id="flexCheckDefault3" onChange={handleCheckboxChange} disabled={!props.permissions.quotes}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Accept Estimations
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="hs_signatory" checked={formData.hs_signatory} className="form-check-input" type="checkbox"  id="flexCheckDefault4" onChange={handleCheckboxChange} disabled={!props.permissions.hs_signatory}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Key Authorizers
                            </label>
                        </div>
                    </div><br></br>
                    <div className="row" >
                        <div className="col-4" style={{paddingBottom:'1.3rem',cursor:'pointer'}}>
                            <input style={{height:"1.375rem",width:"1.375rem"}} name="add_user" checked={formData.add_user}  className="form-check-input" type="checkbox"  id="flexCheckDefault5" onChange={handleCheckboxChange} disabled={!props.permissions.add_user}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Users
                            </label>
                        </div>
                        <div className="col-4"  >
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="audit" checked={formData.audit} className="form-check-input" type="checkbox"  id="flexCheckDefault6" onChange={handleCheckboxChange}  disabled={!props.permissions.audit}/>
                            <label style={{paddingLeft:"1.1em",marginTop:"0.25rem"}} className="form-check-label" >
                                Audit Trails
                            </label>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
            </>
        );
    }
export default AddNewUser;
