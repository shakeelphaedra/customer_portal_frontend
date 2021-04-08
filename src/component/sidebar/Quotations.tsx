
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
            //debugger
            this.setState({isSelected: e.value});
            this.fetchedData(e.value);
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
                    <td colSpan={5}>
                        <div className="accordian"> 
                          <div className="col-12">
                              <div className="row">
                                  <div className="col-6">
                                      <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Estimation Details</p>
                                  </div>
                                  <div className="col-6">
                                    <span className="detail-created" onClick={()=>this.cancel(id)} >Close</span>
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
                <div className="upper">
                    <div className="row">
                        <div className="col-6">
                            <p style={{padding:"1.25rem"}}><span className='heading'>{this.state.last_name}</span> 
                            <br></br><span className='heading'>{this.state.cus_no}</span></p>
                        </div>
                        <div style={{marginLeft:"12.5rem",marginTop:"1.25rem"}} className="col-3">
                            <label  htmlFor="inputState">Filter By:</label>
                            <Select
                                values={this.options.filter(obj => obj.value === this.state.isSelected)}
                                onChange={this.handleChange}
                                className="dropdown"
                                options={this.options}
                                placeholder="Open Quotes"
                                styles={this.colourStyles}
                                isSearchable
                            />
                        </div>
                    </div>
                </div>
                <div className="content" >
                <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"0.625rem"}}>Estimations</p>
                            </div>
                        </div>
                    </div>
                </div>
                <table  className="table table-striped">
                    <thead>
                        <tr >
                        <th style={{fontWeight:500}} scope="col">Location Name</th>
                        <th style={{fontWeight:500}} scope="col">Address</th>
                        <th style={{fontWeight:500,textAlign:"center"}} scope="col">{this.options.filter(obj => obj.value === this.state.isSelected)[0].label} Quotes</th>
                        <th style={{fontWeight:500,textAlign:"right"}} scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tableData.map((item: any,i: any)=>{
                         return(
                             <>
                        <tr key={i}>
                        <td>{item.location}</td>
                        <td>{item.address}</td>
                        <td style={{textAlign:"center"}} >{item.quotes}</td>
                        <td style={{textAlign:"right"}}>
                          <img data-toggle="tooltip" data-placement="top" title="View Quotes" alt="eye" style={{cursor:"pointer",width:'1.8rem'}} src={viewq} onClick={()=>this.details(item.loc_no,i)}/>
                        </td>
                        </tr>
                        {this.renderEditForm(item.showDetails,i)}
                        </>
                         )})}
                         <tr>
                            <td colSpan={4}>
                            <Paginator first={this.state.offset} rows={this.state.perPage} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10,20,30]} 
                            template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                            onPageChange={this.onPageChange}></Paginator>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </>
        );
    }
}

export default Quotations;