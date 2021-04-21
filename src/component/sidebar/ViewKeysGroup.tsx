import React from 'react';
import ViewKeysGroupDetails from './ViewKeysGroupDetails';
import image from '../icons/pdf-1.svg';
import csv from '../icons/csv.svg';
import schedule from '../icons/schedule.svg';
import warning from '../icons/warning.svg';
import brokenkey from '../icons/BrokenKey.svg';
import questionmark from '../icons/questionmark.svg';
import csv1 from '../icons/csv1.svg';
import removeIcon from '../icons/remove.png';
import axiosInstance , {baseURL} from '../../api/api';
import 'jspdf-autotable';
import cancel from '../icons/cancel.svg';
import { Paginator } from 'primereact/paginator';
import FadeLoader from "react-spinners/FadeLoader";
import { css } from "@emotion/core";
import Modal from 'react-modal';
import { Toast } from 'primereact/toast';
import Select from "react-select";
import { Formik, validateYupSchema } from 'formik';
import { Calendar } from 'primereact/calendar';
import edit1 from '../icons/edit.svg';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-20%',
    transform             : 'translate(-50%, -50%)',
    overflow: 'inherit !important'
  }
};

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
  view:any;
  currentuser:any;
  showDetails: any;
  isSelected:any;
  file:any;
  files:any;
  limit:any;
  offset:any;
  totalRecords:any;
  keysInGroup: any;
  loading : boolean;
  modalIsOpen : boolean;
  door_compromised:any;
  currentItem: any;
  add_group: any;
  csvTable:any;
  keys: any[];
  freeKeys: any[];
  selectedId: any;
  initialValues: any;
}

class ViewKeysGroup extends React.Component<{},Props> {
  toast: React.RefObject<any>;

  constructor(props:Props){
    super(props);
    this.toast = React.createRef();

    this.state={
      showDetails: false,
      edit:false,
      data:[],
      keysInGroup: [],
      view:[],
      csvTable:[],
      currentuser:[],
      isSelected: '',
      file:[] as any,
      add_group: true,
      files:[] as any,
      loading : false,
      modalIsOpen:false,
      door_compromised:'',
      keys: [],
      freeKeys:[],
      currentItem: '',
      limit:10,
      offset: null,
      initialValues: {name: '',user: '',keys: [],issueDate: new Date()},
      totalRecords:null,
      selectedId:null
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
      overflow: 'inherit !important',
    }
  };

    
  fetchedData = async(offset:any,limit:any) => {
    this.setState({loading : true});
    const api = `/api/kdfinder/keysgroups`;
    let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    this.setState({data:response.data.results.data.map((obj:any)=>{
      return({...obj, showDetails: false
      })
    })});
    this.loadOptions()
    if(!(this.state.data.length === 0))
    {
        this.setState({loading : false});
    }else {
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: 'No record found'});
    }
    this.setState({currentuser:response.data.results.current_user});
    this.setState({totalRecords:response.data.count});
    return this.state.data;
  }

  removeKeyFromKeysInGroup = (e:any,key: any) => {
    e.preventDefault()
    if(key){
      var keysInGroup = this.state.keysInGroup;
      var keys = this.state.keys
      this.setState({keysInGroup: keysInGroup.filter((obj: any) => obj.value !== key.value)});
      keys.push(key);
      this.setState({keys: keys});
    }
  }

  addKeysToGroup = (e:any,key: any, cb:any) => {
    e.preventDefault()
    if(key){
      var keysInGroup = this.state.keysInGroup;
      var keys = this.state.keys
      this.setState({keys: keys.filter((obj: any) => obj.value !== key.value)});
      keysInGroup.push(key);
      this.setState({keysInGroup: keysInGroup});
      cb()
      this.setState({isSelected: null})
    }
  }

  renderEditForm=(show:any,id:any)=>{
    if(show){
      return(
        <>
          <tr style={{height:"0px"}}>
              <td colSpan={7}>
              <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Key Holder Informations</p>
                            </div>
                            <div className="col-6">
                                </div>
                        </div>
                    </div>
                </div>
                <ViewKeysGroupDetails group_id={id} fetchedData={this.fetchedData} loadc={this.loadc} load={this.load} viewdata={this.state.view}/>
              </td>
          </tr>
       </>
      )
    }
  }    

  componentDidMount = () =>{
    this.fetchedData(null,null);
  }

  details=(item:any,id1:any)=> {
    //this.setState({loading:true});
    const updatedData = this.state.data.map((obj:any,i:number)=>{
      if(i===id1){
        obj.showDetails = true;
      }else{
        obj.showDetails = false;
      }
      return {...obj}
    });
    this.setState({data:updatedData});
    this.setState({edit:true});
    this.setState({view:item.sequence, currentItem: item});
  }

  colourStyles ={
    option: (provided:any) => ({
      ...provided,
      backgroundColor: this.state.isSelected ? 'white' : 'white',
      cursor: 'pointer',
      color: this.state.isSelected ? 'black' : 'black',
      "&:hover": {
        backgroundColor: "#ccc"
      }
    }),
    control: (styles:any) => ({
      ...styles,
      cursor: 'pointer',
      
    }),
  }
   

  load = ()=>{
    this.setState({loading:false});
  }
   
  loadc = ()=>{
    this.setState({loading:true});
  }  

  modal = () =>{
    this.setState({modalIsOpen:false});
  }

  addToast=(mes:any)=>{
    this.toast.current.show({severity: 'success', detail: mes});
  }
  
  changeModal = () =>{
    this.setState({modalIsOpen:false});
  }

  filteOptions = () => {

  }

  promiseOptions = (inputValue: any) =>{
    new Promise(resolve => {
        resolve(this.state.keys);
    });
  }
  submit = async(values: any, id:any=null) => {
    var api = `/api/kdfinder/keysgroups/`;
    if(id){
      api = api + "group/" + id
    }
    values.keys  = this.state.keysInGroup.map((obj:any)=> obj.value)
    let response = await axiosInstance.post(api ,values, { headers: {'Content-Type': 'application/json'} } );
    if(response.data.success){
      this.changeModal()
      this.addToast("Successfuly added group")
      this.fetchedData(null,null)
    }        
  }

  loadOptions = async() => {
    const api = `/api/kdfinder/keysjson`;
    let response:any = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    var values =  response.data.data.map((obj: any) => {
      return{label: obj.name, value: obj.id}
    })
    this.setState({keys: values})
  }

  renderModal = (id:any,initialValues:any) =>{ 
    return(
        <>
        <div>
        <div style={{textAlign:'right'}} >
           <img alt="cancel" style={{width:'1.875rem',cursor:'pointer'}} onClick={this.closeModal} src={cancel}/>
        </div>
        <Formik
          initialValues={initialValues}
          validate={values => {
            var errors: any = {}
            if (!values.name) {
              errors['name'] = 'Required';
            }
            if (!values.user) {
              errors['user'] = 'Required';
            }
            if (this.state.keysInGroup.length ==0) {
              errors['keys'] = 'Required';
            }
            if (!values.tenant) {
              errors['tenant'] = 'Required';
            }
            if (!values.phone_no) {
              errors['phone_no'] = 'Required';
            }
            if (!values.email) {
              errors['email'] = 'Required';
            }
            if (!values.issueDate) {
              errors['issueDate'] = 'Required';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.submit(values, id)
            console.log(values)
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group col-6">
                  <label>Group Name</label>
                  <input type="text" name="name" 
                      className="form-control"
                      placeholder="Enter group name"
                      onChange={handleChange}
                      value={values.name}
                    />
                  <small id="locationHelp" className="form-text  text-danger">{errors.name}</small>
                </div>
                <div className="form-group col-6">
                  <label>Issue Date</label>
                  <Calendar id="basic" placeholder="DD/MM/YYYY " 
								 name="issueDate" style={{width: '100px'}} value={values.issueDate} className="w-100" onChange={(e:any) => setFieldValue("issueDate",e.value.toLocaleDateString("fr-CA"))}   showIcon/>
                  <small id="addressHelp" className="form-text  text-danger">{errors.issueDate}</small>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6">
                  <label>Tenant</label>
                  <input type="text" name="tenant" 
                      className="form-control"
                      placeholder="Enter Tenant"
                      onChange={handleChange}
                      value={values.tenant}
                    />
                  <small id="locationHelp" className="form-text  text-danger">{errors.tenant}</small>
                </div>
                <div className="form-group col-6">
                  <label>First/Last Name</label>
                  <input type="text" name="user" 
                      className="form-control"
                      placeholder="Enter Name"
                      onChange={handleChange}
                      value={values.user}
                    />
                  <small id="locationHelp" className="form-text  text-danger">{errors.user}</small>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6">
                  <label>Cell No</label>
                  <input type="text" name="phone_no" 
                      className="form-control"
                      placeholder="Enter Cell No"
                      onChange={handleChange}
                      value={values.phone_no}
                    />
                  <small id="locationHelp" className="form-text  text-danger">{errors.phone_no}</small>
                </div>
                <div className="form-group col-6">
                  <label>Email</label>
                  <input type="email" name="email" 
                      className="form-control"
                      placeholder="Enter Email"
                      onChange={handleChange}
                      value={values.email}
                    />
                  <small id="locationHelp" className="form-text  text-danger">{errors.email}</small>
                </div>
              </div>
              <div className="form-group">
                <label>Keys</label>
                <Select
                  placeholder={'Please select keys'}
                  getOptionLabel={e => e.label}
                  className="dropdown"
                  isClearable
                  value={this.state.isSelected}
                  getOptionValue={e => e.value}
                  options={this.state.keys} // set list of the data
                  onChange={(opt, e) => {
                    this.setState({isSelected: opt})
                    setFieldValue("keys",opt)
                  }}
                />
                
                <small id="addressHelp" className="form-text  text-danger">{errors.keys}</small>
              </div>
              
              <button className="btn btn-sm btn-secondary mb-2" onClick={(e) => this.addKeysToGroup(e,values.keys, ()=> setFieldValue("keys", null))} >
                Add key to Group
              </button>
              <div className="form-group">
                
                <div className="accordian"> 
                    <div className="col-12">
                        <div className="row">
                          <p style={{color:"#fff",textAlign:"left",marginTop:"10px"}}>Keys In group</p>

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="container p-0" style={{minHeight: '100px'}}>
                    {this.state.keysInGroup.map((obj: any) => {
                        return (
                        <button className="btn btn-sm btn-success m-2">
                          {obj.label}
                          <span className="badge" onClick={(e: any) => this.removeKeyFromKeysInGroup(e,obj)} style={{background: "white", paddingBottom: '4px', color: "#28a745", marginLeft:"5px"}} >x</span>
                        </button>)
                      })}
                    </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={errors.user != undefined || errors.name != undefined || this.state.keysInGroup.length == 0 || errors.issueDate != undefined}>
                Save And Close
              </button>
            </form>
          )}
        </Formik>
        </div>
        </>
    )
  }

  openModal = () => {
    this.setState({modalIsOpen:true});
  }

  onPageChange = (event:any) => {
    this.setState({offset:event.first,limit:event.rows});
    this.fetchedData(event.first,event.rows);
  }
  
  handleNewGroup = () => {
    this.loadOptions()
    var issueDate = new Date()
    var initialValues = {name: '', user: '',issueDate: issueDate, keys: [], email: '', phone_no: '', tenant: ''}
    this.setState({keysInGroup: [], isSelected: null})
    this.setState({initialValues: initialValues})
    this.openModal()
  }

  closeModal = () =>{
    this.setState({modalIsOpen:false});
  }
  
  deleteGroup = async (id:any) => {
    const api = `/api/kdfinder/keysgroups/`;
    if (window.confirm('Do you want to delete this group?')) {
      let response = await axiosInstance.delete(api , { data: {id: id},headers: {'Content-Type': 'application/json'} } );
      if(response.data.success){
        this.changeModal()
        this.addToast("Successfuly removed group")
        this.fetchedData(null,null)
      }  
      console.log('Thing was saved to the database.');
    } 
  }

  editGroup = async (id:any) => {
    var obj = this.state.data.filter((obj: any) => {
      return obj.id == id
    });
    this.loadOptions()
    if (obj.length > 0) {
      var user;
      var email;
      var phone_no;
      var tenant;
      var keys:any[] = [];
      var keyValues:any[] = [];
      obj[0].sequence.map((item: any) => {
        user = item.key_holder
        tenant = item.tenant_location
        phone_no = item.phone
        email = item.email
        keys.push({
          label: item.key_id +"-"+ item.sequence,
          value: item.id
        })
      });
      var name = obj[0].name
      var issueDate = new Date(obj[0].issue_date)
      var initialValues = {name: name, user: user,email: email,tenant: tenant,phone_no: phone_no,issueDate: issueDate, keys: keyValues}
      this.setState({selectedId: null})
      this.setState({initialValues: initialValues})
      this.state.freeKeys.forEach(key => {
        keys.push(key)
      })
      this.setState({keysInGroup: keys});
      this.openModal()
    }
  }

  render(){
    const lastLoginDate  = this.state.currentuser.last_login? new Date(this.state.currentuser.last_login).toLocaleDateString(): '';
    const lastUpdatedDate = this.state.currentuser.last_modified? new Date(this.state.currentuser.last_modified).toLocaleDateString(): "";
    return (
      <>
        <div>
            <Modal style={customStyles} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>{this.renderModal(this.state.selectedId,this.state.initialValues)}</Modal>
            <div>
            {
              this.state.loading  ? <div className='overlay-box1'>
              <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
          </div> :''
            }
            <Toast ref={this.toast} />
              <div className="upper1" >
                <div className="row col-md-12">
                    <div  className="col-6">
                        <p><span style={{color:"#009DD0",fontSize:"1.5rem"}}><span style={{fontWeight:"bold", marginRight:".6rem"}}>Welcome</span>{this.state.currentuser.first_name} {this.state.currentuser.last_name}</span></p>
                        <p> Your last log in was on :  <strong>{lastLoginDate}</strong></p>
                        <p>Last Updated:  <strong>{lastUpdatedDate}</strong></p>
                    </div> 
                    <div className="col-6 align-items-end justify-content-end d-flex">
                      <button onClick={this.handleNewGroup} style={this.state.add_group ? {fontWeight:"lighter"}: {visibility:"hidden"}} className="btn btn-outline-danger">+Add New Group</button>
                    </div>
                </div>
              </div>
              <div className="content" >
            <table className="table" style={{backgroundColor:"#fff"}}>
              <thead style={{ color: "#fff",backgroundColor:"#12739A" }}>
                <tr>
                  <th data-visible="true" >Group Name</th>
                  <th>Tenant</th>
                  <th>First/Last Name</th>
                  <th>Email</th>
                  <th>Cell No</th>
                  <th>Issue Date</th>
                  <th style={{textAlign:"right"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
              {this.state.data.map((item: any,i: any)=>{
              return(
                <>
                <tr key={i}>
                  <td><span onClick={()=>this.details(item,i)} style={{cursor:"pointer",color:"#009ED6",textDecoration:"underline"}}>{item.name}</span></td>
                  <td>{item.sequence.length > 0 ? item.sequence[0].tenant_location : ''}</td>
                  <td>{item.sequence.length > 0 ? item.sequence[0].key_holder : ''}</td>
                  <td>{item.sequence.length > 0 ? item.sequence[0].email : ''}</td>
                  <td>{item.sequence.length > 0 ? item.sequence[0].phone : ''}</td>
                  <td>{item.sequence.length > 0 ? (new Date(item.sequence[0].date_issued)).toLocaleDateString("fr-CA") : ''}</td>

                  <td style={{textAlign:"right"}}>
                    <img alt="viewkeys" style={{marginLeft:"0.6rem",width:'0.8rem'}} src={edit1} onClick={() => this.editGroup(item.id)}/>

                    <img alt="delete" style={{marginLeft:"0.938rem",cursor:"pointer",width:'0.8rem'}} onClick={() =>this.deleteGroup(item.id)} src={removeIcon}/>
                  </td>
                </tr>
                {this.renderEditForm(item.showDetails,item.id)}
                </>
                )})}
              </tbody>
              </table>
              <Paginator first={this.state.offset} rows={this.state.limit} totalRecords={this.state.totalRecords} rowsPerPageOptions={[10, 20, 30]} 
                    template="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                    onPageChange={this.onPageChange}></Paginator>
                    
              </div>
            </div>
            </div>
          </>
      );
    }
  }
export default ViewKeysGroup;  