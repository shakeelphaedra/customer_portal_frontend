
import React from 'react';
import axiosInstance from '../../api/api';
import viewq from '../icons/viewq.svg';
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Modal from 'react-modal';
import logopay from '../icons/logopay.png';
import QuotationDetails from './QuotationDetails';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;
interface Props{
    data:any;
    isSelected:any;
    last_name:any;
    cus_no:any;
    loading : boolean;
    loc_no : any;
    offset: any;
    perPage: any;
    totalRecords: any;
    pageCount:any;
    tableData :any;
  }

class Quotations extends React.Component<{},Props> {
  toast: React.RefObject<any>;

    constructor(props:Props){
        super(props);
        this.toast = React.createRef();
        this.state={
          data: [],
          isSelected:"pending",
          last_name:"",
          cus_no:"",
          loading : false,
          loc_no : '',
          offset: 0,
          perPage: 10,
          totalRecords: 0,
          pageCount:0,
          tableData : [],
        }}

        colourStyles ={
            option: (provided:any) => ({
              ...provided,
              backgroundColor: this.state.isSelected ? 'white' : 'white',
              color: this.state.isSelected ? 'black' : 'black',
              "&:hover": {
                backgroundColor: "#ccc",
                cursor: 'pointer',
              }
            }),
            control: (styles:any) => ({
              ...styles,
              cursor: 'pointer',
              
            }),
            
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

       
        options = [
            { value: 'pending', label: 'Open' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' },
          ];

          handleChange = (e:any) => {
            this.setState({isSelected: e.target.value});
            this.fetchedData(e.target.value);
          }

        fetchedData= async(value:any)=>{
            try {
                this.setState({loading : true});
                const token = localStorage.getItem('access_token');
                const api = `/api/customer/quotations/${value}/`;
                let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${token}`} });
                
                this.setState({data:response.data.data.map((obj:any)=>{
                    return({...obj, showDetails: false
                    })
                  }), last_name:response.data.last_name, cus_no:response.data.cus_no});
                  
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
                  this.toast.current.show({severity: 'error',  detail: 'No record found'});

                }
                
            }catch(error){
                this.setState({loading : false});
                throw error;
            }

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
            this.setState({loc_no:loc_no});
           };

           cancel(id:any) {
            const updatedData = this.state.tableData.map((obj:any,i:number)=>{
                if(i===id){
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
                <tr style={{height:"0px"}}>
                    <td colSpan={5} className="m-0 p-0">
                        <div className="accordian"> 
                          <div className="col-12">
                              <div className="row">
                                  <div className="col-6">
                                      <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Estimation Details</p>
                                  </div>
                                  <div className="col-6">
                                    <span className="detail-created" onClick={()=>this.cancel(id)} >X</span>
                                </div>
                              </div>
                          </div>
                        </div>
                        <QuotationDetails load={this.load} loadt={this.loadt} locationNo={this.state.loc_no} />
                     </td>
                </tr>
               </>
              )
            }
          } 

        componentDidMount = async ()=>{
           this.fetchedData("pending");
        }

        onPageChange = (event:any) => {
        let offset = event.first;
        let perPage = event.rows;
        this.setState({offset:offset, perPage:perPage})
        let slice = this.state.data.slice(offset, offset + perPage);
        this.setState({tableData:slice.map((obj:any)=>{
          return({...obj, showDetails: false
          })
        })});
    }

    render(){
        return(
            <>
            <div>
            <Toast ref={this.toast} />
            {
              this.state.loading ? <div className='overlay-box1'>
              <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
          </div> : ''
            }
              <section className="overview">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <h6 className="over-text">Estimates</h6>
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
                                    <div className="form-group mb-2 w-40">
                                        <label>Filter By:</label>
                                        <select 
                                          className="form-control filter-form-control"
                                          onChange={this.handleChange} id="exampleFormControlSelect1">
                                            {this.options.map(option=>(
                                              <option value={option.value} selected={this.state.isSelected == option.value}>{option.label}</option>
                                            ))}
                                        </select>
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
                                  Estimations
                              </div>
                              <div className="overview-pannel-body table-responsive-sm">
                                <table  className="table mb-0 estimates-table">
                                  <thead className="thead-light">
                                      <tr >
                                      <th scope="col">Location Name</th>
                                      <th className="text-center" scope="col">Address</th>
                                      <th style={{textAlign:"right"}} scope="col">{this.options.filter(obj => obj.value === this.state.isSelected)[0].label} Quotes</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.tableData.map((item: any,i: any)=>{
                                    return(
                                        <>
                                    <tr key={i}>
                                    <td className="primary-text" onClick={()=>this.details(item.loc_no,i)}>{item.location}</td>
                                    <td className="text-center">{item.address}</td>
                                    <td style={{textAlign:"right"}} className="pr-5" >{item.quotes}</td>
                                    </tr>
                                    {this.renderEditForm(item.showDetails,i)}
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

export default Quotations;