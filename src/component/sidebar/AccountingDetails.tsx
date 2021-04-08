import React from 'react';
import viewa from '../icons/viewa.svg';
import axiosInstance, {baseURL} from '../../api/api';
import Modal from 'react-modal';
import logopay from '../icons/logopay.png';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Payment from './Payement/Payment';
import './Payement/Payment.css';
import cancel from '../icons/cancel.svg';
import image from '../icons/pdf-1.svg';
import * as _html2canvas from "html2canvas";

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:35%;
  margin-left: 40rem;
`;
interface Props {
  invoiceData:any;
  modalIsOpen:any;
  loading : boolean;
  invoicePop : any;
  invoiceTable : any;
  card: boolean;
  invoiceNumber:Number;
  invoiceAmount:Number;
}

class AccountingDetails extends React.Component<{locationNo:any,cus_no:any,load:any,loadt:any},Props> {
  constructor(props:any){
    super(props);
    this.state ={
      invoiceData:[],
      modalIsOpen : false,
      loading : false,
      invoicePop : [], 
      invoiceTable : [],
      card: false,
      invoiceNumber:0,
      invoiceAmount:0,

    }
  }
  customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-20%',
      transform             : 'translate(-50%, -50%)',
      width                 : '46.875rem',
      height                : '37.5rem'
    }
  };

  exportPDFsingleinvoices = async() => {

    try {
      const api = `/api/customer/pdf/invoice/${this.state.invoicePop.cus_no}/${this.props.locationNo}/${this.state.invoicePop.invoice}/`;
      this.setState({loading:true});
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });

  }catch(error){
      throw error;
  } 
    /* const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc1 :any = document.getElementById("invoice");
    const html2canvas: any = _html2canvas;
     html2canvas(doc1).then((canvas:any)=>{
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF(orientation, unit, size);
            var width = pdf.internal.pageSize.getWidth();
            var height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'text', 30, 20, 500, 780);
            pdf.save("invoice.pdf");
     }) */
     
  };

  fetchedData = async() => {
   // this.setState({loading : true});
   try {
     const api = `/api/customer/accounting/invoice/list/${this.props.locationNo}/`;
     let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
     this.setState({invoiceData:response.data});
     if(!(this.state.invoiceData === null))
     {
         this.setState({loading : false});
         this.props.load();
     }
 }catch(error){
     this.setState({loading : false});
     throw error;
 }
  }

  invoice = async(invoice_no:any) => {
    //this.setState({loading : true});
    this.props.loadt();
    try {
      const api = `/api/customer/accounting/invoice/${this.props.locationNo}/${invoice_no}/`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      this.setState({invoicePop:response.data,invoiceNumber:response.data.invoice, invoiceAmount:response.data.total});
      this.setState({invoiceTable : response.data.data});
      if(!(this.state.invoiceData === null))
      {
          this.setState({loading : false});
          this.props.load();
      }
  }catch(error){
      this.setState({loading : false});
      this.props.load();
      throw error;
  }
    this.setState({card:false});
    this.setState({modalIsOpen:true});
  }

  pay = () =>{
    this.setState({card:true});
  }

  cancelPay = () =>{
    this.setState({card:false});
  }


  renderModal = () =>{ 
    if(this.state.card){
        return (
          <>
           <div style={{textAlign:'right'}}>
                  <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
          </div>
          <Payment invoice={this.state.invoiceNumber} amount={this.state.invoiceAmount} />
          <div style={{textAlign:'center'}}>
          <button 
            className="btn btn-outline-danger"
            type="button"><span className="MuiButton-label" onClick={this.cancelPay} >Cancel</span><span
                className="MuiTouchRipple-root"></span></button>
            </div>    
          </>
        )
    }else{
      const invoice_date  = this.state.invoicePop.invoice_date? new Date(this.state.invoicePop.invoice_date).toLocaleDateString(): '';
    return(
      <>
      <div className="row ">
             <div className='col' style={{textAlign:'end'}}>
              <a href={`${baseURL}/api/customer/pdf/invoice/${this.props.cus_no}/${this.props.locationNo}/${this.state.invoiceNumber}/`} ><img alt="pdf1" style={{marginRight:'1rem',cursor:"pointer",width:'1.563rem',height:'1.563rem'}} src={image}/></a>
               <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
             </div>
             
          </div>
        <div id='invoice'>
          <div className='row'>
            <div className='col-6'>
              <p style={{textAlign:"left"}}>
              <span style={{fontSize:"1.25rem",fontWeight:500,color:"#5C5C5C"}}>Billed To:</span><br></br>
              <span style={{fontSize:"1.25rem",fontWeight:500}}>{this.state.invoicePop.name}</span><br></br>
              <p style={{fontSize:"1.063rem",fontWeight:500,color:"#5C5C5C",width:"12.625rem",height:"3.375rem"}}>{this.state.invoicePop.address}</p>
              <span style={{fontSize:"1.25rem",fontWeight:500}}>Customer# : {this.state.invoicePop.cus_no}</span><br></br>
              </p>
            </div>
            <div className='col-6'>
              <p style={{textAlign:"right"}}>
              <span style={{fontSize:"1.875rem",fontWeight:500}}>Invoice</span><br></br>
             <span style={{fontSize:"1.25rem",fontWeight:500}}> #{this.state.invoicePop.invoice}</span><br></br>
              <span style={{fontSize:"1rem",fontWeight:500}}>{invoice_date}</span>
              </p>
            </div>
          </div>
          <table className="table table-striped" style={{backgroundColor:"#fff"}}>
            <thead style={{ color: "#fff",backgroundColor:"#0D93C9" }}>
              <tr>
                <th data-visible="true" >Description</th>
                <th>QTY</th>
                <th>Each</th>
                <th style={{textAlign:"right"}}>Amount</th>
              </tr>
            </thead>
            <tbody>
            {this.state.invoiceTable.map((item: any,i: any)=>{
                return(
              <tr >
                <td >{item.desc}</td>
                <td>{item.quantity}</td>
                <td>$ {item.price}</td>
                <td style={{textAlign:"right"}}>$ {item.amount}</td>
              </tr>
                  )})}
            </tbody>
            <tr>
              <td colSpan={4}>
                <div className='row'>
                  <div className='col-6'>
                    <p style={{cursor:"pointer",color:"#009ED6"}}>Term and Conditions</p>
                  </div>
                  <div className='col-6'>
                    <p style={{textAlign:"right"}}>Sub Total : ${this.state.invoicePop.sub_total}<br></br>
                    GST(2235785) : ${this.state.invoicePop.GST}<br></br>
                    Total : ${this.state.invoicePop.total}<br></br>
                     <span style={{fontWeight:500}}>Amount owning : ${this.state.invoicePop.total}</span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            </table>
        </div>
        <div className='row'>
              <div className='col-6'>
                <img style={{width:'63%'}} alt="viewkeys" src={logopay}/><br></br>
                www.calgarylockandsafe.com
              </div>
              <div className='col-6'>
              {/* <button style={{width:"8.688rem",height:"2.813rem",backgroundColor:"#009ED6",float:'right'}} className="btn btn-primary" type="submit" onClick={this.pay}>Pay Invoice</button> */}
              <a href={'https://payments.calgarylockandsafe.com/'} style={{backgroundColor:"#009ED6",borderColor:"#009ED6",width:"8.688rem",height:"2.813rem",float:'right'}}
                        className="btn btn-primary" >Pay Invoices</a>
              </div>
            </div>
        </>
    )
                }
  }

  closeModal = () =>{
    this.setState({modalIsOpen:false});
    this.setState({card:false});
  }

 componentDidMount= async()=>{
   this.fetchedData();
 }

    render() {
      return (
          <>
          <div>
          {
            this.state.loading ? <div className='overlay-box2'>
            <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
        </div>:''
          }
         
          <div>
          <Modal style={this.customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal()}</Modal>
          <table className="table table-striped" style={{border :'2px solid #12739A'}}>
            <thead>
              <tr>
                <th style={{fontWeight:500}} scope="col">Invoice Number</th>
                <th style={{fontWeight:500}} scope="col">Invoice Date</th>
                <th style={{fontWeight:500}} scope="col">Do Date</th>
                <th style={{fontWeight:500}} scope="col">Invoice Amount</th>
                <th style={{fontWeight:500}} scope="col">Paid Amount</th>
                <th style={{fontWeight:500}} scope="col">Balance</th>
                <th style={{fontWeight:500,textAlign:"right"}} scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
            {this.state.invoiceData.map((item: any,i: any)=>{
              let date = new Date(item.invoice_date).toLocaleDateString("fr-CA");
              let do_date = new Date(item.do_date).toLocaleDateString("fr-CA");
                return(
              <tr key={i}>
                <td>{item.invoice}</td>
                <td>{date}</td>
                <td>{do_date}</td>
                <td>$ {parseFloat(item.sub_total).toLocaleString()}</td>
                <td>$ {parseFloat(item.tax).toLocaleString()}</td>
                <td>$ {parseFloat(item.total).toLocaleString()}</td>
                <td style={{textAlign:"right"}}>
                    <img data-toggle="tooltip" data-placement="top" title="view invoice" alt="eye" className="ml-1 icon" onClick={()=>this.invoice(item.invoice)} src={viewa}/>
                    {<a data-toggle="tooltip" data-placement="top" title="invoice" href={`${baseURL}/api/customer/pdf/invoice/${this.props.cus_no}/${this.props.locationNo}/${item.invoice}/`} ><img alt="pdf1" className="ml-1 icon" src={image}/></a>}
                </td>
              </tr>
              )})}
            </tbody>
          </table>
          </div>
          </div>
          </>
      );
    }
  }

export default AccountingDetails;  