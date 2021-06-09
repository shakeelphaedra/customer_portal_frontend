import React from 'react';
import AccountingDetails from './AccountingDetails';
import viewa from '../icons/viewa.svg';
import axiosInstance, {baseURL} from '../../api/api';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import dollar from '../icons/dollar.svg';
import cancel from '../icons/cancel.svg';
import question from '../icons/question-mark.svg';
import Modal from 'react-modal';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import fileDownload from 'js-file-download'
import Payment from './Payement/Payment';
import  jsPDF from "jspdf";
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';
import image from '../icons/pdf-1.svg';
const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

interface Props{
    edit:boolean;
    data:any;
    loc_no:any;
    last_name: any;
    cus_no:any;
    braintreeClientToken:any;
    terms:any;
    total_amount:any;
    loading : boolean;
    modalIsOpen:any;
    paymentModalIsOpen:any;
    invoiceModalIsOpen:any;
    allInvoiceModalIsOpen:any;
    address :any;
    location:any;
    amount :any;
    message:any;
    offset: any;
    perPage: any;
    totalRecords: any;
    pageCount:any;
    tableData :any;
    allInvoice:any;
    selectedProducts:any;
    selectedAmount:any;
    card:boolean;
    invoiceLocation:any;
    invoiceAddress:any;
    invoiceLoc_no:any;
    selectedAllProducts:any;
    selectedAllAmount:any;
    over_30:any;
    over_60:any;
    over_90:any;
  }
class Accounting extends React.Component<{},Props> {
  mytoast: React.RefObject<any>;
  instance: any;
    constructor(props:Props){
        super(props);
        this.mytoast = React.createRef();
        this.state={
          edit:false,
          data: [],
          loc_no:'',
          last_name : '',
          cus_no :'',
          terms:'',
          total_amount:'',
          over_30:'',
          over_60:'',
          braintreeClientToken: null,
          over_90:'',
          loading : false,
          modalIsOpen: false,
          paymentModalIsOpen: false,
          invoiceModalIsOpen:false,
          allInvoiceModalIsOpen:false,
          address : '',
          location : '',
          amount : '',
          message: '',
            offset: 0,
            perPage: 10,
            totalRecords: 0,
            pageCount:0,
            tableData : [],
            allInvoice:[],
            selectedProducts: null,
            selectedAmount: 0,
            selectedAllProducts:null,
            selectedAllAmount:0,
            card:false,
            invoiceLocation:'',
            invoiceAddress:'',
            invoiceLoc_no:'',
        }}

        customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-20%',
              transform             : 'translate(-50%, -50%)',
              width                 : '31.5rem',
              height                : '33.75rem'
            }
          };
          invoiceStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-20%',
              transform             : 'translate(-50%, -50%)',
              width                 : '46.875rem',
              height                : '37.5rem',
            }

          };


         exportPDFinvoices = async() => {
          /* try {
            const api = 'customer/accounting/all/invoice/';
            this.setState({loading:true});
            let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });

        }catch(error){
            const node = this.mytoast.current;
            this.setState({loading : false});
            if(node){
                node.show({severity: 'error', detail: 'Server Error'});
            }
            throw error;
        } */
        /* const unit = "pt";
          const size = "A4"; // Use A1, A2, A3 or A4
          const orientation = "portrait"; // portrait or landscape
          const marginLeft = 40;
          const doc = new jsPDF(orientation, unit, size);
          doc.setFontSize(15);
      
          const title = "Invoices";
          const headers = [["Location Name", "Address"]];
          const data = this.state.data.map((item:any)=> [item.location, item.address]);
      
          let content = {
            startY: 50,
            head: headers,
            body: data
          };
          doc.text(title, marginLeft, 40);
          (doc as jsPDF & { autoTable: autoTable }).autoTable (content);
          doc.save("Invoices.pdf");  */
      };
           

        exportPDFsingleinvoices = async(location:any,address:any,loc_no:any) => {

          this.setState({loading:true});
            try {
              const api = `/api/customer/invoice/payment/${loc_no}/`;
              let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
              if(!(this.state.allInvoice === null))
              {
                  this.setState({loading : false});
              }
              const unit = "pt";
          const size = "A4"; // Use A1, A2, A3 or A4
          const orientation = "portrait"; // portrait or landscape
          const marginLeft = 40;
          const doc = new jsPDF(orientation, unit, size);
          doc.setFontSize(15);
      
          const headers = [["Invoice number", "Amount"]];
          const data = response.data.map((item:any)=> [item.invoice, item.amount]);
      
          let content = {
            startY: 100,
            head: headers,
            body: data
          };
          doc.text(`${location}`, marginLeft, 40);
          doc.text(`${address}`, marginLeft, 80);
          (doc as jsPDF & { autoTable: autoTable }).autoTable (content);
          doc.save("Invoices.pdf"); 
          }catch(error){
              this.setState({loading : false});
              throw error;
          }
          
          
        };

        componentDidMount = async ()=>{
            try {
                const api = '/api/customer/accounting/';
                this.setState({loading:true});
                let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
                this.setState({data:response.data.data.map((obj:any)=>{
                    return({...obj, showDetails: false
                    })
                  })});
                    let slice = response.data.data.slice(this.state.offset, this.state.offset + this.state.perPage);
                    this.setState({pageCount: Math.ceil(response.data.data.length / this.state.perPage), totalRecords: response.data.data.length});
                    this.setState({tableData:slice.map((obj:any)=>{
                        return({...obj, showDetails: false
                        })
                      })});
                if(!(this.state.data.length === 0))
                {
                    this.setState({loading : false});
                }else {
                  this.setState({loading : false});
                  this.mytoast.current.show({severity: 'error',  detail: 'No record found'});
                }
                this.setState({last_name:response.data.last_name, cus_no: response.data.cus_no, terms:response.data.terms, total_amount:response.data.total_amount, over_30:response.data.over_30, over_60:response.data.over_60, over_90:response.data.over_90})
            }catch(error){
                const node = this.mytoast.current;
                this.setState({loading : false});
                if(node){
                    node.show({severity: 'error', detail: 'Server Error'});
                }
                throw error;
            };
            this.getbraintreeClientToken()
        }

        async getbraintreeClientToken(){
          let response = await axiosInstance.get('/api/customer/braintree/get_client_token', { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
          const token = response.data.token;
          this.setState({braintreeClientToken: token})
        }

        formValidation = () =>{
          let isValid = true;
          if(this.state.message === ''){
                  this.mytoast.current.show({severity: 'error', detail: "Please enter Description"});
              isValid = false;
           }
          return isValid
      }

         handleSubmit = (e:any) => {
            e.preventDefault();
            let isValid = this.formValidation();
            if(isValid){
            this.setState({loading:true});
            try{
            axiosInstance
                .post(`/api/customer/accounting/help/`, {
                    location:this.state.location,
                    loc_no:this.state.loc_no,
                    address:this.state.address,
                    amount:this.state.amount,
                    message:this.state.message,
                },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
                )
                .then((res) => {
                  this.setState({loading:false});
                    const node = this.mytoast.current;
                    if(res.data.status===200){
                        if(node){
                            node.show({severity: 'success',  detail: 'Query Send Successfully'});
                        }
                        this.setState({message:'',modalIsOpen:false});
                    } else {
                        if(node){
                          node.show({severity: 'error',  detail: 'Something went wrong, please contact to Calgary Lock and Safe'});
                        }
                    }
                })
                .catch((error)=>{
                  this.setState({loading:false});
                    const node = this.mytoast.current;
                    if(node){
                        node.show({severity: 'error',  detail: 'Something went wrong'});
                      }
                })
               
            } catch(error){
                 throw error;
            }
          }
        }

        onPageChange = (event:any) => {
          let offset = event.first;
          let perPage = event.rows;
          this.setState({offset:offset, perPage:perPage});
          let slice = this.state.data.slice(offset, offset + perPage);
          this.setState({tableData:slice});
      }

        details=(loc_no:any,id:any)=> {
            const updatedData = this.state.tableData.map((obj:any,i:number)=>{
              if(i===id){
                if(obj.showDetails=== false){
                  this.setState({loading:true});
                }
              }
                if(i===id){
                  obj.showDetails = true;
                }else{
                  obj.showDetails = false;
                }
                return {...obj}
                });
              this.setState({tableData :updatedData});
            //this.setState({edit:true});
            this.setState({loc_no:loc_no});
           };

           loadt = () =>{
            this.setState({loading:true});
          }
           load = () =>{
             this.setState({loading:false});
           }
           
           cancel(id:any) {
            const updatedData = this.state.tableData.map((obj:any,i:number)=>{
                if(i===id){
                  obj.showDetails = false;
                }
                return {...obj}
            })
            this.setState({tableData: updatedData});
           }

           renderEditForm=(show:any,id:any)=>{
            if(show){
              return(
                <>
                <tr style={{height:"0px"}}>
                    <td colSpan={6}>
                        <div className="accordian"> 
                          <div className="col-12">
                              <div className="row">
                                  <div className="col-6">
                                      <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Invoice Details</p>
                                  </div>
                                  <div className="col-6">
                                    <span className="detail-created" onClick={()=>this.cancel(id)} >Close</span>
                                </div>
                              </div>
                          </div>
                        </div>
                        <AccountingDetails load={this.load} loadt={this.loadt} locationNo={this.state.loc_no} cus_no={this.state.cus_no}/>
                     </td>
                </tr>
               </>
              )
            }
          } 
          async buy() {
            const { nonce } = await this.instance.requestPaymentMethod();
            const api = `/api/customer/payments/`;
            const data = {"nonce" :  nonce, "amount" : this.state.selectedAllAmount}
            debugger
            let response = await axiosInstance.post(api, data, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });

          }

          renderBillingModal = () => {
            return (
                !this.state.braintreeClientToken ? 
                    <div>
                      <h1>Loading...</h1>
                    </div>
                :
                    
                <div>
                {/* <DropIn
                  options={{
                    authorization: this.state.braintreeClientToken
                  }}
                  onInstance={(instance) => (this.instance = instance)}
                /> */}
                <button className="btn btn-primary" onClick={this.buy.bind(this)}>Buy Now!</button>
              </div>
        
            )
          }
          renderModal = () =>{ 
            return(
                <>

                <div>
                <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
               </div>
                <div style={{marginLeft:'0.938rem'}}>
                    <div className="form-group row">
                        <label htmlFor="staticEmail" style={{color:"#888888", fontSize:'0.875rem'}} className="col-4 col-form-label">Location:</label>
                        <div className="col-sm-6">
                           <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.location}</span>
                        </div>
                    </div>  
                    <div className="form-group row">
                        <label style={{color:"#888888", fontSize:'0.875rem'}}  className="col-sm-4 col-form-label">Address:</label>
                        <div className="col-sm-6">
                           <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.address}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{color:"#888888", fontSize:'0.875rem'}}  className="col-sm-4 col-form-label">Location_number:</label>
                        <div className="col-sm-6">
                           <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.loc_no}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label style={{color:"#888888", fontSize:'0.875rem'}}  className="col-sm-4 col-form-label">Amount:</label>
                        <div className="col-sm-6">
                           <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.amount}</span>
                        </div>
                    </div>  <br></br>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1" style={{color:"#888888"}} >Request Description</label>
                        <textarea className="form-control" style={{width:'26.188rem', height:'7.375rem'}} id="exampleFormControlTextarea1" name='message' value={this.state.message} onChange={(e)=>{this.setState({message : e.target.value})}}></textarea>
                    </div>
                    <div>
                  <   button style={{backgroundColor:"#009ED6",width:"26.188rem", height:'2.5rem'}} onClick={this.handleSubmit} className="btn btn-primary" type="submit">Send</button>
                  </div>
                </div>
                </div>
                </>
            )
          }

          totalSelectedAmount = async(e:any) =>{
            let sel = e.value;
            var sum = 0;
            await this.setState({selectedProducts : sel});
            this.state.selectedProducts.map((item:any)=>{
               sum = sum + parseFloat(item.amount);
            });
            this.setState({selectedAmount:sum.toFixed(2)});
          } 
          
          totalAllSelectedAmount = async(e:any) =>{
            let sel = e.value;
            var sum = 0;
            await this.setState({selectedAllProducts : sel});
            this.state.selectedAllProducts.map((item:any)=>{
               sum = sum + parseFloat(item.amount);
            });
            this.setState({selectedAllAmount:sum.toFixed(2)});
          } 

          pay = () =>{
            this.setState({card:true});
          }
          
          cancelPay = () =>{
            this.setState({card:false});
          }

          changeModal = () =>{
            const node = this.mytoast.current;
            if(node){
                node.show({severity: 'success', detail: 'Payment Success'});
            }
            this.setState({invoiceModalIsOpen:false, allInvoiceModalIsOpen: false, card: false});
            window.open("https://payments.calgarylockandsafe.com/")

          }

          renderInvoiceModal = () =>{
            if(this.state.card){
              return (
                <><div>
                <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
                </div>
                <Payment invoiceLocation={this.state.invoiceLocation} 
                         invoiceAddress={this.state.invoiceAddress}
                         selectedAmount={this.state.selectedAmount}
                         selectedProducts={this.state.selectedProducts}
                         loc_no={this.state.invoiceLoc_no}
                         getItem={this.changeModal}
                         cancelBtn={this.cancelPay}

                          />
                <div style={{textAlign:'center'}}>
                <button 
                  className="btn btn-outline-danger"
                  type="button"><span className="MuiButton-label" onClick={this.cancelPay} >Cancel</span><span
                      className="MuiTouchRipple-root"></span></button>
                  </div>         
                  </div>   
                </>
              )
          }else{
              return(
                  <>
                  <div>
                  <div style={{textAlign:'right'}}>
                      <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
                  </div> 
                    <div className='row' style={{marginBottom:'1.25rem',marginTop:'-1.6rem'}}>
                      <div className='col-2' style={{borderRight:'2px solid black',textAlign:'end'}}>
                      <img alt='paylog' style={{width:'2.5rem'}} src='https://static.wixstatic.com/media/ebff0f_1022b7d5a7974f889c0d33e0de62d5b3~mv2.png/v1/crop/x_0,y_0,w_87,h_101/fill/w_92,h_100,al_c,lg_1,q_85/Logo.webp'/>
                      </div>
                      <div className='col-8'>
                      <p style={{fontSize:"1.7rem",fontWeight:'bold',marginBottom:'.25rem'}}>CUSTOMER PAYMENT CENTER</p>
                      </div>
                    </div>
                      <div style={{height:'60vh',overflow:'auto'}}>
                      <DataTable value={this.state.allInvoice} selection={this.state.selectedProducts} onSelectionChange={this.totalSelectedAmount}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="invoice" header="Invoice Number"></Column>
                        <Column field="amount" header="Balance"></Column>
                      </DataTable>
                      </div>
                      { (this.state.selectedProducts===null  || this.state.selectedProducts.length === 0 ) ?
                      <div style={{textAlign:'right'}}>
                       <button type="submit" style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}}
                         className="btn btn-primary" disabled>Pay Now  ${this.state.selectedAmount}</button>  
                      </div> :
                      <div style={{textAlign:'right'}}>
                      <button type="submit" style={{backgroundColor:"#?009ED6",borderColor:"#009ED6"}}
                        className="btn btn-primary" onClick={this.pay}>Pay Now  ${this.state.selectedAmount}</button>  
                        {/* <a href={'https://payments.calgarylockandsafe.com/'} style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}} */}
                        {/* className="btn btn-primary" >Pay Now  ${this.state.selectedAmount}</a> */}
                     </div>
                        }
                  </div>
                  </>
              )
          }
          }
          

          renderAllInvoiceModal = () =>{
            if(this.state.card){
              return (
                <>
                <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
                </div>
                <Payment invoiceALLLocation={this.state.last_name} 
                         selectedAmount={this.state.selectedAllAmount}
                         selectedProducts={this.state.selectedAllProducts}
                         getItem={this.changeModal}
                         cancelBtn={this.cancelPay}
                          />
                <div style={{textAlign:'center'}}>

                  </div>         
                          
                </>
              )
          }else{
              return(
                  <>
                  <div>
                  <div style={{textAlign:'right'}}>
                     <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
                  </div>
                    <div className='row' style={{marginBottom:'1.25rem',marginTop:'-1.6rem'}}>
                      <div className='col-2' style={{borderRight:'2px solid black',textAlign:'end'}}>
                      <img alt='paylog' style={{width:'2.5rem'}} src='https://static.wixstatic.com/media/ebff0f_1022b7d5a7974f889c0d33e0de62d5b3~mv2.png/v1/crop/x_0,y_0,w_87,h_101/fill/w_92,h_100,al_c,lg_1,q_85/Logo.webp'/>
                      </div>
                      <div className='col-8'>
                      <p style={{fontSize:"1.7rem",fontWeight:'bold',marginBottom:'.25rem'}}>CUSTOMER PAYMENT CENTER</p>
                      </div>
                    </div>
                    <div>
                      <p style={{paddingLeft:'3.25rem'}}><span style={{fontWeight:500}}>Location : </span>  {this.state.last_name}</p>
                    </div>
                      <div style={{height:'60vh',overflow:'auto'}}>
                      <DataTable value={this.state.allInvoice} selection={this.state.selectedAllProducts} onSelectionChange={this.totalAllSelectedAmount}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="invoice" header="Invoice Number"></Column>
                        <Column field="amount" header="Balance"></Column>
                      </DataTable>
                      </div>
                      { (this.state.selectedAllProducts===null || this.state.selectedAllProducts.length === 0 ) ?
                      <div style={{textAlign:'right'}}>
                       <button type="submit" style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}}
                         className="btn btn-primary" disabled>Pay Now  ${this.state.selectedAllAmount}</button>  
                      </div> :
                      <div style={{textAlign:'right'}}>
                      <button type="submit" style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}}
                        className="btn btn-primary" onClick={this.pay}>Pay Now  ${this.state.selectedAllAmount}</button>  
                        {/* <a href={'https://payments.calgarylockandsafe.com/'} style={{backgroundColor:"#009ED6",borderColor:"#009ED6"}}
                        {/* className="btn btn-primary" >Pay Now  ${this.state.selectedAllAmount}</a> */}
                     </div>
                        }
                  </div>
                  </>
              )
          }
          }

          invoiceQuery = (location:any,address:any,amount:any,loc_no:any) => {
            this.setState({message:''})
            this.setState({location:location, address:address, amount:amount, loc_no:loc_no, modalIsOpen:true});
          }

          invoiceModal = async(loc_no:any,invoiceLocation:any, invoiceAddress:any) => {
            this.setState({loading:true});
            try {
              const api = `/api/customer/invoice/payment/${loc_no}/`;
              let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
              this.setState({allInvoice : response.data});
              if(!(this.state.allInvoice === null))
              {
                  this.setState({loading : false});
              }
            }catch(error){
                this.setState({loading : false});
                throw error;
            }
            this.setState({ invoiceModalIsOpen:true, invoiceAddress:invoiceAddress, invoiceLocation:invoiceLocation, invoiceLoc_no:loc_no});
            
          }

          closeModal = () =>{
            this.setState({modalIsOpen:false,invoiceModalIsOpen:false,allInvoiceModalIsOpen:false,card:false,allInvoice:[],selectedProducts: null,selectedAmount:0,selectedAllProducts:null,selectedAllAmount:0});
          }


          noInvoice = () =>{
              const node = this.mytoast.current;
              if(node){
                node.show({severity: 'error', detail: 'No Invoice Pending'});
            }
          }

          invoiceModalPayAll = async() => {
            this.setState({loading:true});
            try {
              const api = `/api/customer/invoice/all/payment/`;
              let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
              this.setState({allInvoice : response.data});
              if(!(this.state.allInvoice === null))
              {
                  this.setState({loading : false});
              }
          }catch(error){

              this.setState({loading : false});
              throw error;
          }
            this.setState({ allInvoiceModalIsOpen:true,});
            
          }
    handleDownload = (api: string, name: string) => {
      axiosInstance.get(api,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`}, responseType: 'blob' }).then((res: any) => {
        fileDownload(res.data,name )
      })
    }    
    render(){
        return(
            <>
            <div>
              {
                this.state.loading ? <div className='overlay-box1'>
                <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
             </div > :''
              }
            <Modal style={this.customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal()}</Modal>
            <Modal style={this.invoiceStyles} isOpen={this.state.invoiceModalIsOpen} onRequestClose={this.closeModal}>{this.renderInvoiceModal()}</Modal>
            <Modal style={this.invoiceStyles} isOpen={this.state.allInvoiceModalIsOpen} onRequestClose={this.closeModal}>{this.renderAllInvoiceModal()}</Modal>
            <Toast ref={this.mytoast} />
                <div className="upper">
                    <div className="row" >
                        <div className="col-4 d-flex align-items-center" >
                            <p className="m-2"><span className='heading'>{this.state.last_name}</span> 
                            <br></br><span className='heading'>{this.state.cus_no}</span></p>
                        </div>
                        <div className="col-8">
                            <div className="row "  style={{marginLeft:"-45px"}}>
                              <div className="col-md-12 flex-container">
                                  <div className="flex-item ">
                                    <div className="flex-item-inner">
                                              <div className="card-front p-2 m-2 bg-violet">
                                                  <h6>Account Balance</h6>
                                                  <p className="detail">${parseFloat(this.state.total_amount).toLocaleString(navigator.language, {maximumFractionDigits:2})}</p>
                                              </div>
                                            
                                      </div>
                                  </div>
                                  <div className="flex-item ">
                                    <div className="flex-item-inner">
                                              <div className="card-front p-2 m-2 bg-magenta">
                                                  <h6>30 Days</h6>
                                                  <p className="detail">${parseFloat(this.state.over_30).toLocaleString(navigator.language, {maximumFractionDigits:2})}</p>
                                              </div>
                                            
                                      </div>
                                  </div>
                                  <div className="flex-item ">
                                    <div className="flex-item-inner">
                                              <div className="card-front p-2 m-2 bg-blue">
                                                  <h6>60 Days</h6>
                                                  <p className="detail">${parseFloat(this.state.over_60).toLocaleString(navigator.language, {maximumFractionDigits:2})}</p>
                                              </div>
                                            
                                      </div>
                                  </div>
                                  <div className="flex-item ">
                                    <div className="flex-item-inner">
                                              <div className="card-front p-2 m-2 bg-green">
                                                  <h6>90 Days</h6>
                                                  <p className="detail">${parseFloat(this.state.over_90).toLocaleString(navigator.language, {maximumFractionDigits:2})}</p>
                                              </div>
                                      </div>
                                  </div>
                                  
       
                                  <button className="btn btn-info" onClick={this.invoiceModalPayAll}>
                                      Pay All
                                  </button>
                              </div>
                            </div>
                        </div>
                    </div>
                  
                </div>
                <div className="row">
                    
                    <div>
                            <p className="card-title">Terms</p>
                            <p>{this.state.terms}</p>
                    </div>
                  </div>
                <div className="content">
                <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Invoices</p>
                            </div>
                            <div className='col-6'>
                                <a href="javascript:void(0)" onClick={() => this.handleDownload(`${baseURL}/api/customer/pdf/all/invoice/${this.state.cus_no}/`,"AllInvoices.pdf")}><img data-toggle="tooltip" data-placement="top" title="all invoices" alt="pdf1" style={{cursor:"pointer",backgroundColor:'white',float:"right",width:'2rem',marginTop:'.25rem'}} src={image}/></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-datatable p-component" data-scrollselectors=".p-datatable-scrollable-body, .p-datatable-unfrozen-view .p-datatable-scrollable-body">
                <div className="p-datatable-wrapper">
                  <table role="grid">
                    <thead className="p-datatable-thead" >
                        <tr >
                        <th style={{fontWeight:500}} scope="col" colSpan={2} >Location Name</th>
                        <th style={{fontWeight:500}} scope="col" colSpan={2}>Address</th>
                        <th style={{fontWeight:500}} scope="col">Open Invoice</th>
                        <th style={{fontWeight:500,textAlign:"right"}} scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="p-datatable-tbody">
                       {this.state.tableData.map((item: any,i: any)=>{
                         return(
                             <>
                        <tr key={i} >
                        <td colSpan={2}>{item.location}</td>
                        <td colSpan={2}>{item.address}</td>
                         <td>$ {parseFloat(item.amount).toLocaleString()}</td>
                        <td style={{textAlign:"right"}}>
                           <img data-toggle="tooltip" data-placement="top" title="view invoices" alt="eye" className=" ml-1 icon"  onClick={(item.amount===0 || item.amount==='0.00')? this.noInvoice  : ()=>this.details(item.loc_no,i)} src={viewa} />
                           <img data-toggle="tooltip" data-placement="top" title="pay invoices" alt="dollar" className=" ml-1 icon"  src={dollar} onClick={(item.amount===0 || item.amount==='0.00')? this.noInvoice  : ()=>this.invoiceModal(item.loc_no,item.location,item.address)}/>
                           <img data-toggle="tooltip" data-placement="top" title="Help" alt="question" className=" ml-1 icon"  onClick={()=>this.invoiceQuery(item.location ,item.address,item.amount,item.loc_no)} src={question}/>
                           <img data-toggle="tooltip" data-placement="top" title="Invoices details" className=" ml-1 icon" alt="pdf1" onClick={() => this.exportPDFsingleinvoices(item.location ,item.address,item.loc_no)} src={image}/>
                        </td>
                        </tr>                                                                                                                                 
                        {this.renderEditForm(item.showDetails,i)}
                        </>
                         )})}
                            
                    </tbody>
                </table>
                </div>
                </div>

                <Paginator 
                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                  first={this.state.offset} rows={this.state.perPage} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10,20,30]} 
                            onPageChange={this.onPageChange}
                  ></Paginator>
                </div>
            </div>
            </>
        );
    }
}

export default Accounting;