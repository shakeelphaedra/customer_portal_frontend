import React from 'react';
import brokenkey from '../icons/BrokenKey.svg';
import questionmark from '../icons/questionmark.svg';
import deleteIcon from '../icons/delete.png';
import 'jspdf-autotable';
import tick from '../icons/tick.svg';
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


class ViewKeysGroupDetails extends React.Component<{viewdata:any,load:any,loadc:any, group_id: any, fetchedData: any},Props> {
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


  componentDidMount=()=>{
    this.props.load();
    this.setState({data : this.props.viewdata.map((obj:any)=>{
      return({...obj, editData: false
      })
    })});
  };
  removeItem = async (item: any) =>{
    const api = `/api/kdfinder/keysgroups/remove_item`;
      let response = await axiosInstance.post(api , {id: item.id, group_id: this.props.group_id},{headers: {'Content-Type': 'application/json'} } );
      if(response.data.success){
        if(response.data.delete)
        this.props.fetchedData(null, null)
        var index = this.state.data.indexOf(item);
        if (index > -1) {
            this.state.data.splice(index, 1)
            this.setState({data: this.state.data});
        }
      }  
  }

    handleInputChange  = () => {

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
          <table className="table" style={{border :'2px solid #12739A'}} >
            <thead >
              <tr>
                <th style={{fontWeight:500,margin:0,width:"6.65rem"}} scope="col">Key ID Stamp</th>
              </tr>
            </thead>
            <tbody >
            {this.state.data.map((item: any,i: any)=>{
             return(
              <tr key={i}>
                <th style={{margin:0,width:"6.65rem"}} scope="row">{item.key_id +" - "+ item.sequence}
                <img alt="viewkeys" style={{marginLeft:"0.7rem",width:'1.3rem'}} src={deleteIcon} onClick={() => this.removeItem(item)}/>
                </th>
              </tr>
              )})}
            </tbody>
          </table>
          </div>
          </>
      );
    }
  }

export default ViewKeysGroupDetails;  