import React from 'react';
import brokenkey from '../icons/BrokenKey.svg';
import questionmark from '../icons/questionmark.svg';
import edit1 from '../icons/edit.svg';
import 'jspdf-autotable';
import tick from '../icons/tick.svg';
import verify from '../icons/tick.png';
import cross from '../icons/cross.svg';
import axiosInstance from '../../api/api';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

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
  [key :string]:any;
  loading : boolean;
}


class ViewKeysDetails extends React.Component<{viewdata:any,load:any,loadc:any},Props> {
  toast: React.RefObject<any>;

  constructor(props:any){
    super(props);
    this.toast = React.createRef();
    this.state={
      edit:false,
      data:[],
      tenant_location:"",
      key_holder:'',
      phone:'',
      email:'',
      date_issued:'',
      lost_key:'',
      broken_key:'',
      loading:false
    }
  }
  
  handleInputChange = (e: { target: { name: any; value: any; }; }) =>{
    let name = e.target.name;
    let value = e.target.value;
    this.setState({[name]:value});
};

  handleCheckboxSlider = (e: { target: { name: any; checked:any;} },item:any,id:any) =>{
    this.setState({lost_key : item.lost_key,broken_key: item.broken_key});
    let name = e.target.name;
    let value= e.target.checked;
    let lost_key:any = null;
    let broken_key:any = null;
    if(name==='lost_key'){
       lost_key = value;
       broken_key= item.broken_key;
    }else {
       lost_key = item.lost_key;
       broken_key= value;
    }

    const updateCheck = this.state.data.map((obj:any,i:any)=>{
      if(id===i){
        obj.lost_key= lost_key;
        obj.broken_key= broken_key;
      }
      return {...obj}
    })
    this.setState({data: updateCheck});
    
    this.setState({[e.target.name]:e.target.checked});
    this.props.loadc();
    axiosInstance
      .patch(`/api/kdfinder/sequence/${item.id}/`,{
        lost_key: lost_key,
        broken_key: broken_key,
            },
              { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
        if(res.data.status===200){
          this.toast.current.show({severity: 'success',  detail: 'Updated successfully'});
          this.props.load();
        }else {
          this.toast.current.show({severity: 'error',  detail: 'Not Updated'});
          this.props.load();
        }
 			});
};
  onUpdateVerifyMethod = (e: any,item:any,id:any) => {
    this.setState({verify_mthod : item.verify_method});
    let name = e.target.name;
    let value= e.target.value;
    let verify_method:any = null;
    verify_method= value;

    const updateCheck = this.state.data.map((obj:any,i:any)=>{
      if(id===i){
        obj.verify_method = verify_method;
      }
      return {...obj}
    })
    this.setState({data: updateCheck});
    axiosInstance
      .patch(`/api/kdfinder/sequence/${item.id}/`,{
        verify_method: verify_method,
            },
              { headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
            )
			.then((res) => {
        if(res.data.status===200){
          this.toast.current.show({severity: 'success',  detail: 'Updated successfully'});
          this.props.load();
        }else {
          this.toast.current.show({severity: 'error',  detail: 'Not Updated'});
          this.props.load();
        }
 			});

  } 

 onUpdate = (e:any,id:any)=>{
  e.preventDefault();
 // this.setState({loading:true});
 this.props.loadc();
  axiosInstance
    .put(`/api/kdfinder/sequence/${id}/`, {
             tenant_location : this.state.tenant_location,
             key_holder : this.state.key_holder,
             phone : this.state.phone,
             email : this.state.email,
             date_issued : this.state.date_issued
          },{ headers: {"Authorization" : `Bearer ${localStorage.getItem('access_token')}`} }
          )
    .then((res) => {
      //alert("done")
      if(res.data.status===200){
        this.setState({loading:false});
        this.props.load();
        this.toast.current.show({severity: 'success',  detail: 'Updated successfully'});
      const updatedData = this.state.data.map((obj:any,i:number)=>{
        if(obj.id===id){
          obj.tenant_location = this.state.tenant_location;
          obj.key_holder = this.state.key_holder;
          obj.phone = this.state.phone;
          obj.email = this.state.email;
          obj.date_issued = this.state.date_issued;
          obj.editData = false;
        }
        return {...obj}
      })
      this.setState({data :updatedData});
      
    }else {
      this.setState({loading:false});
      this.toast.current.show({severity: 'error',  detail: 'Not Updated'});
    }
    }); 

 }

  onEdit= (id:any)=>{
     this.setState({data: this.state.data.map((obj:any,i:number)=>{
      if(i===id){
        obj.editData = true;
      }else{
        obj.editData = false;
      }
      return {...obj}
      })});
      this.setState({tenant_location: this.state.data[id].tenant_location,
        key_holder: this.state.data[id].key_holder,
        phone: this.state.data[id].phone,
        email: this.state.data[id].email,
        date_issued: this.state.data[id].date_issued,
      })
  };

  componentDidMount=()=>{
    this.props.load();
    this.setState({data : this.props.viewdata.map((obj:any)=>{
      return({...obj, editData: false
      })
    })});
  };

  onCancel =(id:any)=>{
    this.setState({data: this.state.data.map((obj:any,i:number)=>{
      if(i===id){
        obj.editData = false;
      }
      return {...obj}
    })
  })
    
  }

    render() {
      return (
          <>
           <Toast ref={this.toast} />
          {
            this.state.loading ? <div className='overlay-box1'>
            <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
        </div> :''
          }
            <div>
          <table className="table m-0 p-0" >
            <thead >
              <tr>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Key ID Stamp</th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Tenant</th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">First/Last Name</th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Phone </th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Email ID </th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Issue Date</th>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}}>Verify method</th>
                <th style={{fontWeight:500,textAlign:"right",margin:0,width:"6.65rem"}} scope="col">Edit Data</th>
                <th style={{fontWeight:500,textAlign:'center',margin:0,width:"6.65rem"}} scope="col">Actions</th>
              </tr>
            </thead>
            <tbody >
            {this.state.data.map((item: any,i: any)=>{
             return(
              <tr key={i}>
                <th style={{margin:0,width:"6.65rem"}} scope="row">{item.key_id +" - "+ item.sequence}</th>
                <td style={{margin:0,width:"7.65rem"}}>{item.editData ? <input style={{height:'2rem',width:"7.65rem",padding:'.5rem',margin:0}} type="text" className="form-control" name="tenant_location" value={this.state.tenant_location} onChange={this.handleInputChange}  /> : item.tenant_location}</td>
                <td style={{margin:0,width:"7.65rem"}}>{item.editData ? <input style={{height:'2rem',width:"7.65rem",padding:'.5rem',margin:0}} type="text" className="form-control" name="key_holder" value={this.state.key_holder} onChange={this.handleInputChange}   /> : (item.group ? <a href='/home/viewkeysgroup'>Group={item.group_data.name}</a> : item.key_holder)}</td>
                <td style={{margin:0,width:"7.65rem"}}><div className="d-flex">{item.editData ? <input style={{height:'2rem',width:"7.65rem",padding:'.5rem',margin:0}} type="text" className="form-control" name="phone" value={this.state.phone} onChange={this.handleInputChange}   /> : item.phone}{
                   item.verify_method === 'phone' ? <img alt="viewkeys" style={{marginLeft:"0.6rem",width:'1.4rem'}} src={verify}/>  : ''
                }</div></td>
                <td style={{margin:0,width:"7.65rem"}}><div className="d-flex">{item.editData ? <input style={{height:'2rem',width:"7.65rem",padding:'.5rem',margin:0}} type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange}  /> : item.email}
                {
                   item.verify_method === 'email' ? <img alt="viewkeys" style={{marginLeft:"0.6rem",width:'1.4rem'}} src={verify}/>  : ''
                }</div></td>
                <td style={{margin:0,width:"7.65rem"}}>{item.editData ? <Calendar style={{height:'2rem',width:"7.65rem",padding:0,margin:0}} id="date_issued" placeholder="YYYY-MM-DD" value={this.state.date_issued} onChange={(e:any) => this.setState({date_issued:e.value.toLocaleDateString("fr-CA")})}/> : item.date_issued}</td>
                <td style={{margin:0,width:"7.65rem"}}>
                  <select onChange={(e)=>this.onUpdateVerifyMethod(e,item,i)} className="form-select" style={{padding: '0.1rem 1.75rem .1rem .75rem', fontSize: '0.8rem', backgroundPosition: 'right .5rem center', backgroundSize: '10px 10px'}} aria-label="Default select example">
                    <option value="email" selected={item.verify_method === "email"}>Email</option>
                    <option value="phone" selected={item.verify_method === "phone"}>Phone</option>
                  </select>
                </td>
                <td style={{textAlign:"center",margin:0,width:"6.65rem"}}>
                  { 
                    item.group ? <></> 
                    :
                    item.editData ? <span><img style={{cursor:"pointer",width:"0.75rem",height:"0.75rem",marginRight:"1.25rem"}} onClick={()=>this.onCancel(i)} alt="cross" src={cross} /><img style={{cursor:"pointer",width:"1rem",height:"1rem"}} onClick={(e)=>this.onUpdate(e,item.id)} alt="tick" src={tick} /></span>
                  : <span> <img style={{cursor:"pointer",width:'1.3rem'}} onClick={()=>this.onEdit(i)} alt="edit" src={edit1} /></span>
                  }
                </td>
                <td style={{margin:0,textAlign:"right",width:'6rem'}}>
                   <input style={{height:"1.375rem",width:"1.375rem", borderRadius:".25em",display:"inline-block",position:"initial",cursor:'pointer',marginLeft:'-2rem'}}  type="checkbox" className="form-check-input" name="lost_key" defaultChecked={item.lost_key} onChange={(e)=>this.handleCheckboxSlider(e,item,i)}/>
                   <img alt="viewkeys" style={{marginLeft:"0.6rem",width:'0.4rem'}} src={questionmark}/>
                   <input style={{height:"1.375rem",width:"1.375rem",marginLeft:".8rem",display:"inline-block",borderRadius:".25em",position:"initial",cursor:'pointer'}} className="form-check-input" type="checkbox" name="broken_key" defaultChecked={item.broken_key} onChange={(e)=>this.handleCheckboxSlider(e,item,i)}/>
                   <img alt="viewkeys" style={{marginLeft:"0.6rem",width:'0.8rem'}} src={brokenkey}/>
                </td>
              </tr>
              )})}
            </tbody>
          </table>
          </div>
          </>
      );
    }
  }

export default ViewKeysDetails;  