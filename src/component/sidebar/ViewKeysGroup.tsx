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

import AsyncSelect from 'react-select/async';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-20%',
    transform             : 'translate(-50%, -50%)',
    height: '30rem',
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
      height: '30rem',
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

  renderEditForm=(show:any,id:any)=>{
    if(show){
      return(
        <>
          <tr style={{height:"0px"}}>
              <td colSpan={4}>
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
                <ViewKeysGroupDetails loadc={this.loadc} load={this.load} viewdata={this.state.view}/>
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
    values.keys  = values.keys.map((obj:any)=> obj.value)
    let response = await axiosInstance.post(api ,values, { headers: {'Content-Type': 'application/json'} } );
    if(response.data.success){
      this.changeModal()
      this.addToast("Successfuly added group")
      this.fetchedData(null,null)
    }        
  }

  loadOptions = async(input: any) => {
    const api = `/api/kdfinder/keysjson?keyCode=${input}`;
    let response:any = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    var values =  response.data.data.map((obj: any) => {
      return{label: obj.name, value: obj.id}
    })
    debugger
    return values;
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
            if (!values.keys) {
              errors['keys'] = 'Required';
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
                  <small id="locationHelp" className="form-text text-muted text-danger">{errors.name}</small>
                </div>
                <div className="form-group col-6">
                  <label>Issue Date</label>
                  <Calendar id="basic" placeholder="DD/MM/YYYY " 
								 name="issueDate" style={{width: '100px'}} value={values.issueDate} className="w-100" onChange={(e:any) => setFieldValue("issueDate",e.value.toLocaleDateString("fr-CA"))}   showIcon/>
                  <small id="addressHelp" className="form-text text-muted text-danger">{errors.issueDate}</small>
                </div>
              </div>
              <div className="form-group">
                <label>Keys</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder={'Please select keys'}
                  isSearchable={false}
                  value={values.keys}
                  getOptionLabel={e => e.label}
                  getOptionValue={e => e.value}
                  loadOptions={this.loadOptions}
                  onChange={(opt, e) => {
                    setFieldValue("keys",opt)
                  }}
                  isMulti
                />
                <small id="addressHelp" className="form-text text-muted text-danger">{errors.keys}</small>
              </div>
              <div className="form-group">
                <label>User</label>
                <input type="text" name="user" 
                    className="form-control"
                    placeholder="Enter user"
                    onChange={handleChange}
                    value={values.user}
                  />
                <small id="addressHelp" className="form-text text-muted text-danger">{errors.user}</small>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={errors.user != undefined || errors.name != undefined || errors.keys != undefined || errors.issueDate != undefined}>
                Save 
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
    var issueDate = new Date()
    var initialValues = {name: '', user: '',issueDate: issueDate, keys: []}
    this.setState({selectedId: null})
    this.setState({initialValues: initialValues})
    this.setState({keys: this.state.freeKeys})
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
    if (obj.length > 0) {
      var user;
      var keys:any[] = [];
      var keyValues:any[] = [];
      obj[0].sequence.map((item: any) => {
        user = item.key_holder
        keys.push({
          label: item.key_id +"-"+ item.sequence,
          value: item.id
        })
        keyValues.push({
          label: item.key_id +"-"+ item.sequence,
          value: item.id
        })
      });
      var name = obj[0].name
      var issueDate = new Date(obj[0].issue_date)
      var initialValues = {name: name, user: user,issueDate: issueDate, keys: keyValues}
      this.setState({selectedId: id})
      this.setState({initialValues: initialValues})
      this.state.freeKeys.forEach(key => {
        keys.push(key)
      })
      this.setState({keys: keys});
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
                  <td>{(new Date(item.issue_date)).toLocaleDateString("fr-CA")}</td>
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