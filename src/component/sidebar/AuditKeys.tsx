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
  groups:any;
  view:any;
  currentuser:any;
  showDetails: any;
  isSelected:any;
  file:any;
  files:any;
  limit:any;
  offset:any;
  auditType: any;
  loading : boolean;
  modalIsOpen : boolean;
  door_compromised:any;
  currentItem: any;
  add_group: any;
  csvTable:any;
  keys: any[];
  freeKeys: any[];
  selectedKeys: any;
  selectedGroups: any;
  initialValues: any;
  groupsDetails: any;
  keysDetails: any;
}

class AuditKeys extends React.Component<{},Props> {
  toast: React.RefObject<any>;

  constructor(props:Props){
    super(props);
    this.toast = React.createRef();

    this.state={
      showDetails: false,
      edit:false,
      keysDetails: {},
      groupsDetails: {},
      groups:[],
      auditType: null,
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
      selectedKeys:[],
      selectedGroups:[]
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

    
  fetchedData = async() => {
    this.setState({loading : true});
    this.details()
    this.setState({loading : false});
    
    return ;
  }

  
  componentDidMount = () =>{
    this.details()
    this.fetchedData();
  }

  load = ()=>{
    this.setState({loading:false});
  }
   
  loadc = ()=>{
    this.setState({loading:true});
  }  


  addToast=(mes:any)=>{
    this.toast.current.show({severity: 'success', detail: mes});
  }
  
  openGroups = async() => {
    this.setState({auditType: 'group'})
    this.setState({loading: true,selectedGroups: []})
    this.fetchGroups()
  }

  fetchGroups = async () =>{
    const api = `/api/kdfinder/keysgroupsjson`;
    let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    this.setState({groups:response.data.data.map((obj:any)=>{
      return({...obj, showDetails: false
      })
    })});
    if(!(this.state.groups.length === 0))
    {
        this.setState({loading : false});
    }else {
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: 'No group found'});
    }
  }
  
  details = async() => {
    const api = `/api/kdfinder/keyaudits`;
    let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    this.setState({groupsDetails:response.data.groups, keysDetails:response.data.keys });
  }

  openKeys = async() => {
    this.setState({auditType: 'selectKeys', selectedKeys: []})
    this.setState({loading: true})
    this.fetchKeys()
  }

  addInSelectedKeysList = (e: any) => {
    var selectedKeys = this.state.selectedKeys
    if(e.target.checked){
      if(e.target.value === "all"){
        var keysId = this.state.keys.map((obj: any) =>  obj.id)
        this.setState({selectedKeys: keysId})
      }else{
        selectedKeys.push(Number(e.target.value));
        this.setState({selectedKeys: selectedKeys});
      }
    }else{
      var selectedKeys = this.state.selectedKeys
      if(e.target.value === "all"){
        this.setState({selectedKeys: []})
      }else{
        selectedKeys = selectedKeys.filter((obj: any) => obj != e.target.value)
        this.setState({selectedKeys: selectedKeys});
      }
    }
  }

  runKeysReport = async() => {
      this.setState({loading: true})
      const api = `/api/kdfinder/select_seqs_json/`;
      let response = await axiosInstance.post(api ,{keys: this.state.selectedKeys} ,{ headers: {'Content-Type': 'application/json'} } );
      
      if(response.data.success)
      {
          this.setState({loading : false});
        this.toast.current.show({severity: 'success',  detail: 'Successful run report'});
        this.setState({auditType: ''})
        this.fetchedData()

      }else {
        this.setState({loading : false});
        this.toast.current.show({severity: 'error',  detail: 'Something went wrong'});
        this.setState({auditType: ''})

      }
  }
  
  runGroupsReport = async() => {
    this.setState({loading: true})
    const api = `/api/kdfinder/keysgroupsjson/`;
    let response = await axiosInstance.post(api ,{groups: this.state.selectedGroups} ,{ headers: {'Content-Type': 'application/json'} } );
    
    if(response.data.success)
    {
        this.setState({loading : false});
      this.toast.current.show({severity: 'success',  detail: 'Successful run report'});
      this.setState({auditType: ''})
      this.fetchedData()

    }else {
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: 'Something went wrong'});
      this.setState({auditType: ''})

    }

  }

  addInSelectedGroupsList = (e: any) => {
    var selectedGroups = this.state.selectedGroups
    if(e.target.checked){
      if(e.target.value === "all"){
        var groupIds = this.state.groups.map((obj: any) =>  obj.id)
        this.setState({selectedGroups: groupIds})
      }else{
        selectedGroups.push(Number(e.target.value));
        this.setState({selectedGroups: selectedGroups});
      }
    }else{
      var selectedGroups = this.state.selectedGroups
      if(e.target.value === "all"){
        this.setState({selectedGroups: []})
      }else{
        selectedGroups = selectedGroups.filter((obj: any) => obj != e.target.value)
        this.setState({selectedGroups: selectedGroups});
      }
    }
  }

  fetchKeys = async () =>{
    const api = `/api/kdfinder/select_seqs_json`;
    let response = await axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } );
    this.setState({keys:response.data.data.map((obj:any)=>{
      return({...obj, showDetails: false
      })
    })});
    if(!(this.state.keys.length === 0))
    {
        this.setState({loading : false});
    }else {
      this.setState({loading : false});
      this.toast.current.show({severity: 'error',  detail: 'No key found'});
    }
  }
  completeAudit = (type: string) =>{
    const api = `/api/kdfinder/complete_audit/${type}`;
      axiosInstance.get(api , { headers: {'Content-Type': 'application/json'} } ).then((response: any) => {
        this.fetchedData()
      })
  }

  render(){
    return (
      <>
        <div>
            <div>
            {
              this.state.loading  ? <div className='overlay-box1'>
              <FadeLoader css={override} color={"rgb(0, 158, 214)"} loading={this.state.loading}  height={30} width={5} radius={2} margin={20} />
          </div> :''
            }
            <Toast ref={this.toast} />
             <div className="upper1 p-0" style={{height:"12.5rem"}} >
                <table id="MyTable" className="table" style={{backgroundColor:"#fff"}}>
                    <thead style={{ color: "#fff",backgroundColor:"#12739A"}}>
                    <tr>
                        <th>Run Audit</th>
                        <th>Keys Confirmed</th>
                        <th>Waiting for Confirmation</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody className="table-bordered">
                        <tr style={{cursor: 'pointer'}} >
                            <td onClick={ this.openGroups}>Audit Key Groups</td>
                            <td onClick={ this.openGroups}>{this.state.groupsDetails.confirmed}</td>
                            <td onClick={ this.openGroups}>{this.state.groupsDetails.waiting}</td>
                            <td><a href="javascript:void(0)" onClick={ () => this.completeAudit('group')}>Complete Audit</a></td>
                        </tr>
                        <tr style={{cursor: 'pointer'}} >
                            <td onClick={ this.openKeys}>Audit Selection of Keys</td>
                            <td onClick={ this.openKeys}>{this.state.keysDetails.confirmed}</td>
                            <td onClick={ this.openKeys}>{this.state.keysDetails.waiting}</td>
                            <td ><a href="javascript:void(0)" onClick={ () => this.completeAudit('key')} >Complete Audit</a></td>
                        </tr>
                    </tbody> 
                </table>
            </div>
            {
                this.state.auditType  === 'group' ?
            
                     <div className="content"  >
            <table className="table" style={{backgroundColor:"#fff"}}>
              <thead style={{ color: "#fff",backgroundColor:"#12739A" }}>
                <tr>
                    <th><input type="checkbox" value={"all"} onChange={this.addInSelectedGroupsList} /> Select</th>
                  <th data-visible="true" >Group Name</th>
                </tr>
              </thead>
              <tbody>
              {this.state.groups.map((item: any,i: any)=>{
              return(
                <>
                <tr key={i}>
                  <td><input type="checkbox" value={item.id} onChange={this.addInSelectedGroupsList} checked={this.state.selectedGroups.includes(item.id)}/></td>
                  <td>{item.name}</td>
                </tr>
                </>
                )})}
              </tbody>
              </table>
              <button className="btn btn-primary m-1" style={{background: 'rgb(18, 115, 154)'}} disabled={this.state.selectedGroups.length ==0} onClick={this.runGroupsReport}>Run Report</button>
              <button className="btn btn-danger m-1" onClick={() => this.setState({auditType: ''})}>Cancel</button>
              </div>
                :  
                    ''
            }
            {
                this.state.auditType  === 'selectKeys' ?
            
                     <div className="content"  >
                        <table className="table" style={{backgroundColor:"#fff"}}>
                            <thead style={{ color: "#fff",backgroundColor:"#12739A" }}>
                            <tr>
                               <th><input type="checkbox" value={"all"} onChange={this.addInSelectedKeysList} /> Select</th>

                                <th data-visible="true" >Key ID Stamp</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>
                            </thead>
                            <tbody className='tbody'>
                            {this.state.keys.map((item: any,i: any)=>{
                            return(
                            <>
                            <tr key={i}>
                               <td><input type="checkbox" value={item.id} onChange={this.addInSelectedKeysList} checked={this.state.selectedKeys.includes(item.id)}/></td>
                                <td>{item.key_id +" - "+ item.sequence}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                            </tr>
                            
                            </>
                            )})}
                            </tbody>
                        </table>
                        <button className="btn btn-primary m-1" style={{background: 'rgb(18, 115, 154)'}} disabled={this.state.selectedKeys.length ==0} onClick={this.runKeysReport}>Run Report</button>
                         <button className="btn btn-danger m-1" onClick={() => this.setState({auditType: ''})}>Cancel</button>
             
                    </div>
                :  
                    ''
            }
           </div>
            </div>
          </>
      );
    }
  }
export default AuditKeys;  