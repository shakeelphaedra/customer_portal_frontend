import React from 'react';
import './CompanyDetails.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../api/api';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
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
  first_name:any;
  last_name:any;
  start_date:any;
  end_date:any;
  [key :string]:any;
  currentPage:any;
  rows:any;
  first:any;
  totalRecords:any;
  loading : boolean;
}
interface JQuery {
  DataTable():void;
}
class AuditReport extends React.Component<{},Props,JQuery> {
  toast: React.RefObject<any>;

   constructor(props:Props){
     super(props);
     this.toast = React.createRef();
     this.state={
       data:[],
       first_name:"",
       last_name:"",
       start_date:"",
       end_date:"",

       currentPage: null,
       totalPages: null,
       rows:10,
       totalRecords: null,
       first: null,
       loading : false,
     }
     
   }

   fetchedData = async(offset:any,limit:any) => {
     this.setState({first_name:"",
     last_name:"",
     start_date:"",
     end_date:"",});
    try {
      this.setState({loading : true});
      const api = `/api/customer/audit/?limit=${limit}&offset=${offset}`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      this.setState({data:response.data.results});

      if(!(this.state.data === null))
        {
            this.setState({loading : false});
            
        }
      
      this.setState({totalRecords:response.data.count});
      this.setState({totalPages: Math.ceil(response.data.count/this.state.limit)})
      return this.state.data;
  }catch(error){
    this.setState({loading : false});
      throw error;
  }

   }

  componentDidMount= async()=>{
    this.fetchedData(null,null);
  }

    handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
      let name = e.target.name;

    let value = e.target.value;
    this.setState({[name]:value});
    
};

 formValidation = () =>{
  let isValid = true;
    if(this.state.first_name === '' && this.state.last_name === '' && this.state.start_date === '' && this.state.end_date===''){
      this.toast.current.show({severity: 'error',  detail: "Please Enter the fields"});
    }else if(!(this.state.first_name === '')){
       if(this.state.last_name===''){
        this.toast.current.show({severity: 'error',  detail: "Enter last name"});
        isValid = false;
       }
   }else if(!(this.state.last_name === '')){
          if(this.state.first_name===''){
            this.toast.current.show({severity: 'error',  detail: "Enter first name"});
            isValid = false;
          }
      
   }else if(!(this.state.start_date=== '')){
        if(this.state.end_date===''){
          this.toast.current.show({severity: 'error',  detail: "Please enter Last Date"});
          isValid = false ;
        }
  }else if(!(this.state.end_date==='')){
         if(this.state.start_date===''){
          this.toast.current.show({severity: 'error',  detail: "Please enter Start Date"});
          isValid = false ;
         }
  }
  return isValid
}

   handleSubmit = async() => {
    let isValid = this.formValidation();
        if(isValid){
    try {
      this.setState({loading : true});
      const api = `/api/customer/audit/?first_name=${this.state.first_name}&last_name=${this.state.last_name}&start_date=${this.state.start_date}&end_date=${this.state.end_date}`;
      let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
      if(response.data.count=== 0){
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: "No data found"});
        this.setState({data:response.data.results});
      }else if(response.data.status===400){
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: "User does not exist"});
      }else if(!(response.data.results===0)){
        this.setState({loading : false});
        this.toast.current.show({severity: 'success',  detail: "Successfully Searched"});
        this.setState({data:response.data.results});
        this.setState({totalRecords:response.data.count});
      }
      
      return this.state.data;
  }catch(error){
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: "Status 500"});
      throw error;
  }
  }
  }


  onPageChange = (event:any) => {
    this.setState({first:event.first,rows:event.rows});
    this.fetchedData(event.first,event.rows);
}

  render() {
    
    return (
      <>
        <div>
          {this.state.loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
                </div>:''}
        <Toast ref={this.toast} />
        <section className="overview">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <h6 className="over-text">Audit Trail</h6>
                    </div>
                </div>
            </div>
        </section>
        <section className="filter-pannel">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="filter-pannel-inner  justify-content-between flex-wrap">
                            <form>
                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <label>Search By First Name</label>
                                        <input type="text" className="form-control"
                                         value={this.state.first_name} onChange={this.handleInputChange}
                                          id="inputEmail4" name="first_name" placeholder="Enter First Name" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label >Search By Last Name</label>
                                        <input type="text " className="form-control" id="inputPassword4"
                                            placeholder="Enter Last Name"
                                            name="last_name"
                                            value={this.state.last_name} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <label >Start Date</label>
                                        <input type="date" className="form-control" id="inputPassword4"
                                         value={this.state.start_date} onChange={(e:any) => {
                                           this.setState({start_date:new Date(e.target.value).toLocaleDateString("fr-CA")})}}
                                            placeholder="Password" />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <label >End Date</label>
                                        <input type="date"
                                        value={this.state.end_date} onChange={(e:any) => this.setState({end_date:new Date(e.target.value).toLocaleDateString("fr-CA")})}
                                         className="form-control" id="inputPassword4"
                                            placeholder="Password"/>
                                    </div>
                                </div>
                            </form>
                            <div className="filter-pannel-btn d-flex justify-content-end flex-wrap">
                                <button className="btn" onClick={()=> this.fetchedData(null,null)} >Reset</button>
                                <button className="btn ml-2" onClick={this.handleSubmit}>Search</button>
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
                                  Audit trails
                              </div>
                              <div className="overview-pannel-body table-responsive-sm">
                                <table  className="table mb-0 estimates-table">
                                  <thead className="thead-light">
                                    <tr >
                                      <th>User Name</th>
                                      <th>Modified Date</th>
                                      <th>Action Performed By User</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.data.map((item: any,i: any)=>{
                                      let date = new Date(item.date).toLocaleDateString("fr-CA")
                                    
                                    return(
                                        <>
                                    <tr key={i}>
                                    <td>{item.username}</td>
                                    <td>{date}</td>
                                    <td>{item.modifications}</td>
                                  </tr>
                                    </>
                                    )})}
                                  </tbody>
                              </table>
                        
                              </div>
                            
                        <Paginator className="paginator" first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10, 20, 30]} 
                                template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink " 
                                onPageChange={this.onPageChange}  ></Paginator>      
                          </div>
                      </div>
                  </div>
                </div>           
            
        </div>
      </>
    );
  }
}

export default AuditReport;  