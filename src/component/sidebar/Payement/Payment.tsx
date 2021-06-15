import React, { useEffect } from 'react';
import { useState } from 'react';
import './Payment.css';
import axiosInstance, {baseURL} from '../../../api/api';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
`;
const validEmailRegex = RegExp(
    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
  );

const Payment = (props:any) => {
    const toast: any = useRef();
    const initialFormData = Object.freeze({
         number:'',
         street:'',
         postalcode:'',
         email:'',
         invoiceNumber:0,
         invoiceAmount:0,
         loading:false,
         phone: '',
         invoiceModalIsOpen:true,
    });

    const [formData, setFormData]:any = useState(initialFormData);
    const [email, setEmail]:any = useState("");
    const [phone, setPhone]:any = useState("");

    useEffect(()=> {
        renderPayment();
        console.log(props);
    },[]);
    const changeEmail = (e: any) => {
        setEmail(e.target.value)
    }
    const changePhone = (e: any) => {
        setPhone(e.target.value)
    }
    const renderPayment = async()=> {
        setFormData({...formData,loading:true});
        try {
            const api = `/api/customer/get-payment-token/`;
            let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
            setFormData({...formData, token:response.data.token});
        
        let authorization = response.data.token;
        //console.log(authorization);
        var form = document.querySelector('#cardForm');
        
        window.braintree.client.create({
            authorization: authorization
        }, (err, clientInstance)=> {
        if(err){
            console.log(err);
            return;
        }
        createHostedFields(clientInstance, form);
        });

        const createHostedFields = (clientInstance:any, form:any) => {
        window.braintree.hostedFields.create({
            client: clientInstance,
            styles: {
                'input': {
                'font-size': '16px',
                'font-family': 'courier, monospace',
                'font-weight': 'lighter',
                'color': '#ccc'
                },
                ':focus': {
                'color': 'black'
                },
                '.valid': {
                'color': '#8bdda8'
                },
                '.invalid': {
                'color': 'red'
                }
            },
            fields: {
                number: {
                selector: '#card-number',
                placeholder: 'Card Number'
                },
                cvv: {
                selector: '#cvv',
                placeholder: 'CVV'
                },
                expirationDate: {
                selector: '#expiration-date',
                placeholder: 'Expiry'
                },
            }
            }, hostedFieldsDidCreate);
          }
        }catch(error){
            console.log("Error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }
    function hostedFieldsDidCreate(err:any, hostedFields:any) {
        setFormData({...formData,loading:false});
        let submitBtn = document.getElementById('submit');
        submitBtn?.addEventListener('click', (e)=>submitHandler(e, hostedFields));
        submitBtn?.removeAttribute('disabled');
      }

      function submitHandler( event:any,hostedFields:any,) {
        event.preventDefault();
        setFormData({...formData,loading:true});
        let submitBtn = document.getElementById('submit');
        submitBtn?.setAttribute('disabled', 'disabled');
        console.log(hostedFields);
        hostedFields.tokenize().then((payload:any) => {
            console.log(payload.nonce);
            if(payload.nonce){
            if(props.invoiceAddress){
                axiosInstance
			.post(`api/customer/invoice/payment/${props.loc_no}/`, {
                payment_method_nonce: payload.nonce,
                location: props.invoiceLocation,
                address: props.invoiceAddress,
                amount: props.selectedAmount,
                list_of_invoice: props.selectedProducts,
                email: email,
                phone: phone
			})
			.then((res) => {
                setFormData({...formData,loading:false});
                if(res.data.status===202){
                    toast.current.show({severity: 'success', detail: 'Payment successful'});
                    setFormData({...formData, invoiceModalIsOpen:false});
                    props.getItem(formData.invoiceModalIsOpen);
                }else{
                    toast.current.show({severity: 'error', detail: 'Payment Denied'});
                }
                console.log(res);
            }).catch((error)=>{
                setFormData({...formData,loading:false});
                toast.current.show({severity: 'error', detail: 'Server error'});
            })
            }else if(props.invoice){
            axiosInstance
			.post(`api/customer/invoice/payment/`, {
                payment_method_nonce: payload.nonce,
                amount: props.amount,
                invoice: props.invoice,
                email: email,
                phone: phone
			})
			.then((res) => {
                setFormData({...formData,loading:false});
                if(res.data.status===202){
                    toast.current.show({severity: 'success', detail: 'Payment successful'});
                    setFormData({...formData, allInvoiceModalIsOpen:false});
                }else{
                    toast.current.show({severity: 'error', detail: 'Payment Denied'});
                }
                console.log(res);
            }).catch((error)=>{
                setFormData({...formData,loading:false});
                toast.current.show({severity: 'error', detail: 'Server error'});
            })
         }else if(props.invoiceALLLocation){
            axiosInstance
			.post(`api/customer/invoice/all/payment/`, {
                payment_method_nonce: payload.nonce,
                location: props.invoiceALLLocation,
                amount: props.selectedAmount,
                list_of_invoice: props.selectedProducts,
                email: email,
                phone: phone
			})
			.then((res) => {
                setFormData({...formData,loading:false});
                if(res.data.status===202){
                    toast.current.show({severity: 'success', detail: 'Payment successful'});
                    setTimeout(()=> {
                        props.getItem(false)
                    }, 1000) 
                }else{
                    toast.current.show({severity: 'error', detail: 'Payment Denied'});
                }
                console.log(res);
            }).catch((error)=>{
                setFormData({...formData,loading:false});
                toast.current.show({severity: 'error', detail: 'Server error'});
            })
         }else if(props.quote){
            axiosInstance
			.post(`api/customer/quote/payment/`, {
                payment_method_nonce: payload.nonce,
                amount: props.amount,
                quote: props.quote,
                email: email,
                phone: phone
			})
			.then((res) => {
                setFormData({...formData,loading:false});
                if(res.data.status===202){
                    toast.current.show({severity: 'success', detail: 'Payment successful'});
                }else{
                    toast.current.show({severity: 'error', detail: 'Payment Denied'});
                }
                console.log(res);
            }).catch((error)=>{
                setFormData({...formData,loading:false});
                toast.current.show({severity: 'error', detail: 'Server error'});
            })
        }
        }
        }).catch((err:any)=> {
            debugger
            setFormData({...formData,loading:false});
            submitBtn?.removeAttribute('disabled');
            console.error('Error',err.message);
            toast.current.show({severity: 'error', detail: err.message})
        })
      }

    
      const cancelBtn = (e:any) => {
        props.cancelBtn()
      }

    const formValidation = () =>{
        let isValid = true;
       /*  let numbers = /[0-9]/g;
        if(formData.cnumber === ''){
            isValid = false;
         }else if(!formData.cnumber.match(numbers)){
            isValid = false ;
        }else if(formData.name === ''){
            isValid = false;
         }else if(formData.expiry === ''){
            isValid = false ;
        }else if(formData.email === ''){
            isValid = false ;
        }else if(!validEmailRegex.test(formData.email)){
            isValid = false ;
        }else if(formData.cvv === ''){
            isValid = false ;
        }else if(!formData.cvv.match(numbers)){
            isValid = false ;
        }else if(formData.number === ''){
            isValid = false ;
        }else if(!formData.number.match(numbers)){
            isValid = false ;
        }else if(formData.street === ''){
            isValid = false ;
        }else if(formData.postalcode === ''){
            isValid = false ;
        } */
        return isValid
    }
    
    return (
        <>
            <div className="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded" >
              <Toast ref={toast} />
                <div className="MuiDialogTitle-root" style={{padding: 0}}>
                    <h2 className="MuiTypography-root MuiTypography-h6 mb-2">Pay Invoice</h2>
                </div>
                <div className="MuiDialogContent-root" style={{padding: 0}}>
                    <p className="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary">
                        Please enter your payment information</p>
                    <div className="MuiBox-root jss123">
                        <div className="MuiBox-root jss124" style={{display: 'flex', flex: '1 1 0px'}}>
                            <div className="rccs">
                                <div className="rccs__card rccs__card--unknown">
                                    <div className="rccs__card--front">
                                        <div className="rccs__card__background"></div>
                                        <div className="rccs__issuer"></div>
                                        <div className="rccs__cvc__front"></div>
                                        <div className="rccs__number">•••• •••• •••• ••••</div>
                                        <div className="rccs__name">YOUR NAME HERE</div>
                                        <div className="rccs__expiry">
                                            <div className="rccs__expiry__valid">valid thru</div>
                                            <div className="rccs__expiry__value">••/••</div>
                                        </div>
                                        <div className="rccs__chip"></div>
                                    </div>
                                    <div className="rccs__card--back">
                                        <div className="rccs__card__background"></div>
                                        <div className="rccs__stripe"></div>
                                        <div className="rccs__signature"></div>
                                        <div className="rccs__cvc"></div>
                                        <div className="rccs__issuer"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="MuiBox-root jss125" style={{display: 'flex', flex: '1 1 0px', paddingLeft: '0.5rem',marginTop:'-3rem'}}>
                        <form action="/" method="post" id="cardForm" style={{marginTop: "2rem"}}>
                            <div className="col pr-0" style={{padding:'.3rem', paddingTop: '1rem'}}>
                                <div id='card-number' className='form-control'></div>
                            </div>
                            <div className="col pr-0" style={{padding:'.3rem'}}>
                                <input type="text" id='card-holder-name' placeholder="Name" className='form-control' style={{color: '#8bdda8'}} required/>
                            </div>
                            <div className="col pr-0" style={{padding:'.3rem'}}>
                                <div id='expiration-date' className='form-control'></div>
                            </div>
                            <div className="col pr-0" style={{padding:'.3rem'}}>
                                <div id='cvv' className='form-control'></div>
                            </div>

                        </form>

                        {
                         formData.loading ?  <div className="overlay-box1">
                                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={formData.loading}  height={30} width={5} radius={2} margin={20} />
                            </div>
                            : ""
                        }
                            </div>
                            </div>
                                {/* <div className="MuiBox-root jss130" style={{minWidth: '450px'}}>
                                    
                                        <div className="row" style={{width:'35rem'}}>
                                            <div className="col" style={{padding:'.25rem'}}>
                                            <input type="text" className="form-control" name='number' placeholder="Number" onChange={handleInputChange}/>
                                            </div>
                                            <div className="col" style={{padding:'.25rem'}}>
                                            <input type="text" className="form-control" name='street' placeholder="Street" onChange={handleInputChange}/>
                                            </div>
                                            <div className="col" style={{padding:'.25rem'}}>
                                            <input type="text" className="form-control" name='postalcode' placeholder="Postal Code" onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                        
                                </div>
                                <div className="MuiBox-root jss131" style={{marginLeft:'-1.1rem'}}>
                                      <div className="col" style={{padding:'.5rem'}}>
                                            <input type="email" className="form-control" name='email' placeholder="Email" onChange={handleInputChange}/>
                                      </div>
                                    </div> */}
                </div>         
                                    
                            <div className="d-flex" >
                                <input type="text" onChange={changePhone} value={phone} id='phone' placeholder="Number" className='form-control' style={{color: '#8bdda8'}} required/>
                                <input type="text" id='street' placeholder="Street" className='form-control' style={{color: '#8bdda8'}} required/>
                                <input type="text" placeholder="Postal" id='postal-code' className='form-control' style={{color: '#8bdda8'}} required/>
                            </div>
                            <input type="email" onChange={changeEmail} value={email} placeholder="Email" id='email' style={{color: '#8bdda8'}} className='form-control mt-2' required/>

                      {   formValidation() ? 
                          <div style={{textAlign: "end"}}>
                          <button 
                            className="btn text-danger" style={{fontWeight: 'bold', fontSize: '12px', marginTop: '10px',}}
                             id='cancel' ><span className="MuiButton-label" onClick={cancelBtn} >CANCEL</span>
                             </button>
                             
                          <button 
                            className="btn MuiTypography-colorTextSecondary" style={{fontWeight: 'bold',padding: 0,marginLeft: '8px', marginTop: '10px', fontSize: '12px'}}
                             type="submit" id='submit' ><span className="MuiButton-label"  >SUBMIT PAYMENT</span>
                             </button>
                          </div> : 
                          <div>
                              <button 
                            className="btn text-danger" style={{fontWeight: 'bold', fontSize: '12px', marginTop: '10px',}}
                              id='cancel' ><span className="MuiButton-label"  onClick={cancelBtn}>CANCEL</span>
                             </button>
                             
                            <button 
                            className="btn MuiTypography-colorTextSecondary" style={{fontWeight: 'bold',padding: 0,marginLeft: '8px', marginTop: '10px', fontSize: '12px'}}
                             type="submit" id='submit' disabled><span className="MuiButton-label"  >SUBMIT PAYMENT</span>
                             </button>
                          </div>
                      }
             </div>                
        
        </>
    )
}

export default Payment;