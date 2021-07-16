import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../api/api';
import edit1 from '../icons/edit.svg';
import save from '../icons/floppy-disk.svg';
import Select from 'react-select';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import AddNewUser from './AddNewUser';

const override = css`
  margin: 0 auto;
  border-color: red;
  background-color: transparent;
  top:40%;
  margin-left:-16%;
`;

let ManageUser =()=>{
  let history = useHistory();
  const toast: any = useRef();

  const initialFormData = Object.freeze({
        user:null,
        key_finder:false,
        service_request:false,
        inv_statements:false,
        quotes: false,
        hs_signatory:false,
        add_user:false,
        audit:false,
});
const initialFormData1 = Object.freeze({
  first_name:"",
  last_name:"",
  phone:"",
});
const [formData, setFormData]:any = useState(initialFormData);
const [formData1, setFormData1]:any = useState(initialFormData1);
//const [file, setFile] = useState<any>([1]);
const [addnewuser, setAddnewuser] = useState<any>(false);
const [offset, setOffset] = useState<any>(0);
const [limit, setLimit] = useState<any>(10);
const [totalRecords, setTotalRecords] = useState<any>(0);
const [currentuser, setCurrentuser] = useState<any>([]);
const [current_user_access, setCurrent_user_access] = useState<any>({});
const [file_numbers,setFile_numbers] = useState<any>([]);
const [add_user, setAdd_user] = useState<any>([]);
const [selected, setSelected] = useState<any>([]);
const [loading, setLoading] = useState<any>(false);

  const [data, setData] = useState<any>([]);
 // const [edit, setEdit] = useState(false);

  const handleChange = (event:any) => {
    setSelected(Array.isArray(event) ? event.map(x => x.value) : []);
  };

  const options = file_numbers.map((item: any,i: any)=>{ 
    return (
    { label: item.file_number+"-"+item.location, value: item.id})
     });

  const handleCheckboxChange = (e: { target: { name: any; checked:any;} }) =>{
    let name = e.target.name;
    let checked = e.target.checked;
    setFormData({...formData,[name]:checked});
   };

   const handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
    let name = e.target.name;
    let value = e.target.value;
    setFormData1({...formData1,[name]:value});
    
};

const handleCheckboxSlider = (e: { target: { name: any; checked:any;} },item:any) =>{
    let id = item.useraccess.user;
    axiosInstance
      .patch(`/api/customer/manage/user/${id}/`,
              { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
        if(res.data.data.is_active===false){
          toast.current.show({severity: 'success', detail: 'User Disabled'});
        }else {
          toast.current.show({severity: 'success', detail: 'User Enabled'});
        }
        
			});
};

   
  let editdetails=(item:any,id:any)=> {
    const updatedData = data.map((obj:any,i:number)=>{
      if(i===id){
        obj.showDetails = true;
      }else{
        obj.showDetails = false;
      }
      return {...obj}
      });
    setData(updatedData);
    setFormData({...formData,...item.useraccess});
    setFormData1({...formData1,first_name:item.first_name,last_name:item.last_name,phone:item.phone,is_active:item.is_active});
    //setFile(item.file_numbers);
    setSelected(item.file_numbers);
   }

   const onUpdate = (e:any,id:any)=>{
    e.preventDefault();
    setLoading(true);
    axiosInstance
			.put(`/api/customer/manage/user/${formData.user}/`, {
                 first_name: formData1.first_name,
                 last_name:formData1.last_name,
                 phone: formData1.phone,
                 file_numbers:selected,
                 useraccess:
                 {
                  key_finder: formData.key_finder,
                  service_request: formData.service_request,
                  inv_statements:formData.inv_statements,
                  quotes: formData.quotes,
                  hs_signatory:formData.hs_signatory,
                  add_user:formData.add_user,
                  audit:formData.audit
                } ,
                method: "put"
            },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
        setLoading(false);
        let node = toast.current;
        if(res.data.status===200){
          if(node){
             node.show({severity: 'success',  detail: 'User Updated Successfully'});
          }
        const updatedData = data.map((obj:any,i:number)=>{
          if(i===id){
            obj.showDetails = false;
            obj.first_name= formData1.first_name;
            obj.last_name=formData1.last_name;
            obj.phone= formData1.phone;
            obj.file_numbers= selected;
            obj.useraccess.key_finder= formData.key_finder;
            obj.useraccess.service_request= formData.service_request;
            obj.useraccess.inv_statements=formData.inv_statements;
            obj.useraccess.quotes= formData.quotes;
            obj.useraccess.hs_signatory=formData.hs_signatory;
            obj.useraccess.add_user=formData.add_user;
            obj.useraccess.audit=formData.audit;
          }
          return {...obj}
        })
        setData(updatedData);
      }else {
        setLoading(false);
        if(node){
           node.show({severity: 'error', detail: 'Wrong Details'});
        }
      }
			});

   }
   const fetchDataAsync = async (offset:any,limit:any) => {
    try {
        setLoading(true);
        const api = `/api/customer/manage/user/?limit=${limit}&offset=${offset}`;
        let response = await axiosInstance.get(api, { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} });
        setData(response.data.results.data.map((obj:any)=>{
          return({...obj, showDetails: false
          })
        }));
        if(!(data===null)){
          setLoading(false);
        }
        setFile_numbers(response.data.results.file_numbers);
        setCurrentuser(response.data.results.current_user);
        setCurrent_user_access(response.data.results.current_user_access);
        setAdd_user(response.data.results.current_user_access.add_user)
        setTotalRecords(response.data.count);
        
        return data;
    }catch(error){
      setLoading(false);
        throw error;
    }
 }   


   useEffect(() =>{
     fetchDataAsync(null,null);
  },[]);

 
  function cancel(id:any) {
    const updatedData = data.map((obj:any,i:number)=>{
        if(i===id){
          obj.showDetails = false;
        }
        return {...obj}
    })
    setData(updatedData);
    //setEdit(false);
    //renderEditForm(data[id].showDetails,id);
   }
 
   let renderEditForm =(show:any,id:any)=>{
     if(show){
       return(
         <>
         <tr>
           <td colSpan={10}>
           <div className="content" style={{height:"23.18rem",border:'1px solid #12739A',overflowX:'hidden'}}>
          <div>
          <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                                <div className="col-6">
                                    <p style={{color:"#fff",textAlign:"left",marginTop:"0.625rem"}}>Edit User Permissions</p>
                                </div>
                                <div className="col-6">
                                    <span className="detail-created" onClick={(e)=>onUpdate(e,id)} ><img style={{marginRight:".5rem",marginLeft:'0.625rem',width:'1rem'}} alt="save" src={save} />Save</span>
                                    <span className="detail-created" onClick={()=>cancel(id)} >Cancel</span>
                                </div>
                        </div>
                    </div>
            </div><br/>
            
            <div className="row" style={{padding:"1rem"}}>
                    <div className="col-4">
                        <input type="text" name="first_name" className="form-control" placeholder="Enter First Name *" value={formData1.first_name} onChange={handleInputChange}/>
                    </div>
                    <div className="col-4">
                        <input type="text" name="last_name" className="form-control" placeholder="Enter Last Name *" value={formData1.last_name} onChange={handleInputChange}/>
                    </div>
                    <div className="col-4">
                        <input type="text" name='phone' className="form-control" placeholder="Phone Number *" value={formData1.phone} onChange={handleInputChange}/>
                    </div>
                    
                </div>
                <div className="col-4">
                          <Select
                              className="dropdown"
                              placeholder="Select Option *"
                              value={options.filter((obj: { value: any; }) => selected.includes(obj.value))} // set selected values
                              options={options} // set list of the data
                              onChange={handleChange} // assign onChange function
                              isMulti
                              isClearable
                          />
                    </div>
                <br></br>
            <div className="form-check">
                    <div className="row">
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="key_finder"  className="form-check-input" type="checkbox" checked={formData.key_finder} onChange={handleCheckboxChange}  id="flexCheckDefault" disabled={!current_user_access.key_finder}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            Manage Keys
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="service_request"   className="form-check-input" type="checkbox" checked={formData.service_request} onChange={handleCheckboxChange}  id="flexCheckDefault6" disabled={!current_user_access.service_request}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            Request Service
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="inv_statements"  className="form-check-input" type="checkbox" checked={formData.inv_statements} onChange={handleCheckboxChange} id="flexCheckDefault1" disabled={!current_user_access.inv_statements}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            Pay Bills
                            </label>
                        </div>
                    </div><br></br>
                    <div className="row">
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="quotes"   className="form-check-input" type="checkbox" checked={formData.quotes}  onChange={handleCheckboxChange} id="flexCheckDefault2" disabled={!current_user_access.quotes}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            Accept Estimations
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="hs_signatory"  className="form-check-input" type="checkbox" checked={formData.hs_signatory} onChange={handleCheckboxChange} id="flexCheckDefault3" disabled={!current_user_access.hs_signatory}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            key Authorizers
                            </label>
                        </div>
                    </div><br></br>
                    <div className="row" style={{paddingBottom:'1rem'}}>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="add_user"  className="form-check-input" type="checkbox" checked={formData.add_user} onChange={handleCheckboxChange} id="flexCheckDefault4" disabled={!current_user_access.add_user}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label" >
                            Users
                            </label>
                        </div>
                        <div className="col-4">
                            <input style={{height:"1.375rem",width:"1.375rem",cursor:'pointer'}} name="audit" className="form-check-input" type="checkbox" checked={formData.audit} onChange={handleCheckboxChange} id="flexCheckDefault5" disabled={!current_user_access.audit}/>
                            <label style={{paddingLeft:"1.1em"}} className="form-check-label">
                            Audit Trails
                            </label>
                        </div>
                    </div>
                </div>
                </div>
                </div>
           </td>
         </tr>    
        </>
       )
     }
   }   

   const onPageChange = (event:any) => {
    setLimit(event.rows);
    setOffset(event.first);
    fetchDataAsync(event.first,event.rows);
}

const permission = () =>{
  toast.current.show({severity: 'error', detail:  `You don't have permission`});
}

  function newuser() {
    setAddnewuser(true);
  }

  function addnew(){
    setAddnewuser(false);
  }

  function addToast(){
    fetchDataAsync(null,null);
    toast.current.show({severity: 'success', detail: 'User Created'});
  }

  const lastLoginDate  = currentuser.last_login? new Date(currentuser.last_login).toLocaleDateString(): '';
  const lastUpdatedDate = currentuser.last_modified? new Date(currentuser.last_modified).toLocaleDateString(): "";

  

      return (
        <>
           { addnewuser ? 
           <AddNewUser addnewuser={addnew} addtoast={addToast} permissions ={current_user_access}/>
           :
          <div>
          
             <Toast ref={toast} />

            {loading ? <div className='overlay-box1'>
                    <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={loading}  height={30} width={5} radius={2} margin={20} />
                </div> :''}
                <section className="overview">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <h6 className="over-text">Manage Users</h6>
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
                                        <h6>Welcome {currentuser.first_name} {currentuser.last_name}</h6>
                                        <span className="last-login">Last Login: {lastLoginDate}</span>
                                    </div>
                                    <div className="mb-2">
                                        <button onClick={newuser} className="btn add-group-btn">Add New Group</button>
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
                                  Users
                              </div>
                              <div className="overview-pannel-body table-responsive-sm">
                                <table  className="table mb-0">
                                  <thead className="thead-light">
                                      <tr >
                                                        
                                        <th>User Name</th>
                                        <th style={{textAlign:"center"}}>Email ID</th>
                                        <th>Manage Keys</th>
                                        <th>Request Service</th>
                                        <th>Pay Bills</th>
                                        <th>Accept Estimations</th>
                                        <th>Key Authorizers</th>
                                        <th>Users</th>
                                        <th>Audit Trails</th>
                                        <th style={{textAlign:"right"}}>Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  {data.map((item: any,i: any)=>{
                                      return(
                                        <>
                                        <tr key={i}>
                                          <td style={{textAlign:"left"}}>{item.first_name} {item.last_name}</td>
                                          <td >{item.email}</td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.key_finder} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.service_request} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.inv_statements} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.quotes} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.hs_signatory} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.add_user} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                            <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",position:"initial",marginLeft:'0px'}}  type="checkbox"  checked={item.useraccess.audit} className="form-check-input" disabled/>
                                          </td>
                                          <td>
                                          <img style={{cursor:"pointer",marginLeft:'-0.625rem',width:'37%'}} onClick={add_user ? ()=>editdetails(item,i) : permission} alt="edit" src={edit1} />
                                          <label className="switch" style={{marginLeft:"0.313rem"}}>
                                              <input type="checkbox" name="userdisable"  defaultChecked={item.is_active} onChange={add_user ? (e)=>handleCheckboxSlider(e,item): permission} disabled={add_user ? false :true}/>
                                              <span style={{marginBottom:"-0.438rem"}} className="slider round"></span>
                                            </label>
                                          </td>
                                        </tr>
                                          
                                          {item.showDetails && 
                                          renderEditForm(item.showDetails,i)}
                                        </>
                                        )})}
                                    
                                  </tbody>
                              </table>
                        
                              </div>
                              <Paginator first={formData.offset} rows={formData.perPage} totalRecords={formData.totalRecords} rowsPerPageOptions={[10,20,30]} 
                                  template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                  onPageChange={onPageChange}></Paginator>
                                    
                          </div>
                      </div>
                  </div>
                </div>
            
          </div>
}
        </>
      );
    }


export default ManageUser;  