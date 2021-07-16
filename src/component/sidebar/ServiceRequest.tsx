import React from 'react';
import axiosInstance from '../../api/api';
import truck from '../icons/truck.svg';
import cancel from '../icons/cancel.svg';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Modal from 'react-modal';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import viewa from '../icons/viewa.svg';
import ServiceRequestDetails from './ServiceRequestDetails';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;
interface Props{
    data:any;
    last_name: any;
    cus_no:any;
    loc_no: any;
    loading : boolean;
    modalIsOpen:any;
    address :any;
    location:any;
    email :any;
    offset: any;
    perPage: any;
    totalRecords: any;
    pageCount:any;
    tableData :any;
    message:any;

}

class ServiceRequest extends React.Component<{},Props> {
    toast: React.RefObject<any>;
    constructor(props:any){
        super(props);
        this.toast = React.createRef();
        this.state={
            data:[],
            loc_no: '',
            last_name : '',
            cus_no :'',
            loading : false,
            modalIsOpen : false,
            address : '',
            location : '',
            email : '',
            offset: 0,
            perPage: 10,
            totalRecords: 0,
            pageCount:0,
            tableData : [],
            message:''
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
          width                 : '32.25rem',
          height                : '29rem'
        }
      };

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

    fetchedData= async()=>{
        try {
            this.setState({loading : true});
            const token = localStorage.getItem('access_token');
            const api = `/api/customer/service-request/`;
            let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${token}`} });
            
            this.setState({data:response.data.data, last_name:response.data.last_name, cus_no: response.data.cus_no, email: response.data.email});
            let slice = response.data.data.slice(this.state.offset, this.state.offset + this.state.perPage);
            this.setState({pageCount: Math.ceil(response.data.data.length / this.state.perPage), totalRecords: response.data.data.length});
            this.setState({tableData:slice});
            if(!(this.state.data.length === 0))
                {
                    this.setState({loading : false});
                }else {
                    this.setState({loading : false});
                    this.toast.current.show({severity: 'error',  detail: 'No record found'});
  
                  }
            
        }catch(error){
            this.setState({loading : false});
            throw error;
        }
    }

    invoice = (location:any,address:any) => {
        this.setState({location:location, address:address, modalIsOpen:true});
      }

      formValidation = () =>{
        let isValid = true;
        if(this.state.message === ''){
                this.toast.current.show({severity: 'error', detail: "Please enter Description"});
            isValid = false;
         }
        return isValid
    }

      handleSubmit = (e:any) => {
        e.preventDefault();
        let isValid = this.formValidation();
        if(isValid){
        try{
            this.setState({loading:true});
        axiosInstance
            .post(`/api/customer/service-request/`, {
                location:this.state.location,
                address:this.state.address,
                message:this.state.message
            },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
            .then((res) => {
                this.setState({loading:false});
                if(res.data.status===200){
                        this.toast.current.show({severity: 'success',  detail: 'Query Send Successfully'});
                    this.setState({message:'',modalIsOpen:false});
                } else {
                      this.toast.current.show({severity: 'error',  detail: 'Something went wrong, please contact to Calgary Lock and Safe'});
                    
                }
            })
            .catch((error)=>{
                this.setState({loading:false});
                    this.toast.current.show({severity: 'error',  detail: 'Server error'});
                  
            })
           
        } catch(error){
             throw error;
        }
      }
    }
    
      renderModal = () =>{ 
        return(
            <>
            <div style={{overflow:'hidden'}}>
            <div style={{textAlign:'right'}} >
               <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
            </div>
            <div style={{marginLeft:'1.875rem'}}>
                <div className="form-group row">
                    <label htmlFor="staticEmail" style={{color:"#888888", fontSize:'0.875rem'}} className="col-2 col-form-label">EmailId:</label>
                    <div className="col-sm-6">
                      <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.email}</span>
                    </div>
                </div>  
                <div className="form-group row">
                    <label style={{color:"#888888", fontSize:'0.875rem'}}  className="col-sm-2 col-form-label">Location:</label>
                    <div className="col-sm-6">
                      <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.location}</span>
                    </div>
                </div>
                <div className="form-group row">
                    <label style={{color:"#888888", fontSize:'0.875rem'}}  className="col-sm-2 col-form-label">Address:</label>
                    <div className="col-sm-6">
                       <span style={{fontSize:'0.875rem' , color:'#000000'}} className="form-control-plaintext">{this.state.address}</span>
                    </div>
                </div>  <br></br>
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1" style={{color:"#888888"}} >Request Description</label>
                    <textarea className="form-control" style={{width:'26.188rem', height:'7.375rem'}} id="exampleFormControlTextarea1"  value={this.state.message} onChange={(e)=>{this.setState({message : e.target.value})}}></textarea>
                </div>
                <div>
                  <button style={{backgroundColor:"#009ED6",width:"26.188rem", height:'2.5rem'}} className="btn btn-primary" type="submit" onClick={this.handleSubmit}>Request</button>
              </div>
            </div>
            </div>
            </>
        )
      }

      noPermission = () =>{
        this.toast.current.show({severity: 'error',  detail: `You don't have permission`});
      }
    

    componentDidMount = async ()=>{
       this.fetchedData();
    }
    closeModal = () =>{
        this.setState({modalIsOpen:false, message:'' });
      }

      onPageChange = (event:any) => {
      let offset = event.first;
      let perPage = event.rows;
      this.setState({offset:offset, perPage:perPage})
      let slice = this.state.data.slice(offset, offset + perPage);
      this.setState({tableData:slice});
  }
  cancel(id:any) {
    const updatedData = this.state.tableData.map((obj:any,i:number)=>{
        if(obj.loc_no===id){
          obj.showDetails = false;
        }
        return {...obj}
    })
    this.setState({tableData: updatedData});
   }

   load = () =>{
    this.setState({loading:false});
  }
  loadt = () =>{
    this.setState({loading:true});
  }

  renderEditForm=(show:any,id:any)=>{
    if(show){
      return(
        <>
        <>
            <tr style={{height:"0px"}}>
                <td colSpan={5} className="p-0 m-0">
                    <div className="accordian"> 
                        <div className="col-12">
                            <div className="row">
                                <div className="col-6">
                                    <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Dispatches Details</p>
                                </div>
                                <div className="col-6">
                                <span className="detail-created" onClick={()=>this.cancel(id)} >X</span>
                            </div>
                            </div>
                        </div>
                    </div>
                    <ServiceRequestDetails load={this.load} loadt={this.loadt} locationNo={this.state.loc_no} />
                    </td>
            </tr>
            </>
       </>
      )
    }
  }

    render(){
        return(
            <>
            <div >
            <Toast ref={this.toast} />
            {this.state.loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
                </div> :''}
                <Modal style={this.customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal()}</Modal>
                <section className="overview">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <h6 className="over-text">Request Service</h6>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="filter-pannel">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="filter-pannel-inner d-flex justify-content-between flex-wrap">
                                    <div>
                                        <h6>{this.state.last_name}</h6>
                                        <h6>{this.state.cus_no}</h6>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
    
                <div className="container-fluid">
                  <div className="row">
                      <div className="col-lg-12">
                          <div className="overview-pannel-cal">
                              <div className="overview-pannel-header">
                                  Request services
                              </div>
                              <div className="overview-pannel-body table-responsive-sm">
                                <table  className="table mb-0 estimates-table">
                                  <thead className="thead-light">
                                      <tr >
                                      <th scope="col">Location Name</th>
                                      <th className="text-center" scope="col">Address</th>
                                      <th style={{textAlign:"right"}} className="pr-4" scope="col">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.tableData.map((item: any,i: any)=>{
                                    return(
                                        <>
                                    <tr key={i}>
                                    <td className="primary-text" onClick={()=>this.details(item.loc_no,i)}>{item.location}</td>
                                    <td className="text-center">{item.address}</td>
                                    <td className="text-right general-btn"  >
                                        <button className="btn blue-btn"  onClick={(localStorage.getItem('service_request')=== 'true')? ()=>this.invoice(item.location ,item.address) : this.noPermission}>Request</button>
                                    </td>
                                    </tr>
                                    {this.renderEditForm(item.showDetails, item.loc_no)}
                                    
                                    </>
                                    )})}
                                  </tbody>
                              </table>
                        
                              </div>
                              <Paginator first={this.state.offset} rows={this.state.perPage} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10,20,30]} 
                                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                  onPageChange={this.onPageChange}></Paginator>
                                  
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </>
        );
    }
}

export default ServiceRequest;